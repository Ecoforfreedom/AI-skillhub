import OpenAI from 'openai'
import prisma from '../db'
import { ROLE_IDS, CATEGORY_IDS } from '../constants'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
})

export interface EnrichmentResult {
  name: string
  one_liner: string
  chinese_summary: string
  role_categories: string[]
  function_categories: string[]
  industry_categories: string[]
  tags: string[]
  use_cases: string[]
  target_users: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  requires_coding: boolean
  is_open_source: boolean
  pricing_type: 'free' | 'freemium' | 'paid' | 'open_source' | 'unknown'
  official_url: string
  github_url: string
  input_type: string[]
  output_type: string[]
  workflow_steps: string[]
  why_useful: string
  time_saved_reason: string
  limitations: string
  risk_notes: string
  similar_tools: string[]
  is_relevant: boolean
  quality_notes: string
  score: number
  score_reason: string
}

const SYSTEM_PROMPT = `你是一个专门评估职场效率工具的专家。你的任务是分析工具/项目，判断它们是否对提高工作效率有帮助，并输出结构化JSON。

有效的 role_categories 值: ${ROLE_IDS.join(', ')}
有效的 function_categories 值: ${CATEGORY_IDS.join(', ')}

规则：
- 如果不是职场效率工具，设置 is_relevant: false
- role_categories 必须从上面的有效值中选择
- function_categories 必须从上面的有效值中选择  
- chinese_summary 控制在100-180字，简单直接，必须回答"能帮我省什么时间"
- one_liner 控制在30个英文词以内
- tags 控制在3-8个
- workflow_steps 控制在3-6步
- why_useful 必须具体，不能写空话
- limitations 必须说明真实局限
- risk_notes 必须提示数据隐私、准确性、合规等风险
- score 满分100分，综合考虑实用性/易用性/可信度/热度

只返回纯JSON，不要markdown代码块，不要任何解释。`

function buildUserPrompt(skill: {
  name: string
  githubUrl: string | null
  officialUrl: string | null
  description: string | null
  topics: string[]
  readmeText: string | null
  stars: number | null
}): string {
  return `分析以下工具，返回JSON：

工具名称: ${skill.name}
GitHub: ${skill.githubUrl || 'N/A'}
官网: ${skill.officialUrl || 'N/A'}
简介: ${skill.description || 'N/A'}
Topics: ${skill.topics.join(', ') || 'N/A'}
GitHub Stars: ${skill.stars || 0}
README摘要 (前3000字):
${(skill.readmeText || '').slice(0, 3000)}

返回格式：
{
  "name": "工具名称",
  "one_liner": "英文一句话描述，最多30词",
  "chinese_summary": "中文说明100-180字，解释能省什么时间",
  "role_categories": ["有效role id数组"],
  "function_categories": ["有效category id数组"],
  "industry_categories": ["行业，如finance/consulting/marketing等"],
  "tags": ["3-8个标签"],
  "use_cases": ["2-4个具体使用场景"],
  "target_users": ["适合的用户类型"],
  "difficulty": "beginner|intermediate|advanced",
  "requires_coding": false,
  "is_open_source": true,
  "pricing_type": "free|freemium|paid|open_source|unknown",
  "official_url": "官网URL或空字符串",
  "github_url": "GitHub URL或空字符串",
  "input_type": ["text", "file", "url"等],
  "output_type": ["document", "code", "summary"等],
  "workflow_steps": ["3-6步使用流程"],
  "why_useful": "具体说明价值，不能写空话",
  "time_saved_reason": "具体节省哪类时间",
  "limitations": "真实局限，不能只夸",
  "risk_notes": "数据隐私/准确性/合规风险",
  "similar_tools": ["2-4个类似工具名"],
  "is_relevant": true,
  "quality_notes": "质量评估简短说明",
  "score": 75,
  "score_reason": "评分理由"
}`
}

export async function enrichSkill(skillId: string): Promise<void> {
  const skill = await prisma.skill.findUnique({ where: { id: skillId } })
  if (!skill) throw new Error(`Skill not found: ${skillId}`)

  const model = process.env.AI_MODEL || 'gpt-4o-mini'

  const log = await prisma.enrichmentLog.create({
    data: { skillId, model, status: 'running' },
  })

  try {
    const userPrompt = buildUserPrompt(skill)

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2500,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) throw new Error('Empty AI response')

    let result: EnrichmentResult
    try {
      result = JSON.parse(content) as EnrichmentResult
    } catch {
      throw new Error(`Invalid JSON from AI: ${content.slice(0, 200)}`)
    }

    const inputTokens = completion.usage?.prompt_tokens || 0
    const outputTokens = completion.usage?.completion_tokens || 0

    // Validate and clean categories
    const validRoles = (result.role_categories || []).filter(r => ROLE_IDS.includes(r as any))
    const validCats = (result.function_categories || []).filter(c => CATEGORY_IDS.includes(c as any))

    const isRelevant = result.is_relevant !== false
    const score = Math.max(0, Math.min(100, result.score || 0))
    const shouldShow = isRelevant && score >= 60

    await prisma.skill.update({
      where: { id: skillId },
      data: {
        oneLiner: result.one_liner,
        chineseSummary: result.chinese_summary,
        roleCategories: validRoles,
        functionCategories: validCats,
        industryCategories: result.industry_categories || [],
        tags: (result.tags || []).slice(0, 8),
        useCases: result.use_cases || [],
        targetUsers: result.target_users || [],
        difficulty: result.difficulty || 'intermediate',
        requiresCoding: result.requires_coding || false,
        isOpenSource: result.is_open_source || false,
        pricingType: result.pricing_type || 'unknown',
        officialUrl: result.official_url || skill.officialUrl,
        githubUrl: result.github_url || skill.githubUrl,
        inputType: result.input_type || [],
        outputType: result.output_type || [],
        workflowSteps: result.workflow_steps || [],
        whyUseful: result.why_useful,
        timeSavedReason: result.time_saved_reason,
        limitations: result.limitations,
        riskNotes: result.risk_notes,
        similarTools: result.similar_tools || [],
        isRelevant,
        score,
        scoreReason: result.score_reason,
        isActive: shouldShow,
      },
    })

    await prisma.enrichmentLog.update({
      where: { id: log.id },
      data: { status: 'completed', inputTokens, outputTokens },
    })
  } catch (err) {
    await prisma.enrichmentLog.update({
      where: { id: log.id },
      data: { status: 'failed', errorMessage: String(err) },
    })
    throw err
  }
}

export async function enrichPendingSkills(limit = 10): Promise<number> {
  const skills = await prisma.skill.findMany({
    where: { oneLiner: null, isHidden: false },
    orderBy: { stars: 'desc' },
    take: limit,
    select: { id: true, name: true },
  })

  let enriched = 0
  for (const skill of skills) {
    try {
      await enrichSkill(skill.id)
      enriched++
      await new Promise(r => setTimeout(r, 1500)) // rate limit
    } catch (err) {
      console.error(`[Enrichment] Failed ${skill.name}:`, err)
    }
  }
  return enriched
}
