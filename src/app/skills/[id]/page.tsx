import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ExternalLink, Github, Star, GitFork, Code, DollarSign,
  CheckCircle, AlertTriangle, ChevronRight, ArrowLeft, Shield
} from 'lucide-react'
import prisma from '@/lib/db'
import { ROLES, CATEGORIES, DIFFICULTY_LABELS, PRICING_LABELS } from '@/lib/constants'
import { formatNumber, formatDate, scoreColor, scoreBg, cn } from '@/lib/utils'
import SkillCard from '@/components/skills/SkillCard'

export const dynamic = 'force-dynamic'

async function getSkill(id: string) {
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

export default async function SkillDetailPage({ params }: { params: { id: string } }) {
  const result = await getSkill(params.id)
  if (!result) notFound()
  const { skill, similar } = result

  const roles = skill.roleCategories
    .map(id => ROLES.find(r => r.id === id))
    .filter(Boolean)

  const cats = skill.functionCategories
    .map(id => CATEGORIES.find(c => c.id === id))
    .filter(Boolean)

  const diffInfo = DIFFICULTY_LABELS[skill.difficulty || 'intermediate']
  const priceInfo = PRICING_LABELS[skill.pricingType || 'unknown']

  return (
    <div className="container py-8 max-w-6xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-600 mb-6">
        <Link href="/skills" className="hover:text-gray-400 flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> 全部工具
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-500">{skill.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-start gap-4 flex-wrap">
              <h1 className="text-3xl font-bold text-white flex-1">{skill.name}</h1>
              {skill.score != null && skill.score > 0 && (
                <div className={cn('flex items-center gap-1.5 rounded-xl border px-4 py-2 text-lg font-bold', scoreBg(skill.score), scoreColor(skill.score))}>
                  <Star className="h-5 w-5" />
                  {skill.score}
                </div>
              )}
            </div>

            {skill.oneLiner && (
              <p className="mt-2 text-gray-400 text-base leading-relaxed">{skill.oneLiner}</p>
            )}

            {/* Badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              {roles.map(r => r && (
                <span key={r.id} className={cn('inline-flex items-center rounded-full border px-3 py-1 text-sm gap-1', r.color)}>
                  {r.icon} {r.name}
                </span>
              ))}
              {cats.map(c => c && (
                <span key={c.id} className="inline-flex items-center rounded-full border border-gray-700 bg-gray-800/60 text-gray-300 px-3 py-1 text-sm gap-1">
                  {c.icon} {c.name}
                </span>
              ))}
              {priceInfo && (
                <span className={cn('rounded-full border px-3 py-1 text-sm', priceInfo.color)}>
                  {priceInfo.label}
                </span>
              )}
              {diffInfo && (
                <span className={cn('rounded-full border px-3 py-1 text-sm', diffInfo.color)}>
                  {diffInfo.label}
                </span>
              )}
              {skill.isOpenSource && (
                <span className="rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 px-3 py-1 text-sm">
                  开源
                </span>
              )}
            </div>
          </div>

          {/* Chinese summary */}
          {skill.chineseSummary && (
            <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <h2 className="text-base font-semibold text-white mb-3">📋 这个工具是什么？</h2>
              <p className="text-gray-300 leading-relaxed">{skill.chineseSummary}</p>
            </section>
          )}

          {/* Why useful / time saved */}
          {(skill.whyUseful || skill.timeSavedReason) && (
            <section className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
              <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" /> 为什么值得用？
              </h2>
              {skill.whyUseful && <p className="text-gray-300 leading-relaxed mb-3">{skill.whyUseful}</p>}
              {skill.timeSavedReason && (
                <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3 mt-3">
                  <p className="text-xs font-medium text-green-300 mb-1">⏱ 能省什么时间</p>
                  <p className="text-sm text-green-200">{skill.timeSavedReason}</p>
                </div>
              )}
            </section>
          )}

          {/* Use cases */}
          {skill.useCases.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-white mb-3">🎯 典型使用场景</h2>
              <ul className="space-y-2">
                {skill.useCases.map((uc, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-violet-600/20 text-violet-300 flex items-center justify-center text-xs">
                      {i + 1}
                    </span>
                    {uc}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Workflow steps */}
          {skill.workflowSteps.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-white mb-3">📌 怎么用？</h2>
              <ol className="space-y-3">
                {skill.workflowSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-300 leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Target users */}
          {skill.targetUsers.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-white mb-3">👥 适合谁使用？</h2>
              <div className="flex flex-wrap gap-2">
                {skill.targetUsers.map((u, i) => (
                  <span key={i} className="rounded-full border border-gray-700 bg-gray-800/60 text-gray-300 px-3 py-1 text-sm">
                    {u}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Input/Output */}
          {(skill.inputType.length > 0 || skill.outputType.length > 0) && (
            <section className="grid sm:grid-cols-2 gap-4">
              {skill.inputType.length > 0 && (
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                  <p className="text-xs font-semibold text-gray-400 mb-2">📥 输入什么</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.inputType.map((t, i) => (
                      <span key={i} className="text-xs bg-gray-800 text-gray-300 rounded px-2 py-1">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {skill.outputType.length > 0 && (
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                  <p className="text-xs font-semibold text-gray-400 mb-2">📤 输出什么</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.outputType.map((t, i) => (
                      <span key={i} className="text-xs bg-gray-800 text-gray-300 rounded px-2 py-1">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Limitations & Risk */}
          {(skill.limitations || skill.riskNotes) && (
            <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" /> 局限与风险提示
              </h2>
              {skill.limitations && (
                <div>
                  <p className="text-xs font-medium text-amber-300 mb-1">局限性</p>
                  <p className="text-sm text-gray-300">{skill.limitations}</p>
                </div>
              )}
              {skill.riskNotes && (
                <div>
                  <p className="text-xs font-medium text-amber-300 mb-1 flex items-center gap-1">
                    <Shield className="h-3 w-3" /> 风险提示
                  </p>
                  <p className="text-sm text-gray-300">{skill.riskNotes}</p>
                </div>
              )}
            </section>
          )}

          {/* Score reason */}
          {skill.scoreReason && (
            <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <h2 className="text-base font-semibold text-white mb-2">
                💡 评分说明 ({skill.score}/100)
              </h2>
              <p className="text-sm text-gray-400">{skill.scoreReason}</p>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          {/* Quick info */}
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">快速信息</h3>

            <div className="space-y-3 text-sm">
              {skill.officialUrl && (
                <a
                  href={skill.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-violet-400 hover:text-violet-300 font-medium"
                >
                  <ExternalLink className="h-4 w-4 shrink-0" />
                  访问官网
                </a>
              )}
              {skill.githubUrl && (
                <a
                  href={skill.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-gray-200"
                >
                  <Github className="h-4 w-4 shrink-0" />
                  查看 GitHub
                </a>
              )}
            </div>

            <div className="border-t border-gray-800 pt-4 space-y-3">
              {skill.stars != null && skill.stars > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 flex items-center gap-1"><Star className="h-3 w-3" /> Stars</span>
                  <span className="text-gray-300 font-medium">{formatNumber(skill.stars)}</span>
                </div>
              )}
              {skill.forks != null && skill.forks > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 flex items-center gap-1"><GitFork className="h-3 w-3" /> Forks</span>
                  <span className="text-gray-300 font-medium">{formatNumber(skill.forks)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">价格</span>
                {priceInfo && <span className={cn('rounded-full border px-2 py-0.5', priceInfo.color)}>{priceInfo.label}</span>}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">难度</span>
                {diffInfo && <span className={cn('rounded-full border px-2 py-0.5', diffInfo.color)}>{diffInfo.label}</span>}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 flex items-center gap-1"><Code className="h-3 w-3" /> 需要编程</span>
                <span className="text-gray-300">{skill.requiresCoding ? '是' : '否'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">是否开源</span>
                <span className="text-gray-300">{skill.isOpenSource ? '✓ 开源' : '不开源'}</span>
              </div>
              {skill.language && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">主要语言</span>
                  <span className="text-gray-300">{skill.language}</span>
                </div>
              )}
              {skill.lastSourceUpdate && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">最近更新</span>
                  <span className="text-gray-300">{formatDate(skill.lastSourceUpdate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {skill.tags.length > 0 && (
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
              <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">标签</h3>
              <div className="flex flex-wrap gap-1.5">
                {skill.tags.map((tag, i) => (
                  <Link
                    key={i}
                    href={`/skills?search=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-gray-700 bg-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-600 px-2 py-0.5 text-xs transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Similar tools */}
      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-white mb-6">🔗 相似工具</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {similar.map(s => (
              <SkillCard key={s.id} skill={s as any} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
