import Link from 'next/link'
import { ExternalLink, Github, Star, Code } from 'lucide-react'
import { truncate, formatNumber } from '@/lib/utils'
import { ROLES, CATEGORIES, PRICING_LABELS } from '@/lib/constants'
import type { SkillListItem } from '@/types'

interface Props {
  skill: SkillListItem
  compact?: boolean
}

function scoreToStars(score: number): { stars: string; color: string; label: string } {
  if (score >= 90) return { stars: '★★★★★', color: 'var(--sdv-gold)',   label: '精品' }
  if (score >= 80) return { stars: '★★★★',  color: 'var(--sdv-silver)', label: '优质' }
  if (score >= 70) return { stars: '★★★',   color: '#c87840',           label: '良好' }
  return              { stars: '★★',    color: 'var(--sdv-dim)',    label: '一般' }
}

function qualityBadge(score: number): { icon: string; color: string; bg: string } {
  if (score >= 90) return { icon: '💎', color: 'var(--sdv-purple)', bg: 'rgba(152,88,200,0.18)' }
  if (score >= 80) return { icon: '⭐', color: 'var(--sdv-gold)',   bg: 'rgba(240,192,48,0.12)' }
  return                  { icon: '◆',  color: 'var(--sdv-silver)', bg: 'rgba(184,200,216,0.08)' }
}

