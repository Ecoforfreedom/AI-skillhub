import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Code,
  ExternalLink,
  GitFork,
  Github,
  Shield,
  Star,
} from 'lucide-react'
import prisma from '@/lib/db'
import { CATEGORIES, DIFFICULTY_LABELS, PRICING_LABELS, ROLES } from '@/lib/constants'
import { ensureSeeded } from '@/lib/seed'
import { displaySkillName, displaySkillText, formatDate, formatNumber } from '@/lib/utils'
import SkillCard from '@/components/skills/SkillCard'

export const dynamic = 'force-dynamic'

async function getSkill(id: string) {
  await ensureSeeded('[SkillDetailPage]')

  const skill = await prisma.skill.findFirst({
    where: { OR: [{ id }, { slug: id }], isHidden: false },
  })

  if (!skill) return null

  const similar = await prisma.skill.findMany({
    where: {
      id: { not: skill.id },
      isActive: true,
      isHidden: false,
      functionCategories: { hasSome: skill.functionCategories.length ? skill.functionCategories : ['automation'] },
    },
    orderBy: { score: 'desc' },
    take: 3,
  })

  return { skill, similar }
}

function SectionFrame({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section className="sdv-panel p-5 space-y-4">
      <h2 className="font-pixel flex items-center gap-2" style={{ fontSize: '8px', color: 'var(--sdv-gold)' }}>
        <span>{icon}</span>
        <span>{title}</span>
      </h2>
      {children}
    </section>
  )
}

