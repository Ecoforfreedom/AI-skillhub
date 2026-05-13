import Link from 'next/link'
import prisma from '@/lib/db'
import { ROLES, CATEGORIES } from '@/lib/constants'
import SkillCard from '@/components/skills/SkillCard'
import { formatNumber } from '@/lib/utils'
import { ensureSeeded } from '@/lib/seed'

export const dynamic = 'force-dynamic'
export const revalidate = 300

async function getHomeData() {
  await ensureSeeded('[HomePage]')

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
    prisma.skill.findMany({ where: { isActive: true, isHidden: false }, select: { roleCategories: true } }),
    prisma.skill.findMany({ where: { isActive: true, isHidden: false }, select: { functionCategories: true } }),
  ])

  const roleCounts: Record<string, number> = {}
  for (const skill of roleStats) {
    for (const role of skill.roleCategories) {
      roleCounts[role] = (roleCounts[role] || 0) + 1
    }
  }

  const catCounts: Record<string, number> = {}
  for (const skill of catStats) {
    for (const category of skill.functionCategories) {
      catCounts[category] = (catCounts[category] || 0) + 1
    }
  }

  return { totalSkills, newThisWeek, featuredSkills, latestSkills, roleCounts, catCounts }
}

function SdvSection({ icon, title, sub, linkHref, linkLabel, children }: {
  icon: string
  title: string
  sub: string
  linkHref: string
  linkLabel: string
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="sdv-slot flex items-center justify-center text-2xl"
            style={{ width: 44, height: 44 }}
          >
            {icon}
          </div>
          <div>
            <h2
              className="font-pixel"
              style={{ fontSize: '11px', color: 'var(--sdv-gold)', textShadow: '1px 1px 0 var(--sdv-sh), 0 0 8px rgba(240,192,48,0.3)' }}
            >
              {title}
            </h2>
            <p className="font-dot mt-1" style={{ fontSize: '16px', color: 'var(--sdv-dim)' }}>
              {sub}
            </p>
          </div>
        </div>
        <Link href={linkHref} className="sdv-btn" style={{ textDecoration: 'none' }}>
          {linkLabel} ▶
        </Link>
      </div>
      {children}
    </section>
  )
}

