import prisma from '../db'
import type { GitHubSearchProfile } from '../constants'

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  topics: string[]
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  pushed_at: string
  homepage: string | null
  license: { spdx_id: string } | null
}

const GITHUB_API = 'https://api.github.com'
const SKIP_TERMS = [
  'awesome',
  'tutorial',
  'course',
  'boilerplate',
  'starter',
  'example',
  'template',
  'prompt',
  'paper',
  'benchmark',
]
const TOOL_SIGNALS = [
  'ai',
  'agent',
  'assistant',
  'automation',
  'workflow',
  'copilot',
  'productivity',
  'mcp',
  'rag',
  'search',
  'meeting',
  'transcription',
  'document',
  'browser',
  'coding',
]

async function ghFetch(path: string): Promise<Response> {
  const token = process.env.GITHUB_TOKEN
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'WorkSkillRadar/1.0',
  }
  if (token) headers.Authorization = `token ${token}`
  const res = await fetch(`${GITHUB_API}${path}`, { headers })
  return res
}

export async function crawlGitHubQuery(
  profile: GitHubSearchProfile,
  _logId: string
): Promise<{ found: number; saved: number; updated: number; ignored: number }> {
  let found = 0
  let saved = 0
  let updated = 0
  let ignored = 0

  const perPage = Math.min(profile.perPage, 30)
  const pages = Math.max(1, Math.min(profile.pages, 4))
  const seen = new Set<number>()

  for (let page = 1; page <= pages; page++) {
    const searchQuery = [
      profile.query,
      `stars:>=${profile.minStars}`,
      'fork:false',
      'archived:false',
      'mirror:false',
      '(language:Python OR language:JavaScript OR language:TypeScript)',
    ].join(' ')
    const url = `/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=${perPage}&page=${page}`

    const res = await ghFetch(url)
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`GitHub search error ${res.status}: ${body.slice(0, 200)}`)
    }

    const data = (await res.json()) as { items: GitHubRepo[]; total_count: number }
    const repos = data.items || []
    if (repos.length === 0) break

    for (const repo of repos) {
      if (seen.has(repo.id)) continue
      seen.add(repo.id)
      found++

      const repoText = `${repo.name} ${repo.full_name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase()
      const skipByTerm = SKIP_TERMS.some(term => repoText.includes(term))
      const hasToolSignal = TOOL_SIGNALS.some(term => repoText.includes(term))

      if (repo.stargazers_count < profile.minStars || skipByTerm || (!hasToolSignal && repo.stargazers_count < profile.minStars * 2)) {
        ignored++
        continue
      }

      try {
        const slug = repo.full_name.replace('/', '--').toLowerCase()
        const existing = await prisma.skill.findFirst({
          where: {
            OR: [
              { slug },
              { githubUrl: repo.html_url },
              { sourceUrl: repo.html_url },
            ],
          },
        })

        // Fetch README only for repos that already passed the quality filter.
        let readme = ''
        try {
          await new Promise(r => setTimeout(r, 250))
          const readmeRes = await ghFetch(`/repos/${repo.full_name}/readme`)
          if (readmeRes.ok) {
            const rd = await readmeRes.json() as { content?: string }
            readme = Buffer.from(rd.content || '', 'base64').toString('utf-8').slice(0, 6000)
          }
        } catch {}

        const isOpenSource =
          repo.license?.spdx_id != null && repo.license.spdx_id !== 'NOASSERTION'

        if (existing) {
          await prisma.skill.update({
            where: { id: existing.id },
            data: {
              name: existing.name || repo.name,
              slug: existing.slug,
              officialUrl: existing.officialUrl || repo.homepage || repo.html_url,
              githubUrl: repo.html_url,
              sourceUrl: repo.html_url,
              sourceType: existing.sourceType || 'github',
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              topics: repo.topics || [],
              language: repo.language,
              isOpenSource,
              lastSourceUpdate: new Date(repo.pushed_at),
              lastCrawledAt: new Date(),
              description: repo.description || existing.description,
              readmeText: readme || existing.readmeText,
            },
          })
          updated++
        } else {
          await prisma.skill.create({
            data: {
              name: repo.name,
              slug,
              officialUrl: repo.homepage || repo.html_url,
              githubUrl: repo.html_url,
              sourceUrl: repo.html_url,
              sourceType: 'github',
              description: repo.description,
              readmeText: readme,
              topics: repo.topics || [],
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              language: repo.language,
              isOpenSource,
              lastSourceUpdate: new Date(repo.pushed_at),
              lastCrawledAt: new Date(),
              isActive: false,
              isRelevant: true,
            },
          })
          saved++
        }
      } catch (err) {
        console.error(`[GitHub Crawler] Error saving ${repo.full_name}:`, err)
      }

      // Respect GitHub secondary rate limits.
      await new Promise(r => setTimeout(r, 350))
    }

    if (repos.length < perPage) break
    await new Promise(r => setTimeout(r, 900))
  }

  return { found, saved, updated, ignored }
}
