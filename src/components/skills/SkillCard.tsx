import Link from 'next/link'
import { ExternalLink, Github } from 'lucide-react'
import { truncate, formatNumber } from '@/lib/utils'
import { ROLES, CATEGORIES, PRICING_LABELS } from '@/lib/constants'
import type { SkillListItem } from '@/types'

interface Props {
  skill: SkillListItem
  compact?: boolean
  index?: number
}

function tierStripe(score: number): string {
  if (score >= 90) return '#00C853'
  if (score >= 80) return '#FF6B00'
  if (score >= 70) return '#FFD600'
  return '#ddd'
}

export default function SkillCard({ skill, compact = false, index = 0 }: Props) {
  const pricingInfo = PRICING_LABELS[skill.pricingType || 'unknown']
  const stripeColor = skill.score != null && skill.score > 0 ? tierStripe(skill.score) : '#eee'
  const pricingBadge = skill.isOpenSource || skill.pricingType === 'open_source'
    ? { label: '开源', background: '#00C853', color: '#fff' }
    : skill.pricingType === 'paid'
      ? { label: pricingInfo?.label || '付费', background: '#FF6B00', color: '#fff' }
      : pricingInfo
        ? { label: pricingInfo.label, background: '#FFD600', color: '#000' }
        : null

  const roleLabels = skill.roleCategories
    .slice(0, 2)
    .map(id => ROLES.find(role => role.id === id))
    .filter(Boolean)

  const categoryLabels = skill.functionCategories
    .slice(0, 1)
    .map(id => CATEGORIES.find(category => category.id === id))
    .filter(Boolean)

  return (
    <div
      className="group relative flex flex-col sdv-panel sdv-tilt sdv-card-enter"
      style={{
        cursor: 'default',
        overflow: 'hidden',
        minHeight: compact ? 280 : 340,
        '--card-i': index,
      } as React.CSSProperties}
    >
      <div style={{ height: 6, background: stripeColor }} />

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex gap-3 items-start">
          <div className="sdv-slot shrink-0 flex items-center justify-center" style={{ width: 48, height: 48, fontSize: 20 }}>
            {roleLabels[0] ? (roleLabels[0] as { icon: string }).icon : '🧰'}
          </div>

          <div className="min-w-0 flex-1">
            <Link href={`/skills/${skill.slug}`}>
              <h3 className="font-pixel" style={{ fontSize: '26px', color: '#000', letterSpacing: '0.02em' }}>
                {skill.name}
              </h3>
            </Link>
            {skill.oneLiner ? (
              <p className="font-dot mt-1 line-clamp-2" style={{ color: '#444', fontSize: '13px', lineHeight: 1.6 }}>
                {truncate(skill.oneLiner, 72)}
              </p>
            ) : null}
          </div>
        </div>

        {skill.score != null && skill.score > 0 ? (
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-dot"
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                padding: '3px 8px',
                background: '#000',
                color: '#FFD600',
                border: '2px solid #000',
                borderRadius: 3,
              }}
            >
              Lv.{skill.score}
            </span>
            {skill.stars != null && skill.stars > 0 ? (
              <span className="font-dot" style={{ fontSize: '12px', fontWeight: 600, color: '#555', letterSpacing: '0.03em' }}>
                ★ {formatNumber(skill.stars)}
              </span>
            ) : null}
          </div>
        ) : null}

        {!compact && skill.chineseSummary ? (
          <p className="font-dot line-clamp-3" style={{ color: '#555', fontSize: '13px', lineHeight: 1.65 }}>
            {skill.chineseSummary}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {roleLabels.map(role => (
            <span
              key={(role as { id: string }).id}
              className="font-dot"
              style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', padding: '3px 8px', border: '2px solid #000', borderRadius: 3, background: '#FFD600', color: '#000', boxShadow: '2px 2px 0 #000' }}
            >
              {(role as { icon: string }).icon} {(role as { name: string }).name}
            </span>
          ))}
          {categoryLabels.map(category => (
            <span
              key={(category as { id: string }).id}
              className="font-dot"
              style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', padding: '3px 8px', border: '2px solid #000', borderRadius: 3, background: '#fff', color: '#000', boxShadow: '2px 2px 0 #000' }}
            >
              {(category as { icon: string }).icon} {(category as { name: string }).name}
            </span>
          ))}
          {pricingBadge ? (
            <span className="font-dot ml-auto" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', padding: '3px 8px', border: '2px solid #000', borderRadius: 3, background: pricingBadge.background, color: pricingBadge.color, boxShadow: '2px 2px 0 #000' }}>
              {pricingBadge.label}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-3 px-5 py-3" style={{ borderTop: '3px solid #000', background: '#FFD600' }}>
        <Link href={`/skills/${skill.slug}`} className="font-dot" style={{ fontSize: '13px', fontWeight: 700, color: '#000', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          查看详情 →
        </Link>
        <div className="flex items-center gap-2 ml-auto">
          {skill.officialUrl ? (
            <a href={skill.officialUrl} target="_blank" rel="noopener noreferrer" title="官网" style={{ color: '#000', transition: 'opacity 100ms ease' }}>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
          {skill.githubUrl ? (
            <a href={skill.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub" style={{ color: '#000', transition: 'opacity 100ms ease' }}>
              <Github className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}