import Link from 'next/link'
import { Trophy, Star, ExternalLink } from 'lucide-react'
import prisma from '@/lib/db'
import { PRICING_LABELS } from '@/lib/constants'
import { cn, scoreColor, scoreBg } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const revalidate = 300

async function getRankings() {
  const baseWhere = { isActive: true, isHidden: false }

  const [overall, free, opensource, newest, consulting, finance, marketing, product, research, engineering] = await Promise.all([
    prisma.skill.findMany({ where: baseWhere, orderBy: { score: 'desc' }, take: 10, select: { id: true, name: true, slug: true, oneLiner: true, score: true, pricingType: true } }),
    prisma.skill.findMany({ where: { ...baseWhere, pricingType: { in: ['free', 'freemium', 'open_source'] } }, orderBy: { score: 'desc' }, take: 10, select: { id: true, name: true, slug: true, oneLiner: true, score: true, pricingType: true } }),
    prisma.skill.findMany({ where: { ...baseWhere, isOpenSource: true }, orderBy: { stars: 'desc' }, take: 10, select: { id: true, name: true, slug: true, oneLiner: true, score: true, pricingType: true, stars: true } }),
    prisma.skill.findMany({ where: baseWhere, orderBy: { createdAt: 'desc' }, take: 10, select: { id: true, name: true, slug: true, oneLiner: true, score: true, pricingType: true, createdAt: true } }),
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
  { key: 'overall',     title: '🏆 综合推荐榜',       desc: '综合评分最高的工具' },
  { key: 'free',        title: '🆓 免费工具榜',        desc: '免费/Freemium/开源工具' },
  { key: 'opensource',  title: '📦 开源工具榜',        desc: '按 GitHub Stars 排序' },
  { key: 'newest',      title: '🆕 最新收录榜',        desc: '最近加入的工具' },
  { key: 'consulting',  title: '💼 咨询顾问提效榜',    desc: '适合咨询行业的工具' },
  { key: 'finance',     title: '📈 金融分析提效榜',    desc: '适合金融投资的工具' },
  { key: 'marketing',   title: '📣 市场人提效榜',      desc: '适合市场品牌的工具' },
  { key: 'product',     title: '🎯 产品经理提效榜',    desc: '适合产品管理的工具' },
  { key: 'research',    title: '🔬 学术研究提效榜',    desc: '适合研究和学术的工具' },
  { key: 'engineering', title: '💻 编程开发提效榜',    desc: '适合技术开发的工具' },
]

export default async function RankingsPage() {
  const rankings = await getRankings()

  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-7 w-7 text-yellow-400" />
          <h1 className="text-3xl font-bold text-white">工具榜单</h1>
        </div>
        <p className="text-gray-400">按岗位和功能整理的最佳提效工具榜单</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {RANKINGS_META.map(meta => {
          const list = (rankings as any)[meta.key] || []
          return (
            <div key={meta.key} className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800">
                <h2 className="font-semibold text-white">{meta.title}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{meta.desc}</p>
              </div>
              <div className="divide-y divide-gray-800">
                {list.length === 0 ? (
                  <p className="px-5 py-4 text-sm text-gray-600">暂无数据</p>
                ) : (
                  list.map((skill: any, i: number) => {
                    const pricing = PRICING_LABELS[skill.pricingType || 'unknown']
                    return (
                      <Link
                        key={skill.id}
                        href={`/skills/${skill.slug}`}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-800 transition-colors group"
                      >
                        {/* Rank */}
                        <span className={cn(
                          'w-6 text-center text-sm font-bold shrink-0',
                          i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-gray-600'
                        )}>
                          {i + 1}
                        </span>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-200 group-hover:text-white truncate">{skill.name}</p>
                          {skill.oneLiner && (
                            <p className="text-xs text-gray-600 truncate">{skill.oneLiner}</p>
                          )}
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-2 shrink-0">
                          {pricing && (
                            <span className={cn('rounded-full border px-2 py-0.5 text-xs hidden sm:inline', pricing.color)}>
                              {pricing.label}
                            </span>
                          )}
                          {skill.score != null && skill.score > 0 && (
                            <span className={cn('text-sm font-bold', scoreColor(skill.score))}>
                              {skill.score}
                            </span>
                          )}
                        </div>
                      </Link>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
