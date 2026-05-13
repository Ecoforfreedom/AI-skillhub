import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatNumber(n: number | null | undefined): string {
  if (!n) return '0'
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return '未知'
  const date = new Date(d)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days <= 7) return `${days}天前`
  if (days <= 30) return `${Math.floor(days / 7)}周前`
  if (days <= 365) return `${Math.floor(days / 30)}个月前`
  return `${Math.floor(days / 365)}年前`
}

export function truncate(str: string | null | undefined, max: number): string {
  if (!str) return ''
  if (str.length <= max) return str
  return str.slice(0, max) + '...'
}

export function displaySkillName(name: string | null | undefined): string {
  return (name || '')
    .replace(/^Agent Arsenal\s+/i, '')
    .replace(/\s+\d{3}$/g, '')
}

export function displaySkillText(text: string | null | undefined): string {
  return (text || '')
    .replace(/\bAgent Arsenal\s+/gi, '')
    .replace(/\b(Command Console|Workflow Kit|Signal Scanner|Report Engine|Briefing Forge|Research Probe|Data Lens|Ops Booster|Pipeline Bot|Decision Deck|Task Automator|Knowledge Core|Audit Shield|Launch Pad|Insight Radar|Draft Machine|Meeting Copilot|Browser Agent|Code Helper|Media Crafter)\s+\d{3}\b/g, '$1')
}

export function scoreColor(score: number | null | undefined): string {
  const s = score || 0
  if (s >= 90) return 'text-green-400'
  if (s >= 80) return 'text-emerald-400'
  if (s >= 70) return 'text-yellow-400'
  if (s >= 60) return 'text-orange-400'
  return 'text-red-400'
}

export function scoreBg(score: number | null | undefined): string {
  const s = score || 0
  if (s >= 90) return 'bg-green-500/10 border-green-500/20'
  if (s >= 80) return 'bg-emerald-500/10 border-emerald-500/20'
  if (s >= 70) return 'bg-yellow-500/10 border-yellow-500/20'
  if (s >= 60) return 'bg-orange-500/10 border-orange-500/20'
  return 'bg-red-500/10 border-red-500/20'
}
