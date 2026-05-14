import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { getTrafficStats } from '@/lib/analytics'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    const [
      totalSkills,
      activeSkills,
      pendingEnrichment,
      hiddenSkills,
      irrelevantSkills,
      recentCrawls,
      totalEnrichments,
      traffic,
    ] = await Promise.all([
      prisma.skill.count(),
      prisma.skill.count({ where: { isActive: true } }),
      prisma.skill.count({ where: { oneLiner: null, isHidden: false } }),
      prisma.skill.count({ where: { isHidden: true } }),
      prisma.skill.count({ where: { isRelevant: false } }),
      prisma.crawlLog.count({
        where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      }),
      prisma.enrichmentLog.count(),
      getTrafficStats(),
    ])

    return NextResponse.json({
      totalSkills,
      activeSkills,
      pendingEnrichment,
      hiddenSkills,
      irrelevantSkills,
      recentCrawls,
      totalEnrichments,
      traffic,
    })
  } catch (err) {
    console.error('[GET /api/admin/stats]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
