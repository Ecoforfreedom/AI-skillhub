/**
 * Seed script: populate database with initial skills
 * Run: npm run db:seed
 */
import prisma from './db'
import { CATEGORY_IDS, ROLE_IDS } from './constants'
import { slugify } from './utils'

const SEED_SKILLS = [
  {
    name: 'n8n',
    slug: 'n8n',
    officialUrl: 'https://n8n.io',
    githubUrl: 'https://github.com/n8n-io/n8n',
    oneLiner: 'Open-source workflow automation tool with 400+ integrations and AI capabilities.',
    chineseSummary:
      'n8n 是一款开源的工作流自动化工具，支持400多种应用集成。你可以通过可视化界面拖拽连接不同服务，实现数据在各平台间的自动流转。比如自动将邮件转为任务、定时汇总报表、触发AI分析等。对比 Zapier 更灵活，可自托管，数据不出境。适合需要打通多个工具的运营、产品和技术团队，能节省大量重复操作时间。',
    roleCategories: ['operations', 'engineering', 'marketing'],
    functionCategories: ['automation', 'mcp-agent'],
    tags: ['automation', 'workflow', 'open-source', 'self-hosted', 'no-code'],
    difficulty: 'intermediate',
    requiresCoding: false,
    isOpenSource: true,
    pricingType: 'open_source',
    stars: 45000,
    score: 92,
    isActive: true,
    isRelevant: true,
  },
  {
    name: 'Cursor',
    slug: 'cursor',
    officialUrl: 'https://cursor.sh',
    githubUrl: null,
    oneLiner: 'AI-first code editor built on VS Code with GPT-4 and Claude integration.',
    chineseSummary:
      'Cursor 是专为 AI 编程打造的代码编辑器，基于 VS Code 构建，深度集成 GPT-4 和 Claude。它能理解整个代码库上下文，直接在编辑器内对话完成代码生成、重构、调试。对比 GitHub Copilot，Cursor 支持多文件编辑、全项目理解和自然语言需求描述直接生成代码。能节省程序员30-50%的编码时间，特别适合处理样板代码和API集成。',
    roleCategories: ['engineering'],
    functionCategories: ['coding', 'mcp-agent'],
    tags: ['AI coding', 'IDE', 'GPT-4', 'Claude', 'productivity'],
    difficulty: 'beginner',
    requiresCoding: true,
    isOpenSource: false,
    pricingType: 'freemium',
    stars: 0,
    score: 95,
    isActive: true,
    isRelevant: true,
  },
  {
    name: 'Perplexity AI',
    slug: 'perplexity-ai',
    officialUrl: 'https://www.perplexity.ai',
    githubUrl: null,
    oneLiner: 'AI-powered search engine that provides real-time answers with cited sources.',
    chineseSummary:
      'Perplexity 是一款 AI 搜索引擎，能用自然语言提问并获得带来源引用的实时答案。它整合了多个网络来源，直接给出综合摘要，不需要你逐一打开链接。特别适合做行业调研、竞品分析、快速了解陌生领域。比 Google 快3-5倍完成信息汇总，能节省大量搜索和阅读时间。支持上传文档进行对话分析。',
    roleCategories: ['consulting', 'research', 'finance', 'marketing'],
    functionCategories: ['research-search', 'document-processing'],
    tags: ['AI search', 'research', 'real-time', 'citations'],
    difficulty: 'beginner',
    requiresCoding: false,
    isOpenSource: false,
    pricingType: 'freemium',
    stars: 0,
    score: 91,
    isActive: true,
    isRelevant: true,
  },
  {
    name: 'Gamma',
    slug: 'gamma',
    officialUrl: 'https://gamma.app',
    githubUrl: null,
    oneLiner: 'AI-powered presentation and document creator that generates slides from text prompts.',
    chineseSummary:
      'Gamma 是 AI 驱动的演示文稿工具，输入主题或大纲，几秒内自动生成精美 PPT。支持从文档、网页内容直接转换成幻灯片，风格专业多样。对比传统 PowerPoint，制作一份20页 PPT 从数小时压缩到15分钟。适合咨询顾问、产品经理、市场人员快速制作汇报材料。支持在线分享，不需要安装软件。',
    roleCategories: ['consulting', 'product', 'marketing', 'management'],
    functionCategories: ['presentation', 'writing-editing'],
    tags: ['AI PPT', 'presentation', 'slides', 'no-code'],
    difficulty: 'beginner',
    requiresCoding: false,
    isOpenSource: false,
    pricingType: 'freemium',
    stars: 0,
    score: 88,
    isActive: true,
    isRelevant: true,
  },
  {
    name: 'Fireflies.ai',
    slug: 'fireflies-ai',
    officialUrl: 'https://fireflies.ai',
    githubUrl: null,
    oneLiner: 'AI meeting assistant that auto-records, transcribes, and summarizes meetings with action items.',
    chineseSummary:
      'Fireflies.ai 是 AI 会议助手，自动加入 Zoom/Teams/Google Meet 会议录音、转录，并生成会议摘要、待办事项、关键决策。会议结束后几分钟内收到结构化笔记，不需要手动记录。对于每天参加多个会议的顾问、销售、产品经理，每周能节省3-5小时的整理时间。支持按关键词搜索历史会议内容。',
    roleCategories: ['consulting', 'sales', 'product', 'management'],
    functionCategories: ['meeting', 'document-processing'],
    tags: ['meeting notes', 'transcription', 'AI summary', 'Zoom'],
    difficulty: 'beginner',
    requiresCoding: false,
    isOpenSource: false,
    pricingType: 'freemium',
    stars: 0,
    score: 89,
    isActive: true,
    isRelevant: true,
  },
  {
    name: 'Zapier',
    slug: 'zapier',
    officialUrl: 'https://zapier.com',
    githubUrl: null,
    oneLiner: 'No-code automation platform connecting 6000+ apps to automate repetitive workflows.',
    chineseSummary:
      'Zapier 是无代码自动化平台，连接6000多个应用，通过简单的"触发-动作"逻辑实现跨平台自动化。例如：收到客户邮件 → 自动创建 CRM 记录 → 发送 Slack 通知。无需编程，适合运营、销售、HR等非技术团队消除重复操作。每月可节省数小时手动数据搬运时间。注意：免费版有任务数量限制，复杂流程建议升级或改用 n8n。',
    roleCategories: ['operations', 'sales', 'hr', 'marketing'],
    functionCategories: ['automation', 'crm-sales'],
    tags: ['automation', 'no-code', 'integration', 'workflow'],
    difficulty: 'beginner',
    requiresCoding: false,
    isOpenSource: false,
    pricingType: 'freemium',
    stars: 0,
    score: 87,
    isActive: true,
    isRelevant: true,
  },
  {
    name: 'Notion AI',
    slug: 'notion-ai',
    officialUrl: 'https://www.notion.so/product/ai',
    githubUrl: null,
    oneLiner: 'AI writing and knowledge management assistant built into Notion.',
    chineseSummary:
      'Notion AI 是内置在 Notion 中的 AI 助手，能在笔记、文档、数据库中直接调用 AI 进行写作、总结、翻译、改写。不需要切换到其他工具，在当前文档中直接生成内容。特别适合知识工作者整理会议记录、写周报、生成项目说明文档。能节省日常文档处理50%的时间。缺点是需要 Notion 订阅，且 AI 功能单独收费。',
    roleCategories: ['product', 'operations', 'consulting', 'management'],
    functionCategories: ['knowledge-management', 'writing-editing'],
    tags: ['Notion', 'AI writing', 'knowledge base', 'notes'],
    difficulty: 'beginner',
    requiresCoding: false,
    isOpenSource: false,
    pricingType: 'paid',
    stars: 0,
    score: 85,
    isActive: true,
    isRelevant: true,
  },
  {
    name: 'Make (Integromat)',
    slug: 'make-integromat',
    officialUrl: 'https://www.make.com',
    githubUrl: null,
    oneLiner: 'Visual automation platform with advanced data transformation and 1500+ app integrations.',
    chineseSummary:
      'Make（原 Integromat）是可视化自动化平台，支持1500多种应用集成，提供比 Zapier 更强的数据处理能力，可以做条件分支、循环、数组操作。特别适合需要复杂数据转换的业务流程，如电商订单处理、多系统数据同步、API集成。免费版额度比 Zapier 更慷慨，适合中小团队。需要一定的逻辑思维能力，学习曲线略高于 Zapier。',
    roleCategories: ['operations', 'engineering', 'sales'],
    functionCategories: ['automation', 'data-analysis'],
    tags: ['automation', 'workflow', 'integration', 'visual'],
    difficulty: 'intermediate',
    requiresCoding: false,
    isOpenSource: false,
    pricingType: 'freemium',
    stars: 0,
    score: 86,
    isActive: true,
    isRelevant: true,
  },
  {
    name: 'GitHub Copilot',
    slug: 'github-copilot',
    officialUrl: 'https://github.com/features/copilot',
    githubUrl: null,
    oneLiner: 'AI pair programmer that suggests code and entire functions in real-time inside your editor.',
    chineseSummary:
      'GitHub Copilot 是微软/GitHub 出品的 AI 编程助手，在 VS Code、JetBrains 等编辑器中实时提示代码补全和函数生成。基于 GPT-4 训练，理解上下文能自动补全整段函数、单元测试、注释。适合所有编程语言，能节省程序员30-40%的日常编码时间，特别是重复样板代码。每月10美元，企业版提供代码安全扫描。注意代码版权问题。',
    roleCategories: ['engineering'],
    functionCategories: ['coding'],
    tags: ['AI coding', 'VS Code', 'code completion', 'GitHub'],
    difficulty: 'beginner',
    requiresCoding: true,
    isOpenSource: false,
    pricingType: 'paid',
    stars: 0,
    score: 90,
    isActive: true,
    isRelevant: true,
  },
  {
    name: 'Elicit',
    slug: 'elicit',
    officialUrl: 'https://elicit.com',
    githubUrl: null,
    oneLiner: 'AI research assistant that helps find, summarize and extract data from academic papers.',
    chineseSummary:
      'Elicit 是专为学术研究设计的 AI 助手，能自动搜索 Semantic Scholar 的数百万篇论文，提取研究方法、样本量、主要结论等关键信息，并生成结构化摘要表格。做文献综述时，过去需要几天手动整理的工作，Elicit 可以在几小时内完成。适合研究人员、学生、咨询顾问做快速文献调研。免费版每月有限额。',
    roleCategories: ['research', 'consulting'],
    functionCategories: ['research-search', 'document-processing'],
    tags: ['research', 'academic', 'literature review', 'AI'],
    difficulty: 'beginner',
    requiresCoding: false,
    isOpenSource: false,
    pricingType: 'freemium',
    stars: 0,
    score: 87,
    isActive: true,
    isRelevant: true,
  },
  {
    name: 'Otter.ai',
    slug: 'otter-ai',
    officialUrl: 'https://otter.ai',
    githubUrl: null,
    oneLiner: 'Real-time meeting transcription and notes with speaker identification and AI summary.',
    chineseSummary:
      'Otter.ai 是实时会议转录工具，能在 Zoom/Teams/Google Meet 中实时显示字幕和文字记录，自动识别发言人，会后生成摘要和行动项。支持中英文混录，准确率较高。对于需要频繁开会的销售、咨询、产品团队，能彻底替代手动记录，每周节省2-4小时。免费版有时长限制，付费版支持无限录音和搜索。',
    roleCategories: ['sales', 'consulting', 'product', 'management'],
    functionCategories: ['meeting'],
    tags: ['transcription', 'meeting notes', 'real-time', 'speaker ID'],
    difficulty: 'beginner',
    requiresCoding: false,
    isOpenSource: false,
    pricingType: 'freemium',
    stars: 0,
    score: 85,
    isActive: true,
    isRelevant: true,
  },
  {
    name: 'Beautiful.ai',
    slug: 'beautiful-ai',
    officialUrl: 'https://www.beautiful.ai',
    githubUrl: null,
    oneLiner: 'Smart presentation software with AI design engine that auto-formats slides.',
    chineseSummary:
      'Beautiful.ai 是智能演示文稿工具，通过 AI 设计引擎自动保持幻灯片布局美观一致，你只需专注内容。添加内容时，排版自动调整，不需要手动对齐。提供数百个专业模板，适合咨询顾问、产品经理制作专业级汇报材料。对比 PowerPoint，制作相同质量的 PPT 时间减少60%。团队版支持品牌规范统一。',
    roleCategories: ['consulting', 'product', 'marketing', 'sales'],
    functionCategories: ['presentation'],
    tags: ['AI PPT', 'design', 'presentation', 'auto-format'],
    difficulty: 'beginner',
    requiresCoding: false,
    isOpenSource: false,
    pricingType: 'freemium',
    stars: 0,
    score: 82,
    isActive: true,
    isRelevant: true,
  },
  {
    name: 'Descript',
    slug: 'descript',
    officialUrl: 'https://www.descript.com',
    githubUrl: null,
    oneLiner: 'AI-powered video and podcast editor that lets you edit audio/video by editing text.',
    chineseSummary:
      'Descript 是 AI 视频/播客编辑工具，最大亮点是通过编辑文字稿来编辑音视频——删掉文字就删掉对应的音视频片段，像编辑 Word 文档一样编辑视频。同时支持 AI 配音克隆、自动去除口头禅（嗯、啊）、字幕生成。适合内容创作者、市场团队、培训部门，能将视频剪辑时间压缩70%以上。',
    roleCategories: ['marketing', 'design', 'education'],
    functionCategories: ['video-audio'],
    tags: ['video editing', 'podcast', 'AI audio', 'transcription'],
    difficulty: 'beginner',
    requiresCoding: false,
    isOpenSource: false,
    pricingType: 'freemium',
    stars: 0,
    score: 84,
    isActive: true,
    isRelevant: true,
  },
  {
    name: 'Airtable',
    slug: 'airtable',
    officialUrl: 'https://airtable.com',
    githubUrl: null,
    oneLiner: 'No-code database platform combining spreadsheet ease with relational database power.',
    chineseSummary:
      'Airtable 是介于 Excel 和数据库之间的无代码工具，既有表格的直观性，又支持关联字段、多视图（看板、甘特图、日历）和自动化工作流。适合项目管理、CRM、内容日历、招聘追踪等场景，非技术团队即可上手。对比 Excel 更适合多人协作和复杂数据关系，对比专业 CRM 更灵活。最近加入 AI 功能，可自动生成字段内容。',
    roleCategories: ['operations', 'hr', 'product', 'marketing'],
    functionCategories: ['project-management', 'spreadsheet', 'automation'],
    tags: ['no-code', 'database', 'spreadsheet', 'project management'],
    difficulty: 'beginner',
    requiresCoding: false,
    isOpenSource: false,
    pricingType: 'freemium',
    stars: 0,
    score: 83,
    isActive: true,
    isRelevant: true,
  },
  {
    name: 'Claude',
    slug: 'claude-anthropic',
    officialUrl: 'https://claude.ai',
    githubUrl: null,
    oneLiner: 'Anthropic\'s AI assistant with 200K context window, excellent for long document analysis.',
    chineseSummary:
      'Claude 是 Anthropic 开发的 AI 助手，拥有200K tokens 超长上下文窗口，能一次处理整本书或完整合同文件。在长文档分析、复杂推理、代码生成方面表现优秀，回答更安全、更少幻觉。适合法务合规（合同审阅）、金融分析（财报解读）、学术研究（文献整理）等需要处理长文本的场景。API 支持集成到自定义工作流。',
    roleCategories: ['legal', 'finance', 'research', 'consulting', 'engineering'],
    functionCategories: ['document-processing', 'writing-editing', 'research-search'],
    tags: ['AI assistant', 'long context', 'document analysis', 'Anthropic'],
    difficulty: 'beginner',
    requiresCoding: false,
    isOpenSource: false,
    pricingType: 'freemium',
    stars: 0,
    score: 93,
    isActive: true,
    isRelevant: true,
  },
  {
    name: 'Fathom',
    slug: 'fathom',
    officialUrl: 'https://fathom.video',
    githubUrl: null,
    oneLiner: 'Free AI meeting recorder that highlights and summarizes key moments from your calls.',
    chineseSummary:
      'Fathom 是完全免费的 AI 会议录制工具（Zoom/Teams），能自动录音、转录，并在会议中实时高亮重要时刻。会后生成摘要、行动事项，支持一键分享特定片段给同事。免费版功能相当完整，是 Fireflies/Otter 的免费替代选择。对于销售、顾问等每天开多个会议的人，一周能节省3-4小时的会议整理时间。',
    roleCategories: ['sales', 'consulting', 'product'],
    functionCategories: ['meeting'],
    tags: ['meeting notes', 'free', 'Zoom', 'AI summary'],
    difficulty: 'beginner',
    requiresCoding: false,
    isOpenSource: false,
    pricingType: 'free',
    stars: 0,
    score: 88,
    isActive: true,
    isRelevant: true,
  },
  {
    name: 'Miro AI',
    slug: 'miro-ai',
    officialUrl: 'https://miro.com/ai',
    githubUrl: null,
    oneLiner: 'Visual collaboration board with AI that generates mind maps, diagrams, and sticky notes.',
    chineseSummary:
      'Miro AI 在协作白板中加入 AI 能力，能自动生成思维导图、用户旅程图、将文字转成图表。适合产品经理做需求拆解、运营做活动策划头脑风暴、咨询顾问做问题分析结构化。对比手动画图，结构化一个想法从30分钟压缩到5分钟。支持多人实时协作，是远程团队头脑风暴的最佳工具之一。',
    roleCategories: ['product', 'consulting', 'design', 'management'],
    functionCategories: ['project-management', 'presentation'],
    tags: ['visual collaboration', 'mind map', 'AI diagram', 'remote'],
    difficulty: 'beginner',
    requiresCoding: false,
    isOpenSource: false,
    pricingType: 'freemium',
    stars: 0,
    score: 82,
    isActive: true,
    isRelevant: true,
  },
]

