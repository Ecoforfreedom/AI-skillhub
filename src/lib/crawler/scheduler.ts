import cron from 'node-cron'
import prisma from '../db'
import { runCrawl } from '.'
import { enrichPendingSkills } from '../enrichment/openai'

declare global {
  var __workSkillRadarScheduler__:
    | {
        registered: boolean
        running: boolean
      }
    | undefined
}

const schedulerState =
  globalThis.__workSkillRadarScheduler__ ??
  (globalThis.__workSkillRadarScheduler__ = {
    registered: false,
    running: false,
  })

function isAutoCrawlEnabled(): boolean {
  if (process.env.ENABLE_AUTO_CRAWL != null) {
    return process.env.ENABLE_AUTO_CRAWL !== 'false'
  }
  return process.env.NODE_ENV === 'production'
}

async function hasRecentSuccessfulCrawl(hours = 20): Promise<boolean> {
  const threshold = new Date(Date.now() - hours * 60 * 60 * 1000)
  const count = await prisma.crawlLog.count({
    where: {
      status: 'completed',
      completedAt: { gte: threshold },
      source: { in: ['github', 'awesome_list'] },
    },
  })
  return count > 0
}

async function runScheduledSync(reason: 'startup' | 'cron') {
  if (schedulerState.running) {
    console.log(`[Crawler Scheduler] Skip ${reason}: previous sync still running.`)
    return
  }

  schedulerState.running = true

  try {
    console.log(`[Crawler Scheduler] Starting ${reason} sync...`)
    const crawlResults = await runCrawl('all')
    console.log(`[Crawler Scheduler] Crawl finished with ${crawlResults.length} batches.`)

    if (!process.env.OPENAI_API_KEY) {
      console.warn('[Crawler Scheduler] OPENAI_API_KEY is missing, skipping auto enrichment.')
      return
    }

    const enrichLimit = Math.max(1, Number(process.env.AUTO_ENRICH_LIMIT || '30'))
    const enriched = await enrichPendingSkills(enrichLimit)
    console.log(`[Crawler Scheduler] Enriched ${enriched} skills.`)
  } catch (error) {
    console.error(`[Crawler Scheduler] ${reason} sync failed:`, error)
  } finally {
    schedulerState.running = false
  }
}

export function registerCrawlerScheduler() {
  if (!isAutoCrawlEnabled()) {
    console.log('[Crawler Scheduler] Disabled by configuration.')
    return
  }

  if (schedulerState.registered) {
    return
  }

  schedulerState.registered = true

  const cronExpression = process.env.AUTO_CRAWL_CRON || '0 3 * * *'
  const timezone = process.env.AUTO_CRAWL_TIMEZONE || 'UTC'

  cron.schedule(
    cronExpression,
    () => {
      void runScheduledSync('cron')
    },
    { timezone }
  )

  console.log(`[Crawler Scheduler] Registered daily sync: ${cronExpression} (${timezone}).`)

  void (async () => {
    try {
      const recentlyCrawled = await hasRecentSuccessfulCrawl(Number(process.env.AUTO_CRAWL_STALE_HOURS || '20'))
      if (!recentlyCrawled) {
        await runScheduledSync('startup')
      }
    } catch (error) {
      console.error('[Crawler Scheduler] Startup freshness check failed:', error)
    }
  })()
}