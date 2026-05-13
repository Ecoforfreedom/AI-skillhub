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
  if (score >= 90) return { stars: '★★★★★', color: 'var(--sdv-teal)', label: '主装' }
  if (score >= 80) return { stars: '★★★★', color: 'var(--sdv-silver)', label: '高信号' }
  if (score >= 70) return { stars: '★★★', color: 'var(--sdv-purple)', label: '常用' }
  return { stars: '★★', color: 'var(--sdv-dim)', label: '库存' }
}

function qualityBadge(score: number): { icon: string; color: string; bg: string } {
  if (score >= 90) return { icon: '主装', color: 'var(--sdv-teal)', bg: 'rgba(255,221,126,0.34)' }
  if (score >= 80) return { icon: '高信号', color: 'var(--sdv-silver)', bg: 'rgba(255,241,183,0.58)' }
  return { icon: '库存', color: 'var(--sdv-dim)', bg: 'rgba(255,247,214,0.72)' }
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
    <div className="group relative flex flex-col sdv-panel sdv-panel-hover" style={{ cursor: 'default', overflow: 'hidden', minHeight: compact ? 300 : 360 }}>
      {quality ? (
        <div
          className="absolute top-4 right-4 font-dot"
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '7px 10px',
            background: quality.bg,
            color: quality.color,
            border: `1px solid ${quality.color}`,
            borderRadius: 999,
            backdropFilter: 'blur(10px)',
            zIndex: 2,
          }}
        >
          {quality.icon}
        </div>
      ) : null}

      <div className="p-6 flex flex-col gap-4 flex-1">
        <div className="flex gap-4 items-start">
          <div className="sdv-slot shrink-0 flex items-center justify-center" style={{ width: 52, height: 52, fontSize: 22 }}>
            {roleLabels[0] ? (roleLabels[0] as { icon: string }).icon : '🧰'}
          </div>

          <div className="min-w-0 flex-1 pr-16">
            <Link href={`/skills/${skill.slug}`}>
              <h3 className="font-pixel leading-snug" style={{ fontSize: '24px', color: 'var(--sdv-cream)' }}>
                {skill.name}
              </h3>
            </Link>
            {skill.oneLiner ? (
              <p className="font-dot mt-2 text-sm leading-snug line-clamp-2" style={{ color: 'var(--sdv-warm)', fontSize: '15px', lineHeight: 1.65 }}>
                {truncate(skill.oneLiner, 72)}
              </p>
            ) : null}
          </div>
        </div>

        {starsInfo ? (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-dot" style={{ fontSize: '13px', fontWeight: 700, color: starsInfo.color, letterSpacing: '0.08em' }}>
              {starsInfo.stars}
            </span>
            <span className="font-dot text-sm" style={{ color: 'var(--sdv-dim)', fontSize: '13px' }}>
              {starsInfo.label} · Lv.{skill.score}
            </span>
            {skill.stars != null && skill.stars > 0 ? (
              <span className="font-dot text-xs px-2.5 py-1" style={{ border: '1px solid rgba(144,104,20,0.14)', borderRadius: 999, color: 'var(--sdv-dim)' }}>
                GitHub {formatNumber(skill.stars)}
              </span>
            ) : null}
          </div>
        ) : null}

        {!compact && skill.chineseSummary ? (
          <p className="font-dot text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--sdv-dim)', fontSize: '14px' }}>
            {skill.chineseSummary}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2 mt-auto">
          {roleLabels.map(role => (
            <span
              key={(role as { id: string }).id}
              className="font-dot text-xs px-3 py-1.5"
              style={{ border: '1px solid rgba(168,122,24,0.18)', borderRadius: 999, color: 'var(--sdv-teal)', background: 'rgba(255,229,138,0.28)' }}
            >
              {(role as { icon: string }).icon} {(role as { name: string }).name}
            </span>
          ))}
          {categoryLabels.map(category => (
            <span
              key={(category as { id: string }).id}
              className="font-dot text-xs px-3 py-1.5"
              style={{ border: '1px solid rgba(144,104,20,0.14)', borderRadius: 999, color: 'var(--sdv-warm)', background: 'rgba(255,248,219,0.78)' }}
            >
              {(category as { icon: string }).icon} {(category as { name: string }).name}
            </span>
          ))}
          {pricingInfo ? (
            <span className="font-dot text-xs px-3 py-1.5 ml-auto" style={{ border: '1px solid rgba(144,104,20,0.14)', borderRadius: 999, color: 'var(--sdv-dim)', background: 'rgba(255,248,219,0.78)' }}>
              {pricingInfo.label}
            </span>
          ) : null}
          {skill.isOpenSource ? (
            <span className="font-dot text-xs px-3 py-1.5" style={{ border: '1px solid rgba(168,108,18,0.28)', borderRadius: 999, color: 'var(--sdv-purple)', background: 'rgba(255,224,125,0.16)' }}>
              开源
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(144, 104, 20, 0.08)' }}>
        <Link href={`/skills/${skill.slug}`} className="font-dot" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--sdv-teal)' }}>
          查看装备 →
        </Link>
        <div className="flex items-center gap-2 ml-auto">
          {skill.officialUrl ? (
            <a href={skill.officialUrl} target="_blank" rel="noopener noreferrer" title="官网" style={{ color: 'var(--sdv-dim)', transition: 'color 220ms ease' }}>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
          {skill.githubUrl ? (
            <a href={skill.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub" style={{ color: 'var(--sdv-dim)', transition: 'color 220ms ease' }}>
              <Github className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}