export default async function HomePage() {
  const { totalSkills, newThisWeek, featuredSkills, latestSkills, roleCounts, catCounts } = await getHomeData()

  return (
    <div className="pb-20" style={{ position: 'relative', zIndex: 1 }}>
      <section
        style={{
          borderBottom: '4px solid var(--sdv-border)',
          padding: '56px 0 48px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(42,22,6,0.8) 0%, transparent 100%)',
        }}
      >
        <div className="container relative">
          <div
            className="inline-block mb-6 font-pixel"
            style={{
              fontSize: 'clamp(12px, 2.5vw, 18px)',
              color: 'var(--sdv-gold)',
              textShadow: '2px 2px 0 var(--sdv-sh), 0 0 12px rgba(240,192,48,0.4)',
              background: 'var(--sdv-wood2)',
              border: '4px solid var(--sdv-border)',
              padding: '12px 24px',
              boxShadow: '4px 4px 0 var(--sdv-sh), inset 2px 2px 0 var(--sdv-hi), inset -2px -2px 0 var(--sdv-sh)',
              lineHeight: 1.8,
            }}
          >
            ✦ AI SKILL RADAR ✦
          </div>

          <h1 className="font-pixel mb-4" style={{ fontSize: 'clamp(10px, 2vw, 14px)', color: 'var(--sdv-cream)', lineHeight: 2 }}>
            发现每个岗位
            <br />
            <span style={{ color: 'var(--sdv-teal)', textShadow: '0 0 10px rgba(80,200,160,0.6)' }}>
              能直接用的 AI 工具
            </span>
          </h1>

          <p className="font-dot mx-auto mb-8" style={{ fontSize: '18px', color: 'var(--sdv-warm)', maxWidth: 560, lineHeight: 1.7 }}>
            覆盖咨询、金融、市场、产品、运营等14个岗位
            <br />
            搜罗 AI 工具、自动化方案和 Prompt 模板
          </p>

          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {ROLES.slice(0, 8).map(role => (
              <Link
                key={role.id}
                href={`/skills?role=${role.id}`}
                className="flex items-center gap-1.5 font-dot text-sm sdv-panel sdv-panel-hover"
                style={{
                  padding: '6px 12px',
                  color: 'var(--sdv-warm)',
                  textDecoration: 'none',
                  transition: 'all 0.1s',
                }}
              >
                <span>{role.icon}</span>
                <span>{role.name}</span>
              </Link>
            ))}
            <Link href="/roles" className="sdv-btn font-dot text-sm" style={{ textDecoration: 'none' }}>
              更多岗位 ▶
            </Link>
          </div>
        </div>
      </section>

      <section style={{ borderBottom: '4px solid var(--sdv-border)' }}>
        <div className="container py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: '📦', value: formatNumber(totalSkills), label: '收录工具', color: 'var(--sdv-teal)' },
              { icon: '🌱', value: `+${newThisWeek}`, label: '本周新增', color: 'var(--sdv-green)' },
              { icon: '👤', value: '14', label: '覆盖岗位', color: 'var(--sdv-gold)' },
              { icon: '🗂️', value: '20', label: '功能分类', color: 'var(--sdv-blue)' },
            ].map((stat, index) => (
              <div key={index} className="sdv-slot flex items-center gap-3 px-4 py-3">
                <span style={{ fontSize: '22px' }}>{stat.icon}</span>
                <div>
                  <p className="font-pixel" style={{ fontSize: '14px', color: stat.color, textShadow: `0 0 6px ${stat.color}` }}>
                    {stat.value}
                  </p>
                  <p className="font-dot" style={{ fontSize: '15px', color: 'var(--sdv-dim)' }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mt-12 space-y-16">
        <SdvSection icon="⭐" title="精选高分工具" sub="综合评分最高、实用性最强" linkHref="/rankings" linkLabel="查看榜单">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredSkills.map(skill => (
              <SkillCard key={skill.id} skill={skill as any} />
            ))}
          </div>
          {featuredSkills.length === 0 && (
            <div className="sdv-slot py-16 text-center" style={{ border: '4px dashed var(--sdv-border)' }}>
              <p className="font-pixel mb-3" style={{ fontSize: '10px', color: 'var(--sdv-gold)' }}>
                暂无数据
              </p>
              <p className="font-dot" style={{ color: 'var(--sdv-dim)' }}>
                等待服务器启动时自动导入初始数据...
              </p>
            </div>
          )}
        </SdvSection>

        <SdvSection icon="🗺️" title="按岗位找工具" sub="选择你的岗位，发现最适合你的 AI 工具" linkHref="/roles" linkLabel="全部岗位">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {ROLES.map(role => (
              <Link
                key={role.id}
                href={`/skills?role=${role.id}`}
                className="flex flex-col items-center gap-2 p-3 text-center sdv-panel sdv-panel-hover"
                style={{ textDecoration: 'none' }}
              >
                <span style={{ fontSize: '26px' }}>{role.icon}</span>
                <span className="font-pixel leading-snug" style={{ fontSize: '6.5px', color: 'var(--sdv-cream)' }}>
                  {role.name}
                </span>
                <span className="font-dot" style={{ fontSize: '14px', color: 'var(--sdv-dim)' }}>
                  {roleCounts[role.id] || 0} 个
                </span>
              </Link>
            ))}
          </div>
        </SdvSection>

        <SdvSection icon="📦" title="按功能找工具" sub="按你要做的具体工作来搜索" linkHref="/categories" linkLabel="全部分类">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {CATEGORIES.map(category => (
              <Link
                key={category.id}
                href={`/skills?category=${category.id}`}
                className="flex items-center gap-2.5 px-3 py-2.5 sdv-panel sdv-panel-hover"
                style={{ textDecoration: 'none' }}
              >
                <span style={{ fontSize: '18px' }}>{category.icon}</span>
                <div className="min-w-0">
                  <p className="font-pixel truncate" style={{ fontSize: '6.5px', color: 'var(--sdv-cream)' }}>
                    {category.name}
                  </p>
                  <p className="font-dot" style={{ fontSize: '14px', color: 'var(--sdv-dim)' }}>
                    {catCounts[category.id] || 0} 个
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </SdvSection>

        <SdvSection icon="🌿" title="最新收录" sub="刚刚加入的工具和方案" linkHref="/skills?sortBy=newest" linkLabel="更多">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestSkills.map(skill => (
              <SkillCard key={skill.id} skill={skill as any} compact />
            ))}
          </div>
        </SdvSection>
      </div>
    </div>
  )
}
