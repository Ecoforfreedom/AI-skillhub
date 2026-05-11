import prisma from '../db'
import { slugify } from '../utils'

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
  query: string,
  logId: string,
  maxResults = 30
): Promise<{ found: number; saved: number; updated: number }> {
  let found = 0
  let saved = 0
  let updated = 0

  const perPage = Math.min(maxResults, 30)
  const url = `/search/repositories?q=${encodeURIComponent(query + ' language:python OR language:javascript OR language:typescript')}&sort=stars&order=desc&per_page=${perPage}`

  const res = await ghFetch(url)
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`GitHub search error ${res.status}: ${body.slice(0, 200)}`)
  }

  const data = (await res.json()) as { items: GitHubRepo[]; total_count: number }
  const repos = data.items || []
  found = repos.length

  for (const repo of repos) {
    try {
      const slug = repo.full_name.replace('/', '--').toLowerCase()
      const existing = await prisma.skill.findUnique({ where: { slug } })

      // Fetch README (best effort, with rate limit awareness)
      let readme = ''
      try {
        await new Promise(r => setTimeout(r, 300))
        const readmeRes = await ghFetch(`/repos/${repo.full_name}/readme`)
        if (readmeRes.ok) {
          const rd = await readmeRes.json()
          readme = Buffer.from(rd.content, 'base64').toString('utf-8').slice(0, 6000)
        }
      } catch {}

      const isOpenSource =
        repo.license?.spdx_id != null && repo.license.spdx_id !== 'NOASSERTION'

      if (existing) {
        await prisma.skill.update({
          where: { slug },
          data: {
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            topics: repo.topics || [],
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

    // Respect GitHub secondary rate limits
    await new Promise(r => setTimeout(r, 500))
  }

  return { found, saved, updated }
}
