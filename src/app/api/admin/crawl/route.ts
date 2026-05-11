import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { runCrawl, CrawlSource } from '@/lib/crawler'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 min max

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json().catch(() => ({}))
    const source: CrawlSource = body.source || 'all'

    // Run crawl in background (fire and forget), return immediately
    runCrawl(source).catch(err => {
      console.error('[Admin Crawl] Background error:', err)
    })

    return NextResponse.json({
      message: `Crawl started for source: ${source}`,
      status: 'started',
    })
  } catch (err) {
    console.error('[POST /api/admin/crawl]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
