import Link from 'next/link'
import { ExternalLink, Github } from 'lucide-react'
import { truncate, formatNumber } from '@/lib/utils'
import { ROLES, CATEGORIES, PRICING_LABELS } from '@/lib/constants'
import type { SkillListItem } from '@/types'

interface Props {
  skill: SkillListItem
  compact?: boolean
}

function scoreToStars(score: number): { stars: string; color: string; label: string } {
  if (score >= 90) return { stars: '★★★★★', color: 'var(--sdv-gold)', label: '传说' }
  if (score >= 80) return { stars: '★★★★', color: 'var(--sdv-silver)', label: '优质' }
  if (score >= 70) return { stars: '★★★', color: '#c87840', label: '实用' }
  return { stars: '★★', color: 'var(--sdv-dim)', label: '基础' }
}

function qualityBadge(score: number): { icon: string; color: string; bg: string } {
  if (score >= 90) return { icon: '💎', color: 'var(--sdv-purple)', bg: 'rgba(152,88,200,0.18)' }
  if (score >= 80) return { icon: '⭐', color: 'var(--sdv-gold)', bg: 'rgba(240,192,48,0.12)' }
  return { icon: '◆', color: 'var(--sdv-silver)', bg: 'rgba(184,200,216,0.08)' }
}

export default function SkillCard({ skill, compact = false }: Props) {
  const pricingInfo = PRICING_LABELS[skill.pricingType || 'unknown']
  const starsInfo = skill.score != null && skill.score > 0 ? scoreToStars(skill.score) : null
  const quality = skill.score != null && skill.score > 0 ? qualityBadge(skill.score) : null

  const roleLabels = skill.roleCategories
    .slice(0, 2)
    .map(id => ROLES.find(role => role.id === id))
    .filter(Boolean)

  const categoryLabels = skill.functionCategories
    .slice(0, 1)
    .map(id => CATEGORIES.find(category => category.id === id))
    .filter(Boolean)

  return (
    <div className="group relative flex flex-col sdv-panel sdv-panel-hover transition-all duration-150" style={{ cursor: 'default' }}>
      {quality ? (
        <div
          className="absolute top-0 right-0 font-pixel"
          style={{
            fontSize: '8px',
            padding: '4px 8px',
            background: quality.bg,
            color: quality.color,
            borderLeft: `3px solid ${quality.color}`,
            borderBottom: `3px solid ${quality.color}`,
            zIndex: 2,
          }}
        >
          {quality.icon}
        </div>
      ) : null}

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex gap-3 items-start">
          <div className="sdv-slot shrink-0 flex items-center justify-center" style={{ width: 44, height: 44, fontSize: 22 }}>
            {roleLabels[0] ? (roleLabels[0] as { icon: string }).icon : '🧰'}
          </div>

          <div className="min-w-0 flex-1 pr-10">
            <Link href={`/skills/${skill.slug}`}>
              <h3 className="font-pixel leading-snug" style={{ fontSize: '9px', color: 'var(--sdv-cream)', textShadow: '1px 1px 0 var(--sdv-sh)' }}>
                {skill.name}
              </h3>
            </Link>
            {skill.oneLiner ? (
              <p className="font-dot mt-1 text-sm leading-snug line-clamp-2" style={{ color: 'var(--sdv-warm)' }}>
                {truncate(skill.oneLiner, 72)}
              </p>
            ) : null}
          </div>
        </div>

        {starsInfo ? (
          <div className="flex items-center gap-2">
            <span className="font-pixel" style={{ fontSize: '12px', color: starsInfo.color, textShadow: `0 0 6px ${starsInfo.color}` }}>
              {starsInfo.stars}
            </span>
            <span className="font-dot text-sm" style={{ color: 'var(--sdv-dim)' }}>
              {starsInfo.label} · {skill.score}分
            </span>
          </div>
        ) : null}

        {!compact && skill.chineseSummary ? (
          <p className="font-dot text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--sdv-dim)' }}>
            {skill.chineseSummary}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {roleLabels.map(role => (
            <span
              key={(role as { id: string }).id}
              className="font-dot text-xs px-2 py-0.5"
              style={{ border: '2px solid var(--sdv-teal2)', color: 'var(--sdv-teal)', background: 'rgba(80,200,160,0.08)' }}
            >
              {(role as { icon: string }).icon} {(role as { name: string }).name}
            </span>
          ))}
          {categoryLabels.map(category => (
            <span
              key={(category as { id: string }).id}
              className="font-dot text-xs px-2 py-0.5"
              style={{ border: '2px solid var(--sdv-border)', color: 'var(--sdv-warm)' }}
            >
              {(category as { icon: string }).icon} {(category as { name: string }).name}
            </span>
          ))}
          {pricingInfo ? (
            <span className="font-dot text-xs px-2 py-0.5 ml-auto" style={{ border: '2px solid var(--sdv-border)', color: 'var(--sdv-dim)' }}>
              {pricingInfo.label}
            </span>
          ) : null}
          {skill.isOpenSource ? (
            <span className="font-dot text-xs px-2 py-0.5" style={{ border: '2px solid var(--sdv-purple)', color: 'var(--sdv-purple)', background: 'rgba(152,88,200,0.08)' }}>
              开源
            </span>
          ) : null}
          {skill.stars != null && skill.stars > 0 ? (
            <span className="font-dot text-xs" style={{ color: 'var(--sdv-dim)' }}>
              ★ {formatNumber(skill.stars)}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2.5" style={{ borderTop: '3px solid var(--sdv-sh)' }}>
        <Link href={`/skills/${skill.slug}`} className="font-pixel" style={{ fontSize: '7px', color: 'var(--sdv-teal)' }}>
          ▶ 查看详情
        </Link>
        <div className="flex items-center gap-2 ml-auto">
          {skill.officialUrl ? (
            <a href={skill.officialUrl} target="_blank" rel="noopener noreferrer" title="官网" style={{ color: 'var(--sdv-dim)' }}>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
          {skill.githubUrl ? (
            <a href={skill.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub" style={{ color: 'var(--sdv-dim)' }}>
              <Github className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}