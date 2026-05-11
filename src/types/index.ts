export interface Skill {
  id: string
  name: string
  slug: string
  oneLiner: string | null
  chineseSummary: string | null
  officialUrl: string | null
  githubUrl: string | null
  sourceUrl: string | null
  sourceType: string | null
  description: string | null
  roleCategories: string[]
  functionCategories: string[]
  industryCategories: string[]
  tags: string[]
  useCases: string[]
  targetUsers: string[]
  difficulty: string | null
  requiresCoding: boolean
  isOpenSource: boolean
  pricingType: string | null
  inputType: string[]
  outputType: string[]
  workflowSteps: string[]
  whyUseful: string | null
  timeSavedReason: string | null
  limitations: string | null
  riskNotes: string | null
  similarTools: string[]
  stars: number | null
  forks: number | null
  votes: number | null
  language: string | null
  topics: string[]
  lastSourceUpdate: string | null
  lastCrawledAt: string | null
  score: number | null
  scoreReason: string | null
  isActive: boolean
  isRelevant: boolean
  isHidden: boolean
  createdAt: string
  updatedAt: string
}

export interface SkillListItem {
  id: string
  name: string
  slug: string
  oneLiner: string | null
  chineseSummary: string | null
  officialUrl: string | null
  githubUrl: string | null
  roleCategories: string[]
  functionCategories: string[]
  tags: string[]
  difficulty: string | null
  requiresCoding: boolean
  isOpenSource: boolean
  pricingType: string | null
  stars: number | null
  score: number | null
  createdAt: string
  updatedAt: string
}

export interface SkillFilters {
  roles?: string[]
  categories?: string[]
  pricing?: string[]
  difficulty?: string[]
  requiresCoding?: boolean
  isOpenSource?: boolean
  search?: string
  sortBy?: 'score' | 'stars' | 'newest' | 'votes'
  page?: number
  pageSize?: number
}

export interface PaginatedSkills {
  skills: SkillListItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface StatsData {
  totalSkills: number
  newThisWeek: number
  newToday: number
  totalRoles: number
  totalCategories: number
  freeSkills: number
  openSourceSkills: number
}

export interface RoleWithCount {
  id: string
  name: string
  nameEn: string
  icon: string
  color: string
  description: string
  count: number
}

export interface CategoryWithCount {
  id: string
  name: string
  nameEn: string
  icon: string
  count: number
}

export interface AdminStats {
  totalSkills: number
  activeSkills: number
  pendingEnrichment: number
  hiddenSkills: number
  irrelevantSkills: number
  recentCrawls: number
  totalEnrichments: number
}

export interface CrawlLog {
  id: string
  source: string
  query: string | null
  status: string
  totalFound: number | null
  totalSaved: number | null
  totalUpdated: number | null
  totalIrrelevant: number | null
  errorMessage: string | null
  createdAt: string
  completedAt: string | null
}

export interface EnrichmentLog {
  id: string
  skillId: string
  model: string | null
  status: string
  inputTokens: number | null
  outputTokens: number | null
  errorMessage: string | null
  createdAt: string
  skill?: { name: string; slug: string }
}
