import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const authError = requireAdmin(req)
  if (authError) return authError

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'crawl'
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const pageSize = 20

  try {
    if (type === 'crawl') {
      const [total, logs] = await Promise.all([
        prisma.crawlLog.count(),
        prisma.crawlLog.findMany({
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
      ])
      return NextResponse.json({ logs, total, page, pageSize })
    }

    if (type === 'enrichment') {
      const [total, logs] = await Promise.all([
        prisma.enrichmentLog.count(),
        prisma.enrichmentLog.findMany({
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: {
            skill: { select: { name: true, slug: true } },
          },
        }),
      ])
      return NextResponse.json({ logs, total, page, pageSize })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (err) {
    console.error('[GET /api/admin/logs]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
