import prisma from '../db'
import { crawlGitHubQuery } from './github'
import { crawlAwesomeList } from './awesome'
import { GITHUB_QUERIES, AWESOME_LIST_URLS } from '../constants'

export type CrawlSource = 'github' | 'awesome_lists' | 'all'

interface CrawlResult {
  source: string
  query?: string
  found: number
  saved: number
  updated: number
  error?: string
}

export async function runCrawl(source: CrawlSource = 'all'): Promise<CrawlResult[]> {
  const results: CrawlResult[] = []

  // GitHub crawl
  if (source === 'github' || source === 'all') {
    for (const query of GITHUB_QUERIES) {
      const log = await prisma.crawlLog.create({
        data: { source: 'github', query, status: 'running' },
      })

      try {
        const res = await crawlGitHubQuery(query, log.id, 20)
        await prisma.crawlLog.update({
          where: { id: log.id },
          data: {
            status: 'completed',
            totalFound: res.found,
            totalSaved: res.saved,
            totalUpdated: res.updated,
            completedAt: new Date(),
          },
        })
        results.push({ source: 'github', query, ...res })
      } catch (err) {
        const msg = String(err)
        await prisma.crawlLog.update({
          where: { id: log.id },
          data: { status: 'failed', errorMessage: msg, completedAt: new Date() },
        })
        results.push({ source: 'github', query, found: 0, saved: 0, updated: 0, error: msg })
      }

      // Rate limit between queries
      await new Promise(r => setTimeout(r, 2000))
    }
  }

  // Awesome lists crawl
  if (source === 'awesome_lists' || source === 'all') {
    for (const list of AWESOME_LIST_URLS) {
      const log = await prisma.crawlLog.create({
        data: { source: 'awesome_list', query: list.name, status: 'running' },
      })

      try {
        const res = await crawlAwesomeList(list.url, list.name, log.id)
        await prisma.crawlLog.update({
          where: { id: log.id },
          data: {
            status: 'completed',
            totalFound: res.found,
            totalSaved: res.saved,
            totalUpdated: res.updated,
            completedAt: new Date(),
          },
        })
        results.push({ source: 'awesome_list', query: list.name, ...res })
      } catch (err) {
        const msg = String(err)
        await prisma.crawlLog.update({
          where: { id: log.id },
          data: { status: 'failed', errorMessage: msg, completedAt: new Date() },
        })
        results.push({ source: 'awesome_list', query: list.name, found: 0, saved: 0, updated: 0, error: msg })
      }

      await new Promise(r => setTimeout(r, 1000))
    }
  }

  return results
}
