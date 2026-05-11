import Link from 'next/link'
import { ArrowRight, Zap, TrendingUp, Clock, Star } from 'lucide-react'
import prisma from '@/lib/db'
import { ROLES, CATEGORIES } from '@/lib/constants'
import SkillCard from '@/components/skills/SkillCard'
import { formatNumber } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // 5 min cache

async function getHomeData() {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [totalSkills, newThisWeek, featuredSkills, latestSkills, roleStats, catStats] = await Promise.all([
    prisma.skill.count({ where: { isActive: true, isHidden: false } }),
    prisma.skill.count({ where: { isActive: true, isHidden: false, createdAt: { gte: weekAgo } } }),
    prisma.skill.findMany({
      where: { isActive: true, isHidden: false, score: { gte: 80 } },
      orderBy: { score: 'desc' },
      take: 6,
    }),
    prisma.skill.findMany({
      where: { isActive: true, isHidden: false },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    prisma.skill.findMany({
      where: { isActive: true, isHidden: false },
      select: { roleCategories: true },
    }),
    prisma.skill.findMany({
      where: { isActive: true, isHidden: false },
      select: { functionCategories: true },
    }),
  ])

  const roleCounts: Record<string, number> = {}
  for (const s of roleStats) {
    for (const r of s.roleCategories) roleCounts[r] = (roleCounts[r] || 0) + 1
  }
  const catCounts: Record<string, number> = {}
  for (const s of catStats) {
    for (const c of s.functionCategories) catCounts[c] = (catCounts[c] || 0) + 1
  }

  return { totalSkills, newThisWeek, featuredSkills, latestSkills, roleCounts, catCounts }
}

export default async function HomePage() {
  const { totalSkills, newThisWeek, featuredSkills, latestSkills, roleCounts, catCounts } = await getHomeData()

  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-800 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="container relative pt-16 pb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-300 mb-6">
            <Zap className="h-3 w-3" />
            已收录 {formatNumber(totalSkills)} 个工作提效工具
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
            发现每个岗位<br />
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              能直接用的 AI 工具
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            覆盖咨询、金融、市场、产品、运营等12个岗位，搜罗 AI 工具、自动化方案、Prompt 模板和最佳实践。
          </p>

          {/* Quick role navigation */}
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {ROLES.slice(0, 8).map(role => (
              <Link
                key={role.id}
                href={`/skills?role=${role.id}`}
                className="flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-800/60 px-3 py-1.5 text-xs text-gray-300 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-300 transition-all"
              >
                <span>{role.icon}</span>
                <span>{role.name}</span>
              </Link>
            ))}
            <Link
              href="/roles"
              className="flex items-center gap-1.5 rounded-full border border-dashed border-gray-700 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              更多岗位 →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-gray-800 bg-gray-900/50">
        <div className="container py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Zap className="h-4 w-4 text-violet-400" />, value: formatNumber(totalSkills), label: '收录工具' },
              { icon: <TrendingUp className="h-4 w-4 text-green-400" />, value: `+${newThisWeek}`, label: '本周新增' },
              { icon: <Star className="h-4 w-4 text-yellow-400" />, value: '14', label: '覆盖岗位' },
              { icon: <Clock className="h-4 w-4 text-cyan-400" />, value: '20', label: '功能分类' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3">
                {stat.icon}
                <div>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mt-12 space-y-16">
        {/* Featured skills */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">⭐ 精选高分工具</h2>
              <p className="text-sm text-gray-500 mt-1">综合评分最高、实用性最强的工具</p>
            </div>
            <Link href="/rankings" className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300">
              查看榜单 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredSkills.map(skill => (
              <SkillCard key={skill.id} skill={skill as any} />
            ))}
          </div>
          {featuredSkills.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              <p>暂无数据，请先运行 <code className="text-gray-500">npm run db:seed</code> 添加初始数据</p>
            </div>
          )}
        </section>

        {/* Role cards */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">🎯 按岗位找工具</h2>
              <p className="text-sm text-gray-500 mt-1">告诉我你是什么岗位，我来推荐最适合的工具</p>
            </div>
            <Link href="/roles" className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300">
              全部岗位 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {ROLES.map(role => (
              <Link
                key={role.id}
                href={`/skills?role=${role.id}`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 p-4 text-center hover:border-violet-500/40 hover:bg-gray-800 transition-all"
              >
                <span className="text-2xl">{role.icon}</span>
                <span className="text-xs font-medium text-gray-300 group-hover:text-white leading-tight">
                  {role.name}
                </span>
                <span className="text-xs text-gray-600">
                  {roleCounts[role.id] || 0} 个工具
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Category grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">🔧 按功能找工具</h2>
              <p className="text-sm text-gray-500 mt-1">搜索你要做的具体工作</p>
            </div>
            <Link href="/categories" className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300">
              全部分类 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                href={`/skills?category=${cat.id}`}
                className="group flex items-center gap-2.5 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2.5 hover:border-violet-500/30 hover:bg-gray-800 transition-all"
              >
                <span className="text-base">{cat.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-300 group-hover:text-white truncate">{cat.name}</p>
                  <p className="text-xs text-gray-600">{catCounts[cat.id] || 0}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">🆕 最新收录</h2>
              <p className="text-sm text-gray-500 mt-1">刚刚加入的工具和方案</p>
            </div>
            <Link href="/skills?sortBy=newest" className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300">
              查看更多 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestSkills.map(skill => (
              <SkillCard key={skill.id} skill={skill as any} compact />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
