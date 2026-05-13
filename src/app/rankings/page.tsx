import Link from 'next/link'
import prisma from '@/lib/db'
import { PRICING_LABELS } from '@/lib/constants'
import { ensureSeeded } from '@/lib/seed'
import { displaySkillName, displaySkillText } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const revalidate = 300

async function getRankings() {
  await ensureSeeded('[RankingsPage]')

  const baseWhere = { isActive: true, isHidden: false }

  const [overall, free, opensource, newest, consulting, finance, marketing, product, research, engineering] = await Promise.all([
    prisma.skill.findMany({ where: baseWhere, orderBy: { score: 'desc' }, take: 10, select: { id: true, name: true, slug: true, oneLiner: true, score: true, pricingType: true } }),
    prisma.skill.findMany({ where: { ...baseWhere, pricingType: { in: ['free', 'freemium', 'open_source'] } }, orderBy: { score: 'desc' }, take: 10, select: { id: true, name: true, slug: true, oneLiner: true, score: true, pricingType: true } }),
    prisma.skill.findMany({ where: { ...baseWhere, isOpenSource: true }, orderBy: { stars: 'desc' }, take: 10, select: { id: true, name: true, slug: true, oneLiner: true, score: true, pricingType: true, stars: true } }),
    prisma.skill.findMany({ where: baseWhere, orderBy: { createdAt: 'desc' }, take: 10, select: { id: true, name: true, slug: true, oneLiner: true, score: true, pricingType: true } }),
    prisma.skill.findMany({ where: { ...baseWhere, roleCategories: { has: 'consulting' } }, orderBy: { score: 'desc' }, take: 10, select: { id: true, name: true, slug: true, oneLiner: true, score: true, pricingType: true } }),
    prisma.skill.findMany({ where: { ...baseWhere, roleCategories: { has: 'finance' } }, orderBy: { score: 'desc' }, take: 10, select: { id: true, name: true, slug: true, oneLiner: true, score: true, pricingType: true } }),
    prisma.skill.findMany({ where: { ...baseWhere, roleCategories: { has: 'marketing' } }, orderBy: { score: 'desc' }, take: 10, select: { id: true, name: true, slug: true, oneLiner: true, score: true, pricingType: true } }),
    prisma.skill.findMany({ where: { ...baseWhere, roleCategories: { has: 'product' } }, orderBy: { score: 'desc' }, take: 10, select: { id: true, name: true, slug: true, oneLiner: true, score: true, pricingType: true } }),
    prisma.skill.findMany({ where: { ...baseWhere, roleCategories: { has: 'research' } }, orderBy: { score: 'desc' }, take: 10, select: { id: true, name: true, slug: true, oneLiner: true, score: true, pricingType: true } }),
    prisma.skill.findMany({ where: { ...baseWhere, roleCategories: { has: 'engineering' } }, orderBy: { score: 'desc' }, take: 10, select: { id: true, name: true, slug: true, oneLiner: true, score: true, pricingType: true } }),
  ])

  return { overall, free, opensource, newest, consulting, finance, marketing, product, research, engineering }
}

const RANKINGS_META = [
  { key: 'overall', title: '🏆 综合推荐榜', desc: '综合评分最高的工具' },
  { key: 'free', title: '🆓 免费工具榜', desc: '免费 / Freemium / 开源工具' },
  { key: 'opensource', title: '📦 开源工具榜', desc: '按 GitHub Stars 排序' },
  { key: 'newest', title: '🆕 最新收录榜', desc: '最近加入的工具' },
  { key: 'consulting', title: '💼 咨询顾问提效榜', desc: '适合咨询行业的工具' },
  { key: 'finance', title: '📈 金融分析提效榜', desc: '适合金融投资的工具' },
  { key: 'marketing', title: '📣 市场人提效榜', desc: '适合市场品牌的工具' },
  { key: 'product', title: '🎯 产品经理提效榜', desc: '适合产品管理的工具' },
  { key: 'research', title: '🔬 学术研究提效榜', desc: '适合研究和学术的工具' },
  { key: 'engineering', title: '💻 编程开发提效榜', desc: '适合技术开发的工具' },
] as const

export default async function RankingsPage() {
  const rankings = await getRankings()

  return (
    <div className="container py-10">
      <div className="sdv-panel px-6 py-6 mb-8">
        <p className="font-pixel text-glow-gold" style={{ fontSize: '8px', color: 'var(--sdv-gold)' }}>
          榜单大厅
        </p>
        <h1 className="font-pixel mt-3" style={{ fontSize: '14px', color: 'var(--sdv-cream)' }}>
          工具榜单
        </h1>
        <p className="font-dot mt-2" style={{ fontSize: '17px', color: 'var(--sdv-dim)' }}>
          按岗位和功能整理好的提效榜单，像公告板一样一眼看清谁最能打。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {RANKINGS_META.map(meta => {
          const list = rankings[meta.key]
          return (
            <div key={meta.key} className="sdv-panel overflow-hidden">
              <div className="px-5 py-4" style={{ borderBottom: '3px solid var(--sdv-sh)' }}>
                <h2 className="font-pixel" style={{ fontSize: '8px', color: 'var(--sdv-cream)' }}>
                  {meta.title}
                </h2>
                <p className="font-dot mt-1" style={{ fontSize: '15px', color: 'var(--sdv-dim)' }}>
                  {meta.desc}
                </p>
              </div>

              <div>
                {list.length > 0 ? (
                  list.map((skill, index) => {
                    const pricing = PRICING_LABELS[skill.pricingType || 'unknown']
                    const rankColor = index === 0 ? 'var(--sdv-gold)' : index === 1 ? 'var(--sdv-silver)' : index === 2 ? '#c87840' : 'var(--sdv-dim)'

                    return (
                      <Link
                        key={skill.id}
                        href={`/skills/${skill.slug}`}
                        className="flex items-center gap-3 px-5 py-3"
                        style={{ borderBottom: index === list.length - 1 ? 'none' : '2px solid var(--sdv-sh)' }}
                      >
                        <span className="font-pixel w-7 text-center shrink-0" style={{ fontSize: '8px', color: rankColor }}>
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-pixel truncate" style={{ fontSize: '7px', color: 'var(--sdv-cream)' }}>
                            {displaySkillName(skill.name)}
                          </p>
                          {skill.oneLiner ? (
                            <p className="font-dot truncate" style={{ fontSize: '15px', color: 'var(--sdv-dim)' }}>
                              {displaySkillText(skill.oneLiner)}
                            </p>
                          ) : null}
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                          <span className="font-dot px-2 py-0.5" style={{ fontSize: '13px', border: '2px solid var(--sdv-border)', color: 'var(--sdv-warm)' }}>
                            {pricing.label}
                          </span>
                          {skill.score ? (
                            <span className="font-pixel" style={{ fontSize: '8px', color: 'var(--sdv-gold)' }}>
                              {skill.score}
                            </span>
                          ) : null}
                        </div>
                      </Link>
                    )
                  })
                ) : (
                  <p className="px-5 py-4 font-dot" style={{ fontSize: '15px', color: 'var(--sdv-dim)' }}>
                    暂无数据
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}