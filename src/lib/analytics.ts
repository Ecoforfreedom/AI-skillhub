import { randomUUID } from 'crypto'
import prisma from '@/lib/db'

let tableReady: Promise<void> | null = null

export async function ensurePageViewsTable() {
  if (!tableReady) {
    tableReady = (async () => {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS page_views (
          id TEXT PRIMARY KEY,
          path TEXT NOT NULL,
          referrer TEXT,
          user_agent TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views (created_at)`
      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS page_views_path_idx ON page_views (path)`
    })()
  }

  return tableReady
}

export function normalizeTrackedPath(path: unknown) {
  if (typeof path !== 'string') return null

  const trimmed = path.trim().slice(0, 300)
  if (!trimmed.startsWith('/')) return null
  if (trimmed.startsWith('/api') || trimmed.startsWith('/admin')) return null

  return trimmed || '/'
}

export async function recordPageView(input: {
  path: string
  referrer?: string | null
  userAgent?: string | null
}) {
  await ensurePageViewsTable()

  await prisma.$executeRaw`
    INSERT INTO page_views (id, path, referrer, user_agent)
    VALUES (${randomUUID()}, ${input.path}, ${input.referrer?.slice(0, 500) || null}, ${input.userAgent?.slice(0, 500) || null})
  `
}

function toNumber(value: unknown) {
  if (typeof value === 'bigint') return Number(value)
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value) || 0
  return 0
}

export async function getTrafficStats() {
  await ensurePageViewsTable()

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [totalRows, todayRows, weekRows, monthRows, topPaths, dailyRows] = await Promise.all([
    prisma.$queryRaw<Array<{ views: number | bigint }>>`SELECT COUNT(*)::int AS views FROM page_views`,
    prisma.$queryRaw<Array<{ views: number | bigint }>>`SELECT COUNT(*)::int AS views FROM page_views WHERE created_at >= ${todayStart}`,
    prisma.$queryRaw<Array<{ views: number | bigint }>>`SELECT COUNT(*)::int AS views FROM page_views WHERE created_at >= ${weekAgo}`,
    prisma.$queryRaw<Array<{ views: number | bigint }>>`SELECT COUNT(*)::int AS views FROM page_views WHERE created_at >= ${monthAgo}`,
    prisma.$queryRaw<Array<{ path: string; views: number | bigint }>>`
      SELECT path, COUNT(*)::int AS views
      FROM page_views
      GROUP BY path
      ORDER BY views DESC, path ASC
      LIMIT 8
    `,
    prisma.$queryRaw<Array<{ day: string; views: number | bigint }>>`
      SELECT to_char(created_at, 'YYYY-MM-DD') AS day, COUNT(*)::int AS views
      FROM page_views
      WHERE created_at >= ${weekAgo}
      GROUP BY day
      ORDER BY day ASC
    `,
  ])

  return {
    totalViews: toNumber(totalRows[0]?.views),
    todayViews: toNumber(todayRows[0]?.views),
    weekViews: toNumber(weekRows[0]?.views),
    monthViews: toNumber(monthRows[0]?.views),
    topPaths: topPaths.map(row => ({ path: row.path, views: toNumber(row.views) })),
    dailyViews: dailyRows.map(row => ({ day: row.day, views: toNumber(row.views) })),
  }
}
