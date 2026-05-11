import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').trim()
  const limit = Math.min(20, parseInt(searchParams.get('limit') || '12'))

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    const results = await prisma.skill.findMany({
      where: {
        isActive: true,
        isHidden: false,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { oneLiner: { contains: q, mode: 'insensitive' } },
          { chineseSummary: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { whyUseful: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { score: 'desc' },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        oneLiner: true,
        score: true,
        pricingType: true,
        roleCategories: true,
        functionCategories: true,
      },
    })

    return NextResponse.json({ results })
  } catch (err) {
    console.error('[GET /api/search]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
