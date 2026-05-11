import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { enrichPendingSkills, enrichSkill } from '@/lib/enrichment/openai'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json().catch(() => ({}))
    const skillId: string | undefined = body.skillId
    const limit: number = body.limit || 10

    if (skillId) {
      // Enrich a specific skill
      enrichSkill(skillId).catch(err => {
        console.error(`[Admin Enrich] Background error for ${skillId}:`, err)
      })
      return NextResponse.json({ message: `Enrichment started for skill ${skillId}`, status: 'started' })
    } else {
      // Batch enrich pending skills
      enrichPendingSkills(limit).catch(err => {
        console.error('[Admin Enrich] Background batch error:', err)
      })
      return NextResponse.json({ message: `Batch enrichment started (limit: ${limit})`, status: 'started' })
    }
  } catch (err) {
    console.error('[POST /api/admin/enrich]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
