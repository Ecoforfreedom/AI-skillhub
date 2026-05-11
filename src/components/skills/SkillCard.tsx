import Link from 'next/link'
import { ExternalLink, Github, Star, Code, DollarSign } from 'lucide-react'
import { cn, truncate, formatNumber, scoreColor, scoreBg } from '@/lib/utils'
import { ROLES, CATEGORIES, DIFFICULTY_LABELS, PRICING_LABELS } from '@/lib/constants'
import type { SkillListItem } from '@/types'

interface Props {
  skill: SkillListItem
  compact?: boolean
}

export default function SkillCard({ skill, compact = false }: Props) {
  const difficultyInfo = DIFFICULTY_LABELS[skill.difficulty || 'intermediate']
  const pricingInfo = PRICING_LABELS[skill.pricingType || 'unknown']

  const roleLabels = skill.roleCategories
    .slice(0, 2)
    .map(id => ROLES.find(r => r.id === id))
    .filter(Boolean)

  const catLabels = skill.functionCategories
    .slice(0, 2)
    .map(id => CATEGORIES.find(c => c.id === id))
    .filter(Boolean)

  return (
    <div className="group relative flex flex-col rounded-xl border border-gray-800 bg-gray-900 hover:border-violet-500/40 hover:bg-gray-900/80 transition-all duration-200 overflow-hidden">
      {/* Score badge */}
      {skill.score != null && skill.score > 0 && (
        <div className={cn(
          'absolute top-3 right-3 flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-bold',
          scoreBg(skill.score), scoreColor(skill.score)
        )}>
          {skill.score}
        </div>
      )}

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Header */}
        <div>
          <Link href={`/skills/${skill.slug}`} className="group/link">
            <h3 className="font-semibold text-white group-hover/link:text-violet-300 transition-colors pr-12 leading-tight">
              {skill.name}
            </h3>
          </Link>
          {skill.oneLiner && (
            <p className="mt-1 text-xs text-gray-400 leading-relaxed">
              {truncate(skill.oneLiner, 80)}
            </p>
          )}
        </div>

        {/* Chinese summary */}
        {!compact && skill.chineseSummary && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {skill.chineseSummary}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {roleLabels.map(r => r && (
            <span key={r.id} className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs', r.color)}>
              {r.icon} {r.name}
            </span>
          ))}
          {catLabels.map(c => c && (
            <span key={c.id} className="inline-flex items-center rounded-full border border-gray-700 bg-gray-800/60 text-gray-400 px-2 py-0.5 text-xs">
              {c.icon} {c.name}
            </span>
          ))}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {pricingInfo && (
            <span className={cn('rounded-full border px-2 py-0.5', pricingInfo.color)}>
              {pricingInfo.label}
            </span>
          )}
          {difficultyInfo && (
            <span className={cn('rounded-full border px-2 py-0.5', difficultyInfo.color)}>
              {difficultyInfo.label}
            </span>
          )}
          {skill.isOpenSource && (
            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 px-2 py-0.5">
              开源
            </span>
          )}
          {skill.requiresCoding && (
            <span className="flex items-center gap-0.5 text-gray-500">
              <Code className="h-3 w-3" /> 需要编程
            </span>
          )}
          {skill.stars != null && skill.stars > 0 && (
            <span className="flex items-center gap-0.5 text-gray-500 ml-auto">
              <Star className="h-3 w-3" /> {formatNumber(skill.stars)}
            </span>
          )}
        </div>
      </div>

      {/* Footer links */}
      <div className="border-t border-gray-800 px-5 py-2.5 flex items-center gap-3">
        <Link
          href={`/skills/${skill.slug}`}
          className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors"
        >
          查看详情 →
        </Link>
        <div className="flex items-center gap-2 ml-auto">
          {skill.officialUrl && (
            <a
              href={skill.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-400 transition-colors"
              title="官网"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {skill.githubUrl && (
            <a
              href={skill.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-400 transition-colors"
              title="GitHub"
            >
              <Github className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
