import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    const { id } = params
    const body = await req.json()

    // Whitelist updatable fields
    const allowed = [
      'name', 'oneLiner', 'chineseSummary', 'officialUrl', 'githubUrl',
      'roleCategories', 'functionCategories', 'tags', 'difficulty',
      'requiresCoding', 'isOpenSource', 'pricingType', 'score', 'scoreReason',
      'isActive', 'isHidden', 'isRelevant', 'whyUseful', 'timeSavedReason',
      'limitations', 'riskNotes', 'workflowSteps', 'useCases',
    ]

    const data: any = {}
    for (const key of allowed) {
      if (key in body) data[key] = body[key]
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const skill = await prisma.skill.update({
      where: { id },
      data,
    })

    return NextResponse.json({ skill })
  } catch (err) {
    console.error('[PATCH /api/admin/skills/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    await prisma.skill.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/skills/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
