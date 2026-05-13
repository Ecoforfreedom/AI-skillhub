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
    <section className="page-enter" style={{ animationDelay: '120ms' }}>
      <div className="flex items-end justify-between mb-7 gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div
            className="sdv-slot flex items-center justify-center text-2xl"
            style={{ width: 52, height: 52 }}
          >
            {icon}
          </div>
          <div>
            <h2
              className="font-pixel"
              style={{ fontSize: '34px', color: 'var(--sdv-cream)' }}
            >
              {title}
            </h2>
            <p className="font-dot mt-2" style={{ fontSize: '17px', color: 'var(--sdv-dim)' }}>
              {sub}
            </p>
          </div>
        </div>
        <Link href={linkHref} className="section-link" style={{ textDecoration: 'none' }}>
          {linkLabel} →
        </Link>
      </div>
      {children}
    </section>
  )
}

export default async function HomePage() {
  const { totalSkills, newThisWeek, featuredSkills, latestSkills, roleCounts, catCounts } = await getHomeData()

  return (
    <div className="pb-24" style={{ position: 'relative', zIndex: 1 }}>
      <section
        className="page-enter"
        style={{
          padding: '88px 0 72px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="hero-orbit" />
        <div className="container relative">
          <div
            className="inline-flex items-center gap-2 mb-8 font-dot"
            style={{
              fontSize: '14px',
              color: 'var(--sdv-silver)',
              background: 'rgba(8, 18, 34, 0.72)',
              border: '1px solid rgba(151, 184, 255, 0.16)',
              padding: '10px 16px',
              borderRadius: 999,
              boxShadow: '0 14px 34px rgba(2, 6, 23, 0.2)',
              lineHeight: 1,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '999px',
                background: 'var(--sdv-teal)',
                boxShadow: '0 0 14px rgba(124, 230, 255, 0.46)',
              }}
            />
            AI tooling intelligence for modern teams
          </div>

          <h1 className="font-pixel mb-6 mx-auto" style={{ fontSize: 'clamp(56px, 7vw, 76px)', maxWidth: 980, color: 'var(--sdv-cream)', lineHeight: 1.02 }}>
            把分散的 AI 工具
            <br />
            <span className="text-glow-teal" style={{ color: 'var(--sdv-silver)' }}>
              组织成可执行的工作流雷达
            </span>
          </h1>

          <p className="font-dot mx-auto mb-10" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--sdv-dim)', maxWidth: 760, lineHeight: 1.8 }}>
            面向咨询、金融、市场、产品、运营与研发团队的 AI 工具目录，
            用统一的信息层级、岗位视角和高信号筛选，帮助你更快判断什么值得接入工作流。
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              href="/skills"
              className="sdv-btn"
              style={{
                minHeight: 54,
                paddingInline: 24,
                background: 'linear-gradient(180deg, rgba(244, 248, 255, 0.98) 0%, rgba(215, 226, 255, 0.94) 100%)',
                color: '#08111f',
                boxShadow: '0 24px 60px rgba(72, 118, 255, 0.22)',
              }}
            >
              开始探索工具
            </Link>
            <Link
              href="/rankings"
              className="sdv-btn"
              style={{
                minHeight: 54,
                paddingInline: 24,
                background: 'rgba(9, 18, 34, 0.32)',
                color: 'var(--sdv-silver)',
              }}
            >
              查看高分榜单
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-5xl mx-auto">
            {[
              { label: '已收录工具', value: formatNumber(totalSkills), hint: '持续每日更新' },
              { label: '本周新增', value: `+${newThisWeek}`, hint: '来自 GitHub 与工具目录' },
              { label: '覆盖岗位', value: '14', hint: '按团队角色组织' },
              { label: '功能维度', value: '20', hint: '支持快速筛选' },
            ].map(item => (
              <div key={item.label} className="sdv-panel px-5 py-5 text-left">
                <p className="font-dot" style={{ fontSize: '13px', color: 'var(--sdv-dim)' }}>{item.label}</p>
                <p className="font-pixel mt-3" style={{ fontSize: '32px', color: 'var(--sdv-cream)' }}>{item.value}</p>
                <p className="font-dot mt-2" style={{ fontSize: '13px', color: 'var(--sdv-dim)' }}>{item.hint}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {ROLES.slice(0, 8).map(role => (
              <Link
                key={role.id}
                href={`/skills?role=${role.id}`}
                className="flex items-center gap-2 font-dot text-sm sdv-chip"
                style={{
                  padding: '12px 16px',
                  color: 'var(--sdv-warm)',
                  textDecoration: 'none',
                  transition: 'all 220ms ease',
                }}
              >
                <span>{role.icon}</span>
                <span>{role.name}</span>
              </Link>
            ))}
            <Link href="/roles" className="sdv-chip font-dot text-sm" style={{ textDecoration: 'none', padding: '12px 16px' }}>
              查看全部岗位 →
            </Link>
          </div>
        </div>
      </section>

      <div className="container mt-20 space-y-20">
        <SdvSection icon="⭐" title="精选高分工具" sub="综合评分最高、实用性最强" linkHref="/rankings" linkLabel="查看榜单">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredSkills.map(skill => (
              <SkillCard key={skill.id} skill={skill as any} />
            ))}
          </div>
          {featuredSkills.length === 0 && (
            <div className="sdv-panel py-16 text-center">
              <p className="font-pixel mb-3" style={{ fontSize: '22px', color: 'var(--sdv-cream)' }}>
                暂无数据
              </p>
              <p className="font-dot" style={{ color: 'var(--sdv-dim)', fontSize: '16px' }}>
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
                className="flex flex-col items-center gap-3 p-5 text-center sdv-panel sdv-panel-hover"
                style={{ textDecoration: 'none' }}
              >
                <span style={{ fontSize: '28px' }}>{role.icon}</span>
                <span className="font-pixel leading-snug" style={{ fontSize: '16px', color: 'var(--sdv-cream)' }}>
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
                className="flex items-center gap-3 px-4 py-4 sdv-panel sdv-panel-hover"
                style={{ textDecoration: 'none' }}
              >
                <span style={{ fontSize: '20px' }}>{category.icon}</span>
                <div className="min-w-0">
                  <p className="font-pixel truncate" style={{ fontSize: '15px', color: 'var(--sdv-cream)' }}>
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
