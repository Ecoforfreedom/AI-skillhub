import { NextRequest, NextResponse } from 'next/server'
import { normalizeTrackedPath, recordPageView } from '@/lib/analytics'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const path = normalizeTrackedPath(body.path)

    if (!path) {
      return NextResponse.json({ ok: true, tracked: false })
    }

    await recordPageView({
      path,
      referrer: typeof body.referrer === 'string' ? body.referrer : req.headers.get('referer'),
      userAgent: req.headers.get('user-agent'),
    })

    return NextResponse.json({ ok: true, tracked: true })
  } catch (err) {
    console.error('[POST /api/analytics/track]', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