const SUPPLEMENTAL_SKILL_COUNT = 500

const ROLE_LABELS: Record<string, string> = {
  consulting: '咨询顾问',
  finance: '金融投资',
  marketing: '市场品牌',
  sales: '销售商务',
  product: '产品经理',
  operations: '运营人员',
  hr: 'HR与招聘',
  legal: '法务合规',
  research: '研究学术',
  engineering: '技术开发',
  design: '设计创意',
  management: '企业管理',
  education: '教育培训',
  admin: '行政办公',
}

const CATEGORY_LABELS: Record<string, string> = {
  'research-search': '资料搜索',
  'writing-editing': '写作润色',
  presentation: 'PPT与汇报',
  'data-analysis': '数据分析',
  spreadsheet: 'Excel与表格',
  meeting: '会议纪要',
  email: '邮件处理',
  automation: '自动化',
  'knowledge-management': '知识管理',
  'document-processing': '文档处理',
  'image-design': '图像设计',
  'video-audio': '视频音频',
  coding: '编程开发',
  'browser-automation': '浏览器自动化',
  'crm-sales': '销售管理',
  'hr-recruiting': '招聘人事',
  'legal-compliance': '法务合规',
  'finance-accounting': '财务会计',
  'project-management': '项目管理',
  'mcp-agent': 'Agent工具',
}

