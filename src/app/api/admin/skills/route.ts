import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const authError = requireAdmin(req)
  if (authError) return authError

  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const pageSize = Math.min(50, parseInt(searchParams.get('pageSize') || '20'))
  const filter = searchParams.get('filter') || 'all' // all | pending | active | hidden | irrelevant

  const where: any = {}
  if (filter === 'pending') where.oneLiner = null
  else if (filter === 'active') where.isActive = true
  else if (filter === 'hidden') where.isHidden = true
  else if (filter === 'irrelevant') where.isRelevant = false

  try {
    const [total, skills] = await Promise.all([
      prisma.skill.count({ where }),
      prisma.skill.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true, name: true, slug: true, oneLiner: true, score: true,
          isActive: true, isHidden: true, isRelevant: true,
          pricingType: true, sourceType: true, stars: true,
          createdAt: true, updatedAt: true, roleCategories: true,
          functionCategories: true, lastCrawledAt: true,
        },
      }),
    ])

    return NextResponse.json({ skills, total, page, pageSize, totalPages: Math.ceil(total / pageSize) })
  } catch (err) {
    console.error('[GET /api/admin/skills]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
