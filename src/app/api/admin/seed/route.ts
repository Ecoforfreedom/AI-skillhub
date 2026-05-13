import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import prisma from '@/lib/db'
import { seedSkills, TARGET_SEED_SKILL_COUNT } from '@/lib/seed'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    const before = await prisma.skill.count()
    await seedSkills(false)
    const after = await prisma.skill.count()

    return NextResponse.json({
      ok: true,
      target: TARGET_SEED_SKILL_COUNT,
      before,
      after,
      inserted: Math.max(0, after - before),
      message: `Seed complete: ${before} -> ${after} skills`,
    })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}