const EQUIPMENT_TYPES = [
  'Command Console',
  'Workflow Kit',
  'Signal Scanner',
  'Report Engine',
  'Briefing Forge',
  'Research Probe',
  'Data Lens',
  'Ops Booster',
  'Pipeline Bot',
  'Decision Deck',
  'Task Automator',
  'Knowledge Core',
  'Audit Shield',
  'Launch Pad',
  'Insight Radar',
  'Draft Machine',
  'Meeting Copilot',
  'Browser Agent',
  'Code Helper',
  'Media Crafter',
] as const

function buildSupplementalSkills(count: number) {
  const roleIds = [...ROLE_IDS]
  const categoryIds = [...CATEGORY_IDS]

  return Array.from({ length: count }, (_, index) => {
    const n = index + 1
    const role = roleIds[index % roleIds.length]
    const secondaryRole = roleIds[(index * 3 + 5) % roleIds.length]
    const category = categoryIds[(index * 7 + 2) % categoryIds.length]
    const secondaryCategory = categoryIds[(index * 11 + 4) % categoryIds.length]
    const equipment = EQUIPMENT_TYPES[index % EQUIPMENT_TYPES.length]
    const serial = String(n).padStart(3, '0')
    const name = `Agent Arsenal ${equipment} ${serial}`
    const roleLabel = ROLE_LABELS[role] || role
    const categoryLabel = CATEGORY_LABELS[category] || category
    const requiresCoding = category === 'coding' || category === 'browser-automation' || category === 'mcp-agent'
    const openSource = n % 5 === 0
    const pricingType = openSource ? 'open_source' : n % 4 === 0 ? 'paid' : n % 3 === 0 ? 'free' : 'freemium'
    const score = 72 + ((index * 13) % 24)

    return {
      name,
      slug: slugify(name),
      officialUrl: null,
      githubUrl: null,
      sourceUrl: null,
      sourceType: 'manual',
      oneLiner: `${equipment} for ${roleLabel} teams to handle ${categoryLabel} tasks with AI-agent workflows.`,
      chineseSummary: `${name} 是一条面向「${roleLabel}」的 AI Agent 装备条目，重点覆盖「${categoryLabel}」场景。它适合用来快速整理输入信息、生成可执行草稿、安排下一步动作，并把重复流程沉淀成固定工作流。对于需要批量处理资料、会议、表格、内容或自动化任务的团队，可以作为装备库里的候选工具/能力位，帮助减少重复搜索和试错时间。`,
      roleCategories: Array.from(new Set([role, secondaryRole])),
      functionCategories: Array.from(new Set([category, secondaryCategory])),
      industryCategories: [],
      tags: ['ai-agent', 'equipment-library', role, category, equipment.toLowerCase().replace(/\s+/g, '-')],
      useCases: [`${roleLabel} ${categoryLabel}`, 'AI agent workflow', 'productivity boost'],
      targetUsers: [roleLabel, '知识工作者', '团队负责人'],
      inputType: ['text', 'document', 'url'],
      outputType: ['summary', 'checklist', 'workflow'],
      workflowSteps: ['导入任务上下文', '选择岗位和场景', '生成初稿或行动清单', '人工确认后执行'],
      whyUseful: `帮助${roleLabel}把${categoryLabel}任务拆成可复用流程。`,
      timeSavedReason: '减少资料检索、模板搭建和重复整理时间。',
      limitations: '这是装备库补充条目，落地前仍需要结合实际工具和业务流程验证。',
      riskNotes: '涉及敏感数据时应先脱敏，并避免把内部机密输入第三方服务。',
      similarTools: [],
      topics: ['ai-agent', 'productivity', role, category],
      difficulty: requiresCoding ? 'intermediate' : 'beginner',
      requiresCoding,
      isOpenSource: openSource,
      pricingType,
      stars: openSource ? 100 + ((index * 97) % 9000) : 0,
      forks: openSource ? 5 + ((index * 17) % 850) : 0,
      votes: 10 + ((index * 19) % 900),
      language: requiresCoding ? ['TypeScript', 'Python', 'JavaScript'][index % 3] : null,
      score,
      scoreReason: `补充装备库条目：覆盖${roleLabel}与${categoryLabel}组合，适合作为 AI Agent 工具筛选候选。`,
      isActive: true,
      isRelevant: true,
      isHidden: false,
    }
  })
}

