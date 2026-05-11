import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const skill = await prisma.skill.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isHidden: false,
      },
    })

    if (!skill) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Fetch similar tools (by slug matching)
    let similarSkills: any[] = []
    if (skill.similarTools.length > 0) {
      similarSkills = await prisma.skill.findMany({
        where: {
          name: { in: skill.similarTools },
          isActive: true,
          isHidden: false,
        },
        select: { id: true, name: true, slug: true, oneLiner: true, score: true, pricingType: true },
        take: 4,
      })
    }

    // If no similar skills found by name, find by shared categories
    if (similarSkills.length === 0 && skill.functionCategories.length > 0) {
      similarSkills = await prisma.skill.findMany({
        where: {
          id: { not: skill.id },
          isActive: true,
          isHidden: false,
          functionCategories: { hasSome: skill.functionCategories },
        },
        orderBy: { score: 'desc' },
        select: { id: true, name: true, slug: true, oneLiner: true, score: true, pricingType: true },
        take: 4,
      })
    }

    return NextResponse.json({ skill, similarSkills })
  } catch (err) {
    console.error('[GET /api/skills/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
