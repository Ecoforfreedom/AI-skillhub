import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'overall'

  const baseWhere = { isActive: true, isHidden: false }

  try {
    const rankings: Record<string, any[]> = {}

    if (type === 'overall' || type === 'all') {
      rankings.overall = await prisma.skill.findMany({
        where: baseWhere,
        orderBy: { score: 'desc' },
        take: 20,
        select: { id: true, name: true, slug: true, oneLiner: true, score: true, pricingType: true, roleCategories: true, functionCategories: true, stars: true },
      })
    }

    if (type === 'newest' || type === 'all') {
      rankings.newest = await prisma.skill.findMany({
        where: baseWhere,
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: { id: true, name: true, slug: true, oneLiner: true, score: true, pricingType: true, roleCategories: true, functionCategories: true, createdAt: true },
      })
    }

    if (type === 'free' || type === 'all') {
      rankings.free = await prisma.skill.findMany({
        where: { ...baseWhere, pricingType: { in: ['free', 'freemium', 'open_source'] } },
        orderBy: { score: 'desc' },
        take: 20,
        select: { id: true, name: true, slug: true, oneLiner: true, score: true, pricingType: true, roleCategories: true, functionCategories: true },
      })
    }

    if (type === 'opensource' || type === 'all') {
      rankings.opensource = await prisma.skill.findMany({
        where: { ...baseWhere, isOpenSource: true },
        orderBy: { score: 'desc' },
        take: 20,
        select: { id: true, name: true, slug: true, oneLiner: true, score: true, pricingType: true, stars: true, roleCategories: true, functionCategories: true },
      })
    }

    // Role-based rankings
    const roleRankings = [
      { key: 'consulting', role: 'consulting' },
      { key: 'marketing', role: 'marketing' },
      { key: 'finance', role: 'finance' },
      { key: 'product', role: 'product' },
      { key: 'research', role: 'research' },
      { key: 'engineering', role: 'engineering' },
    ]

    for (const { key, role } of roleRankings) {
      if (type === key || type === 'all') {
        rankings[key] = await prisma.skill.findMany({
          where: { ...baseWhere, roleCategories: { has: role } },
          orderBy: { score: 'desc' },
          take: 10,
          select: { id: true, name: true, slug: true, oneLiner: true, score: true, pricingType: true, roleCategories: true, functionCategories: true },
        })
      }
    }

    return NextResponse.json({ rankings })
  } catch (err) {
    console.error('[GET /api/rankings]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
