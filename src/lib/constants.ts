export const ROLES = [
  { id: 'consulting',  name: '咨询顾问',  nameEn: 'Consulting',   icon: '💼', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',   description: '市场研究、行业分析、竞品分析、PPT制作、高管汇报' },
  { id: 'finance',     name: '金融投资',  nameEn: 'Finance',      icon: '📈', color: 'bg-green-500/10 text-green-400 border-green-500/20', description: '财报分析、估值建模、投资研究、新闻监控' },
  { id: 'marketing',  name: '市场品牌',  nameEn: 'Marketing',    icon: '📣', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20',   description: '内容生成、SEO、社媒运营、广告文案、用户画像' },
  { id: 'sales',       name: '销售商务',  nameEn: 'Sales',        icon: '🤝', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', description: '客户开发、销售邮件、CRM自动化、Proposal生成' },
  { id: 'product',     name: '产品经理',  nameEn: 'Product',      icon: '🎯', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20', description: 'PRD生成、竞品分析、用户需求分析、Roadmap' },
  { id: 'operations', name: '运营人员',  nameEn: 'Operations',   icon: '⚙️', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',   description: '流程自动化、数据看板、活动复盘、内容运营' },
  { id: 'hr',          name: 'HR与招聘',  nameEn: 'HR',           icon: '👥', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20',   description: 'JD生成、简历筛选、面试题生成、绩效反馈' },
  { id: 'legal',       name: '法务合规',  nameEn: 'Legal',        icon: '⚖️', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', description: '合同审阅、政策检索、风险条款识别、合规清单' },
  { id: 'research',    name: '研究学术',  nameEn: 'Research',     icon: '🔬', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', description: '文献搜索、论文总结、引文管理、学术写作' },
  { id: 'engineering', name: '技术开发',  nameEn: 'Engineering',  icon: '💻', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', description: '代码生成、Debug、DevOps、API测试、MCP' },
  { id: 'design',      name: '设计创意',  nameEn: 'Design',       icon: '🎨', color: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20', description: '图片生成、Logo设计、UI原型、品牌视觉' },
  { id: 'management', name: '企业管理',  nameEn: 'Management',   icon: '🏢', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', description: '战略分析、OKR管理、会议总结、决策支持' },
  { id: 'education',  name: '教育培训',  nameEn: 'Education',    icon: '📚', color: 'bg-lime-500/10 text-lime-400 border-lime-500/20',   description: '课程设计、知识管理、学习辅助' },
  { id: 'admin',       name: '行政办公',  nameEn: 'Admin',        icon: '🗂️', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',   description: '日程管理、文档处理、自动化办公' },
] as const

export type RoleId = typeof ROLES[number]['id']

export const CATEGORIES = [
  { id: 'research-search',      name: '资料搜索',    nameEn: 'Research & Search',      icon: '🔍' },
  { id: 'writing-editing',      name: '写作润色',    nameEn: 'Writing & Editing',      icon: '✍️' },
  { id: 'presentation',         name: 'PPT与汇报',  nameEn: 'Presentation',           icon: '📊' },
  { id: 'data-analysis',        name: '数据分析',    nameEn: 'Data Analysis',          icon: '📉' },
  { id: 'spreadsheet',          name: 'Excel与表格', nameEn: 'Spreadsheet',            icon: '📋' },
  { id: 'meeting',              name: '会议纪要',    nameEn: 'Meeting',                icon: '🎙️' },
  { id: 'email',                name: '邮件处理',    nameEn: 'Email',                  icon: '📧' },
  { id: 'automation',           name: '自动化',      nameEn: 'Automation',             icon: '🤖' },
  { id: 'knowledge-management', name: '知识管理',    nameEn: 'Knowledge Management',   icon: '🧠' },
  { id: 'document-processing',  name: '文档处理',    nameEn: 'Document Processing',    icon: '📄' },
  { id: 'image-design',         name: '图像设计',    nameEn: 'Image & Design',         icon: '🖼️' },
  { id: 'video-audio',          name: '视频音频',    nameEn: 'Video & Audio',          icon: '🎬' },
  { id: 'coding',               name: '编程开发',    nameEn: 'Coding',                 icon: '💡' },
  { id: 'browser-automation',   name: '浏览器自动化', nameEn: 'Browser Automation',     icon: '🌐' },
  { id: 'crm-sales',            name: '销售管理',    nameEn: 'CRM & Sales',            icon: '💰' },
  { id: 'hr-recruiting',        name: '招聘人事',    nameEn: 'HR & Recruiting',        icon: '👤' },
  { id: 'legal-compliance',     name: '法务合规',    nameEn: 'Legal & Compliance',     icon: '📜' },
  { id: 'finance-accounting',   name: '财务会计',    nameEn: 'Finance & Accounting',   icon: '💵' },
  { id: 'project-management',   name: '项目管理',    nameEn: 'Project Management',     icon: '📌' },
  { id: 'mcp-agent',            name: 'Agent工具',   nameEn: 'MCP & Agent Tools',      icon: '🔧' },
] as const

export type CategoryId = typeof CATEGORIES[number]['id']

export const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
  beginner:     { label: '新手友好', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  intermediate: { label: '中级',     color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  advanced:     { label: '需要技术', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
}

export const PRICING_LABELS: Record<string, { label: string; color: string }> = {
  free:         { label: '完全免费', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  freemium:     { label: 'Freemium', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  paid:         { label: '付费',     color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  open_source:  { label: '开源',     color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  unknown:      { label: '待定',     color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
}

export const GITHUB_QUERIES = [
  'ai workflow productivity tool',
  'mcp server claude ai',
  'ai agent automation workflow',
  'browser automation ai python',
  'rag document ai tool',
  'meeting transcription ai',
  'ai writing assistant tool',
  'ai presentation generator',
  'n8n workflow automation',
  'langchain agent tool',
  'crewai multi agent',
  'spreadsheet automation ai',
  'document processing ai',
  'chatgpt plugin tool python',
  'ai research assistant tool',
]

export const AWESOME_LIST_URLS = [
  { url: 'https://raw.githubusercontent.com/mahseema/awesome-ai-tools/main/README.md',             name: 'awesome-ai-tools' },
  { url: 'https://raw.githubusercontent.com/filipecalegario/awesome-generative-ai/main/README.md', name: 'awesome-generative-ai' },
  { url: 'https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/README.md',             name: 'awesome-chatgpt-prompts' },
  { url: 'https://raw.githubusercontent.com/phodal/awesome-ai-coding/main/README.md',              name: 'awesome-ai-coding' },
  { url: 'https://raw.githubusercontent.com/underlines/awesome-marketing-datascience/master/awesome-ai.md', name: 'awesome-ai-marketing' },
]

export const ROLE_IDS = ROLES.map(r => r.id)
export const CATEGORY_IDS = CATEGORIES.map(c => c.id)