export default async function SkillDetailPage({ params }: { params: { id: string } }) {
  const result = await getSkill(params.id)
  if (!result) notFound()

  const { skill, similar } = result
  const roles = skill.roleCategories.map(id => ROLES.find(role => role.id === id)).filter(Boolean)
  const categories = skill.functionCategories.map(id => CATEGORIES.find(category => category.id === id)).filter(Boolean)
  const difficulty = DIFFICULTY_LABELS[skill.difficulty || 'intermediate']
  const pricing = PRICING_LABELS[skill.pricingType || 'unknown']
  const skillName = displaySkillName(skill.name)
  const oneLiner = displaySkillText(skill.oneLiner)
  const chineseSummary = displaySkillText(skill.chineseSummary)

  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex items-center gap-2 mb-6 font-dot" style={{ fontSize: '15px', color: 'var(--sdv-dim)' }}>
        <Link href="/skills" className="flex items-center gap-1" style={{ color: 'var(--sdv-teal)' }}>
          <ArrowLeft className="h-3 w-3" /> 全部工具
        </Link>
        <span>▸</span>
        <span>{skillName}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="sdv-panel p-6">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="sdv-slot flex items-center justify-center" style={{ width: 58, height: 58, fontSize: 28 }}>
                {roles[0] ? (roles[0] as { icon: string }).icon : '🧰'}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-pixel" style={{ fontSize: '13px', color: 'var(--sdv-cream)' }}>
                  {skillName}
                </h1>
                {oneLiner ? (
                  <p className="font-dot mt-3" style={{ fontSize: '18px', color: 'var(--sdv-warm)', lineHeight: 1.7 }}>
                    {oneLiner}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  {roles.map(role => (
                    <span
                      key={(role as { id: string }).id}
                      className="font-dot px-3 py-1"
                      style={{ fontSize: '15px', border: '2px solid var(--sdv-teal2)', color: 'var(--sdv-teal)', background: 'rgba(80,200,160,0.08)' }}
                    >
                      {(role as { icon: string }).icon} {(role as { name: string }).name}
                    </span>
                  ))}
                  {categories.map(category => (
                    <span
                      key={(category as { id: string }).id}
                      className="font-dot px-3 py-1"
                      style={{ fontSize: '15px', border: '2px solid var(--sdv-border)', color: 'var(--sdv-warm)' }}
                    >
                      {(category as { icon: string }).icon} {(category as { name: string }).name}
                    </span>
                  ))}
                  <span className="font-dot px-3 py-1" style={{ fontSize: '15px', border: '2px solid var(--sdv-border)', color: 'var(--sdv-dim)' }}>
                    {pricing.label}
                  </span>
                  <span className="font-dot px-3 py-1" style={{ fontSize: '15px', border: '2px solid var(--sdv-border)', color: 'var(--sdv-dim)' }}>
                    {difficulty.label}
                  </span>
                </div>
              </div>
              {skill.score != null && skill.score > 0 ? (
                <div className="sdv-slot px-4 py-3 text-center min-w-[88px]">
                  <p className="font-pixel" style={{ fontSize: '7px', color: 'var(--sdv-gold)' }}>
                    评分
                  </p>
                  <p className="font-pixel mt-2" style={{ fontSize: '12px', color: 'var(--sdv-gold)' }}>
                    {skill.score}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {chineseSummary ? (
            <SectionFrame title="这个工具是什么" icon="📋">
              <p className="font-dot" style={{ fontSize: '17px', color: 'var(--sdv-cream)', lineHeight: 1.8 }}>
                {chineseSummary}
              </p>
            </SectionFrame>
          ) : null}

          {skill.whyUseful || skill.timeSavedReason ? (
            <SectionFrame title="为什么值得用" icon="✨">
              {skill.whyUseful ? (
                <p className="font-dot" style={{ fontSize: '17px', color: 'var(--sdv-cream)', lineHeight: 1.8 }}>
                  {skill.whyUseful}
                </p>
              ) : null}
              {skill.timeSavedReason ? (
                <div className="sdv-slot px-4 py-4">
                  <p className="font-pixel" style={{ fontSize: '7px', color: 'var(--sdv-green)' }}>
                    ⏱ 能省什么时间
                  </p>
                  <p className="font-dot mt-2" style={{ fontSize: '16px', color: 'var(--sdv-cream)' }}>
                    {skill.timeSavedReason}
                  </p>
                </div>
              ) : null}
            </SectionFrame>
          ) : null}

          {skill.useCases.length > 0 ? (
            <SectionFrame title="典型使用场景" icon="🎯">
              <ul className="space-y-3">
                {skill.useCases.map((useCase, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="sdv-slot flex items-center justify-center shrink-0" style={{ width: 26, height: 26, fontSize: 10 }}>
                      {index + 1}
                    </span>
                    <span className="font-dot" style={{ fontSize: '16px', color: 'var(--sdv-cream)' }}>
                      {useCase}
                    </span>
                  </li>
                ))}
              </ul>
            </SectionFrame>
          ) : null}

          {skill.workflowSteps.length > 0 ? (
            <SectionFrame title="怎么使用" icon="🪜">
              <ol className="space-y-3">
                {skill.workflowSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="sdv-slot flex items-center justify-center shrink-0" style={{ width: 28, height: 28, fontSize: 11 }}>
                      {index + 1}
                    </span>
                    <span className="font-dot" style={{ fontSize: '16px', color: 'var(--sdv-cream)' }}>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </SectionFrame>
          ) : null}

          {skill.targetUsers.length > 0 ? (
            <SectionFrame title="适合谁使用" icon="👥">
              <div className="flex flex-wrap gap-2">
                {skill.targetUsers.map((user, index) => (
                  <span key={index} className="font-dot px-3 py-1" style={{ fontSize: '15px', border: '2px solid var(--sdv-border)', color: 'var(--sdv-warm)' }}>
                    {user}
                  </span>
                ))}
              </div>
            </SectionFrame>
          ) : null}

          {(skill.inputType.length > 0 || skill.outputType.length > 0) ? (
            <section className="grid sm:grid-cols-2 gap-4">
              {skill.inputType.length > 0 ? (
                <div className="sdv-panel p-4">
                  <p className="font-pixel" style={{ fontSize: '7px', color: 'var(--sdv-blue)' }}>
                    📥 输入什么
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skill.inputType.map((item, index) => (
                      <span key={index} className="font-dot px-2 py-1" style={{ fontSize: '15px', border: '2px solid var(--sdv-border)', color: 'var(--sdv-warm)' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {skill.outputType.length > 0 ? (
                <div className="sdv-panel p-4">
                  <p className="font-pixel" style={{ fontSize: '7px', color: 'var(--sdv-green)' }}>
                    📤 输出什么
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skill.outputType.map((item, index) => (
                      <span key={index} className="font-dot px-2 py-1" style={{ fontSize: '15px', border: '2px solid var(--sdv-border)', color: 'var(--sdv-warm)' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}

          {skill.limitations || skill.riskNotes ? (
            <SectionFrame title="局限与风险提示" icon="⚠️">
              {skill.limitations ? (
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0" style={{ color: 'var(--sdv-gold)' }} />
                  <div>
                    <p className="font-pixel" style={{ fontSize: '7px', color: 'var(--sdv-gold)' }}>
                      局限性
                    </p>
                    <p className="font-dot mt-2" style={{ fontSize: '16px', color: 'var(--sdv-cream)' }}>
                      {skill.limitations}
                    </p>
                  </div>
                </div>
              ) : null}
              {skill.riskNotes ? (
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 shrink-0" style={{ color: 'var(--sdv-red)' }} />
                  <div>
                    <p className="font-pixel" style={{ fontSize: '7px', color: 'var(--sdv-red)' }}>
                      风险提示
                    </p>
                    <p className="font-dot mt-2" style={{ fontSize: '16px', color: 'var(--sdv-cream)' }}>
                      {skill.riskNotes}
                    </p>
                  </div>
                </div>
              ) : null}
            </SectionFrame>
          ) : null}

          {skill.scoreReason ? (
            <SectionFrame title={`评分说明 (${skill.score || 0}/100)`} icon="💡">
              <p className="font-dot" style={{ fontSize: '16px', color: 'var(--sdv-cream)' }}>
                {skill.scoreReason}
              </p>
            </SectionFrame>
          ) : null}
        </div>

        <aside className="space-y-5">
          <div className="sdv-panel p-5 space-y-4">
            <h3 className="font-pixel" style={{ fontSize: '8px', color: 'var(--sdv-gold)' }}>
              快速信息
            </h3>

            <div className="space-y-3 font-dot" style={{ fontSize: '16px' }}>
              {skill.officialUrl ? (
                <a href={skill.officialUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2" style={{ color: 'var(--sdv-teal)' }}>
                  <ExternalLink className="h-4 w-4 shrink-0" /> 访问官网
                </a>
              ) : null}
              {skill.githubUrl ? (
                <a href={skill.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2" style={{ color: 'var(--sdv-warm)' }}>
                  <Github className="h-4 w-4 shrink-0" /> 查看 GitHub
                </a>
              ) : null}
            </div>

            <div style={{ borderTop: '3px solid var(--sdv-sh)' }} className="pt-4 space-y-3 font-dot">
              {skill.stars != null && skill.stars > 0 ? (
                <div className="flex items-center justify-between" style={{ fontSize: '15px' }}>
                  <span style={{ color: 'var(--sdv-dim)' }} className="flex items-center gap-1"><Star className="h-3 w-3" /> Stars</span>
                  <span style={{ color: 'var(--sdv-cream)' }}>{formatNumber(skill.stars)}</span>
                </div>
              ) : null}
              {skill.forks != null && skill.forks > 0 ? (
                <div className="flex items-center justify-between" style={{ fontSize: '15px' }}>
                  <span style={{ color: 'var(--sdv-dim)' }} className="flex items-center gap-1"><GitFork className="h-3 w-3" /> Forks</span>
                  <span style={{ color: 'var(--sdv-cream)' }}>{formatNumber(skill.forks)}</span>
                </div>
              ) : null}
              <div className="flex items-center justify-between" style={{ fontSize: '15px' }}>
                <span style={{ color: 'var(--sdv-dim)' }}>价格</span>
                <span style={{ color: 'var(--sdv-cream)' }}>{pricing.label}</span>
              </div>
              <div className="flex items-center justify-between" style={{ fontSize: '15px' }}>
                <span style={{ color: 'var(--sdv-dim)' }}>难度</span>
                <span style={{ color: 'var(--sdv-cream)' }}>{difficulty.label}</span>
              </div>
              <div className="flex items-center justify-between" style={{ fontSize: '15px' }}>
                <span style={{ color: 'var(--sdv-dim)' }} className="flex items-center gap-1"><Code className="h-3 w-3" /> 需要编程</span>
                <span style={{ color: 'var(--sdv-cream)' }}>{skill.requiresCoding ? '是' : '否'}</span>
              </div>
              <div className="flex items-center justify-between" style={{ fontSize: '15px' }}>
                <span style={{ color: 'var(--sdv-dim)' }}>是否开源</span>
                <span style={{ color: 'var(--sdv-cream)' }}>{skill.isOpenSource ? '✓ 开源' : '不开源'}</span>
              </div>
              {skill.language ? (
                <div className="flex items-center justify-between" style={{ fontSize: '15px' }}>
                  <span style={{ color: 'var(--sdv-dim)' }}>主要语言</span>
                  <span style={{ color: 'var(--sdv-cream)' }}>{skill.language}</span>
                </div>
              ) : null}
              {skill.lastSourceUpdate ? (
                <div className="flex items-center justify-between" style={{ fontSize: '15px' }}>
                  <span style={{ color: 'var(--sdv-dim)' }}>最近更新</span>
                  <span style={{ color: 'var(--sdv-cream)' }}>{formatDate(skill.lastSourceUpdate)}</span>
                </div>
              ) : null}
            </div>
          </div>

          {skill.tags.length > 0 ? (
            <div className="sdv-panel p-4">
              <h3 className="font-pixel" style={{ fontSize: '7px', color: 'var(--sdv-gold)' }}>
                标签
              </h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {skill.tags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/skills?search=${encodeURIComponent(tag)}`}
                    className="font-dot px-2 py-1"
                    style={{ fontSize: '15px', border: '2px solid var(--sdv-border)', color: 'var(--sdv-warm)' }}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </aside>
      </div>

      {similar.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-pixel mb-6" style={{ fontSize: '11px', color: 'var(--sdv-gold)' }}>
            🔗 相似工具
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {similar.map(item => (
              <SkillCard key={item.id} skill={item as any} compact />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}