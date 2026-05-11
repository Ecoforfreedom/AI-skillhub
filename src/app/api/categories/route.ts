import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { CATEGORIES } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const allSkills = await prisma.skill.findMany({
      where: { isActive: true, isHidden: false },
      select: { functionCategories: true },
    })

    const counts: Record<string, number> = {}
    for (const skill of allSkills) {
      for (const cat of skill.functionCategories) {
        counts[cat] = (counts[cat] || 0) + 1
      }
    }

    const categories = CATEGORIES.map(c => ({ ...c, count: counts[c.id] || 0 }))

    return NextResponse.json({ categories })
  } catch (err) {
    console.error('[GET /api/categories]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