export default function SkillCard({ skill, compact = false }: Props) {
  const pricingInfo = PRICING_LABELS[skill.pricingType || 'unknown']
  const starsInfo = skill.score != null && skill.score > 0 ? scoreToStars(skill.score) : null
  const quality = skill.score != null && skill.score > 0 ? qualityBadge(skill.score) : null

  const roleLabels = skill.roleCategories
    .slice(0, 2)
    .map(id => ROLES.find(r => r.id === id))
    .filter(Boolean)

  const catLabels = skill.functionCategories
    .slice(0, 1)
    .map(id => CATEGORIES.find(c => c.id === id))
    .filter(Boolean)

  return (
    <div
      className="group relative flex flex-col transition-all duration-150 sdv-panel sdv-panel-hover"
      style={{ cursor: 'default' }}
    >
      {/* Quality badge — top right corner */}
      {quality && (
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
      )}

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Item header row */}
        <div className="flex gap-3 items-start">
          {/* Item icon slot */}
          <div
            className="sdv-slot shrink-0 flex items-center justify-center text-xl"
            style={{ width: 44, height: 44, fontSize: 22 }}
          >
            {roleLabels[0] ? (roleLabels[0] as any).icon : '🔧'}
          </div>

          {/* Name + one-liner */}
          <div className="min-w-0 flex-1 pr-10">
            <Link href={`/skills/${skill.slug}`}>
              <h3
                className="font-pixel leading-snug"
                style={{ fontSize: '9px', color: 'var(--sdv-cream)', textShadow: '1px 1px 0 var(--sdv-sh)' }}
              >
                {skill.name}
              </h3>
            </Link>
            {skill.oneLiner && (
              <p className="font-dot mt-1 text-sm leading-snug line-clamp-2" style={{ color: 'var(--sdv-warm)' }}>
                {truncate(skill.oneLiner, 70)}
              </p>
            )}
          </div>
        </div>

        {/* Stars rating */}
        {starsInfo && (
          <div className="flex items-center gap-2">
            <span className="font-pixel" style={{ fontSize: '12px', color: starsInfo.color, textShadow: `0 0 6px ${starsInfo.color}` }}>
              {starsInfo.stars}
            </span>
            <span className="font-dot text-sm" style={{ color: 'var(--sdv-dim)' }}>
              {starsInfo.label} · {skill.score}分
            </span>
          </div>
        )}

        {/* Chinese summary */}
        {!compact && skill.chineseSummary && (
          <p className="font-dot text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--sdv-dim)' }}>
            {skill.chineseSummary}
          </p>
        )}

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {roleLabels.map(r => r && (
            <span
              key={(r as any).id}
              className="font-dot text-xs px-2 py-0.5"
              style={{ border: '2px solid var(--sdv-teal2)', color: 'var(--sdv-teal)', background: 'rgba(80,200,160,0.08)' }}
            >
              {(r as any).icon} {(r as any).name}
            </span>
          ))}
          {catLabels.map(c => c && (
            <span
              key={(c as any).id}
              className="font-dot text-xs px-2 py-0.5"
              style={{ border: '2px solid var(--sdv-border)', color: 'var(--sdv-warm)' }}
            >
              {(c as any).icon} {(c as any).name}
            </span>
          ))}
          {pricingInfo && (
            <span
              className="font-dot text-xs px-2 py-0.5 ml-auto"
              style={{ border: '2px solid var(--sdv-border)', color: 'var(--sdv-dim)' }}
            >
              {pricingInfo.label}
            </span>
          )}
          {skill.isOpenSource && (
            <span className="font-dot text-xs px-2 py-0.5" style={{ border: '2px solid var(--sdv-purple)', color: 'var(--sdv-purple)', background: 'rgba(152,88,200,0.08)' }}>
              开源
            </span>
          )}
          {skill.stars != null && skill.stars > 0 && (
            <span className="font-dot text-xs" style={{ color: 'var(--sdv-dim)' }}>
              ★ {formatNumber(skill.stars)}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 px-4 py-2.5" style={{ borderTop: '3px solid var(--sdv-sh)' }}>
        <Link
          href={`/skills/${skill.slug}`}
          className="font-pixel"
          style={{ fontSize: '7px', color: 'var(--sdv-teal)' }}
          onMouseOver={e => (e.currentTarget.style.color = 'var(--sdv-gold)')}
          onMouseOut={e => (e.currentTarget.style.color = 'var(--sdv-teal)')}
        >
          ▶ 查看详情
        </Link>
        <div className="flex items-center gap-2 ml-auto">
          {skill.officialUrl && (
            <a href={skill.officialUrl} target="_blank" rel="noopener noreferrer" title="官网"
              style={{ color: 'var(--sdv-dim)' }}
              onMouseOver={e => (e.currentTarget.style.color = 'var(--sdv-teal)')}
              onMouseOut={e => (e.currentTarget.style.color = 'var(--sdv-dim)')}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {skill.githubUrl && (
            <a href={skill.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub"
              style={{ color: 'var(--sdv-dim)' }}
              onMouseOver={e => (e.currentTarget.style.color = 'var(--sdv-green)')}
              onMouseOut={e => (e.currentTarget.style.color = 'var(--sdv-dim)')}
            >
              <Github className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}


interface Props {
  skill: SkillListItem
  compact?: boolean
}

function scoreGlow(score: number) {
  if (score >= 90) return 'var(--px-green)'
  if (score >= 80) return 'var(--px-cyan)'
  if (score >= 70) return 'var(--px-yellow)'
  return '#6b7a8d'
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

  const glowColor = skill.score != null && skill.score > 0 ? scoreGlow(skill.score) : 'var(--px-border)'

  return (
    <div
      className="group relative flex flex-col overflow-hidden transition-all duration-150"
      style={{
        border: '2px solid var(--px-border)',
        background: 'var(--px-card)',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.6)',
      }}
      onMouseOver={e => {
        const el = e.currentTarget
        el.style.borderColor = glowColor
        el.style.boxShadow = `4px 4px 0 ${glowColor}`
      }}
      onMouseOut={e => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--px-border)'
        el.style.boxShadow = '4px 4px 0 rgba(0,0,0,0.6)'
      }}
    >
      {/* Score badge */}
      {skill.score != null && skill.score > 0 && (
        <div
          className="absolute top-0 right-0 font-pixel text-xs px-2 py-1"
          style={{
            background: 'var(--px-bg)',
            color: glowColor,
            borderLeft: `2px solid ${glowColor}`,
            borderBottom: `2px solid ${glowColor}`,
            textShadow: `0 0 6px ${glowColor}`,
          }}
        >
          {skill.score}PT
        </div>
      )}

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Header */}
        <div>
          <Link href={`/skills/${skill.slug}`} className="group/link block">
            <h3 className="font-pixel leading-tight pr-14" style={{ fontSize: '10px', color: 'var(--px-green)' }}>
              {skill.name}
            </h3>
          </Link>
          {skill.oneLiner && (
            <p className="mt-2 font-vt text-base leading-tight" style={{ color: '#8892a4' }}>
              {truncate(skill.oneLiner, 80)}
            </p>
          )}
        </div>

        {/* Chinese summary */}
        {!compact && skill.chineseSummary && (
          <p className="font-vt text-base leading-snug line-clamp-2" style={{ color: '#6b7a8d' }}>
            {skill.chineseSummary}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {roleLabels.map(r => r && (
            <span key={r.id} className="font-pixel px-1.5 py-0.5" style={{ fontSize: '7px', border: '1px solid var(--px-cyan)', color: 'var(--px-cyan)', background: 'rgba(0,229,255,0.06)' }}>
              {r.icon} {r.name}
            </span>
          ))}
          {catLabels.map(c => c && (
            <span key={c.id} className="font-pixel px-1.5 py-0.5" style={{ fontSize: '7px', border: '1px solid var(--px-border)', color: '#6b7a8d' }}>
              {c.icon} {c.name}
            </span>
          ))}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap font-vt text-base">
          {pricingInfo && (
            <span className="px-2 py-0.5" style={{ border: '1px solid var(--px-border)', color: '#8892a4' }}>
              {pricingInfo.label}
            </span>
          )}
          {difficultyInfo && (
            <span className="px-2 py-0.5" style={{ border: '1px solid var(--px-border)', color: '#8892a4' }}>
              {difficultyInfo.label}
            </span>
          )}
          {skill.isOpenSource && (
            <span className="px-2 py-0.5" style={{ border: '1px solid var(--px-purple)', color: 'var(--px-purple)', background: 'rgba(191,0,255,0.06)' }}>
              开源
            </span>
          )}
          {skill.requiresCoding && (
            <span className="flex items-center gap-0.5" style={{ color: '#6b7a8d' }}>
              <Code className="h-3 w-3" /> 需要编程
            </span>
          )}
          {skill.stars != null && skill.stars > 0 && (
            <span className="flex items-center gap-0.5 ml-auto" style={{ color: 'var(--px-yellow)' }}>
              <Star className="h-3 w-3" /> {formatNumber(skill.stars)}
            </span>
          )}
        </div>
      </div>

      {/* Footer links */}
      <div className="px-4 py-2.5 flex items-center gap-3" style={{ borderTop: '2px solid var(--px-border)' }}>
        <Link
          href={`/skills/${skill.slug}`}
          className="font-pixel transition-colors"
          style={{ fontSize: '8px', color: 'var(--px-green)' }}
        >
          &gt;&gt; 查看详情
        </Link>
        <div className="flex items-center gap-2 ml-auto">
          {skill.officialUrl && (
            <a
              href={skill.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#4a5568' }}
              title="官网"
              onMouseOver={e => (e.currentTarget.style.color = 'var(--px-cyan)')}
              onMouseOut={e => (e.currentTarget.style.color = '#4a5568')}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {skill.githubUrl && (
            <a
              href={skill.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#4a5568' }}
              title="GitHub"
              onMouseOver={e => (e.currentTarget.style.color = 'var(--px-green)')}
              onMouseOut={e => (e.currentTarget.style.color = '#4a5568')}
            >
              <Github className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}


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
