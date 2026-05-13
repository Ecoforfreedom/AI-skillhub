import prisma from '../db'

interface ParsedLink {
  name: string
  url: string
  description: string
}

// Extract markdown links [name](url) - description from README content
function parseMarkdownLinks(content: string): ParsedLink[] {
  const results: ParsedLink[] = []
  // Match lines with markdown links
  const lineRegex = /[-*]\s+\[([^\]]+)\]\((https?:\/\/[^)]+)\)(?:\s*[-–—:]\s*(.+))?/g
  let match: RegExpExecArray | null

  while ((match = lineRegex.exec(content)) !== null) {
    const name = match[1].trim()
    const url = match[2].trim()
    const description = (match[3] || '').trim().replace(/\*+/g, '').trim()

    // Skip if it's a badge/shield/icon link
    if (url.includes('shields.io') || url.includes('badge') || url.includes('img.shields')) continue
    // Skip very short names
    if (name.length < 3) continue

    results.push({ name, url, description })
  }

  return results
}

export async function crawlAwesomeList(
  listUrl: string,
  listName: string,
  logId: string
): Promise<{ found: number; saved: number; updated: number }> {
  let found = 0
  let saved = 0
  let updated = 0

  const res = await fetch(listUrl, {
    headers: { 'User-Agent': 'WorkSkillRadar/1.0' },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch awesome list ${listName}: ${res.status}`)
  }

  const content = await res.text()
  const links = parseMarkdownLinks(content)
  found = links.length

  for (const link of links) {
    try {
      const slug = link.url
        .replace(/^https?:\/\//, '')
        .replace(/[^a-z0-9]+/gi, '-')
        .toLowerCase()
        .slice(0, 120)

      // Determine if it's a GitHub URL
      const isGitHub = link.url.includes('github.com/')
      const githubUrl = isGitHub ? link.url : null
      const officialUrl = isGitHub ? null : link.url

      const existing = await prisma.skill.findFirst({
        where: {
          OR: [
            { slug },
            { sourceUrl: link.url },
            ...(githubUrl ? [{ githubUrl }] : []),
          ],
        },
      })

      if (existing) {
        updated++
        continue
      }

      await prisma.skill.create({
        data: {
          name: link.name,
          slug,
          officialUrl,
          githubUrl,
          sourceUrl: link.url,
          sourceType: 'awesome_list',
          description: link.description,
          isActive: false,
          isRelevant: true,
          lastCrawledAt: new Date(),
        },
      })
      saved++

      await new Promise(r => setTimeout(r, 100))
    } catch (err) {
      console.error(`[Awesome Crawler] Error saving ${link.name}:`, err)
    }
  }

  return { found, saved, updated }
}
