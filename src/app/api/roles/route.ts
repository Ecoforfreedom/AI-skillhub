import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { ROLES } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Get skill counts per role
    const allRoleSkills = await prisma.skill.findMany({
      where: { isActive: true, isHidden: false },
      select: { roleCategories: true },
    })

    const counts: Record<string, number> = {}
    for (const skill of allRoleSkills) {
      for (const role of skill.roleCategories) {
        counts[role] = (counts[role] || 0) + 1
      }
    }

    const roles = ROLES.map(r => ({ ...r, count: counts[r.id] || 0 }))

    return NextResponse.json({ roles })
  } catch (err) {
    console.error('[GET /api/roles]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
