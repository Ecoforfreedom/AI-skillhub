import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

// Returns public homepage stats
export async function GET() {
  try {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const [total, newThisWeek, newToday, freeCount, openSourceCount] = await Promise.all([
      prisma.skill.count({ where: { isActive: true, isHidden: false } }),
      prisma.skill.count({ where: { isActive: true, isHidden: false, createdAt: { gte: weekAgo } } }),
      prisma.skill.count({ where: { isActive: true, isHidden: false, createdAt: { gte: todayStart } } }),
      prisma.skill.count({ where: { isActive: true, isHidden: false, pricingType: { in: ['free', 'freemium', 'open_source'] } } }),
      prisma.skill.count({ where: { isActive: true, isHidden: false, isOpenSource: true } }),
    ])

    return NextResponse.json({
      totalSkills: total,
      newThisWeek,
      newToday,
      freeSkills: freeCount,
      openSourceSkills: openSourceCount,
    })
  } catch (err) {
    console.error('[GET /api/stats]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
