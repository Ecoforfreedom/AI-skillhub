import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { ensureSeeded } from '@/lib/seed'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await ensureSeeded('[GET /api/skills]')

    const { searchParams } = new URL(req.url)

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const pageSize = Math.min(48, Math.max(1, parseInt(searchParams.get('pageSize') || '24')))
    const roles = searchParams.getAll('role')
    const categories = searchParams.getAll('category')
    const pricing = searchParams.getAll('pricing')
    const difficulty = searchParams.getAll('difficulty')
    const requiresCoding = searchParams.get('requiresCoding')
    const isOpenSource = searchParams.get('isOpenSource')
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'score'

    const where: any = {
      isActive: true,
      isHidden: false,
    }

    if (roles.length > 0) {
      where.roleCategories = { hasSome: roles }
    }
    if (categories.length > 0) {
      where.functionCategories = { hasSome: categories }
    }
    if (pricing.length > 0) {
      where.pricingType = { in: pricing }
    }
    if (difficulty.length > 0) {
      where.difficulty = { in: difficulty }
    }
    if (requiresCoding === 'false') {
      where.requiresCoding = false
    }
    if (isOpenSource === 'true') {
      where.isOpenSource = true
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { oneLiner: { contains: search, mode: 'insensitive' } },
        { chineseSummary: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } },
      ]
    }

    const orderBy: any =
      sortBy === 'stars' ? { stars: 'desc' }
      : sortBy === 'newest' ? { createdAt: 'desc' }
      : sortBy === 'votes' ? { votes: 'desc' }
      : { score: 'desc' }

    const [total, skills] = await Promise.all([
      prisma.skill.count({ where }),
      prisma.skill.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          slug: true,
          oneLiner: true,
          chineseSummary: true,
          officialUrl: true,
          githubUrl: true,
          roleCategories: true,
          functionCategories: true,
          tags: true,
          difficulty: true,
          requiresCoding: true,
          isOpenSource: true,
          pricingType: true,
          stars: true,
          score: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ])

    return NextResponse.json({
      skills,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch (err) {
    console.error('[GET /api/skills]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