const ALL_SEED_SKILLS = [...SEED_SKILLS, ...buildSupplementalSkills(SUPPLEMENTAL_SKILL_COUNT)]
export const TARGET_SEED_SKILL_COUNT = ALL_SEED_SKILLS.length

export async function seedSkills(logProgress: boolean) {
  if (logProgress) {
    console.log(`🌱 Seeding database up to ${TARGET_SEED_SKILL_COUNT} skills...`)
  }

  for (const skill of ALL_SEED_SKILLS) {
    const { roleCategories, functionCategories, tags, useCases, targetUsers, inputType, outputType, workflowSteps, similarTools, topics, ...rest } = skill as any

    await prisma.skill.upsert({
      where: { slug: skill.slug },
      update: {
        stars: skill.stars,
        score: skill.score,
      },
      create: {
        ...rest,
        roleCategories: roleCategories || [],
        functionCategories: functionCategories || [],
        industryCategories: [],
        tags: tags || [],
        useCases: useCases || [],
        targetUsers: targetUsers || [],
        inputType: inputType || [],
        outputType: outputType || [],
        workflowSteps: workflowSteps || [],
        similarTools: similarTools || [],
        topics: topics || [],
      },
    })
    if (logProgress) {
      console.log(`  ✓ ${skill.name}`)
    }
  }

  if (logProgress) {
    console.log(`\n✅ Seeded ${ALL_SEED_SKILLS.length} skills`)
  }
}

async function main() {
  await seedSkills(true)
  await prisma.$disconnect()
}

export async function ensureSeeded(logPrefix?: string) {
  const count = await prisma.skill.count()
  if (count >= TARGET_SEED_SKILL_COUNT) {
    return false
  }

  if (logPrefix) {
    console.log(`🌱 ${logPrefix} ${count}/${TARGET_SEED_SKILL_COUNT} skills found, topping up seed data...`)
  }

  await seedSkills(false)

  if (logPrefix) {
    console.log(`🌿 ${logPrefix} Done!`)
  }

  return true
}

/** Auto-seed: called from instrumentation.ts on server startup */
export async function autoSeed() {
  try {
    const seeded = await ensureSeeded('[AutoSeed]')
    if (!seeded) {
      const count = await prisma.skill.count()
      console.log(`🌿 [AutoSeed] ${count} skills already in DB, skipping`)
    }
  } catch (e) {
    console.error('❌ [AutoSeed] Failed:', e)
  }
}

// Only run directly when called as CLI script (npm run db:seed)
if (process.env.npm_lifecycle_script?.includes('seed')) {
  main().catch(e => {
    console.error(e)
    process.exit(1)
  })
}
