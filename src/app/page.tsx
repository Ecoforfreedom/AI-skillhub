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
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <div
            className="sdv-chip inline-flex items-center font-dot"
            style={{
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--sdv-silver)',
            }}
          >
            {icon}
          </div>
          <h2 className="font-pixel mt-4" style={{ fontSize: 'clamp(32px, 4vw, 46px)', color: 'var(--sdv-cream)' }}>
            {title}
          </h2>
          <p className="font-dot mt-3" style={{ fontSize: '17px', color: 'var(--sdv-dim)', maxWidth: 720, lineHeight: 1.75 }}>
            {sub}
          </p>
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
      <section className="page-enter" style={{ padding: '72px 0 48px', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-orbit" />
        <div className="container relative">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] items-stretch">
            <div className="text-left">
              <div
                className="inline-flex items-center gap-2 mb-8 font-dot"
                style={{
                  fontSize: '13px',
                  color: 'var(--sdv-silver)',
                  background: 'rgba(8, 18, 34, 0.72)',
                  border: '1px solid rgba(151, 184, 255, 0.16)',
                  padding: '10px 16px',
                  borderRadius: 999,
                  boxShadow: '0 14px 34px rgba(2, 6, 23, 0.2)',
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
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
                AI Tooling Platform
              </div>

              <h1 className="font-pixel mb-6" style={{ fontSize: 'clamp(54px, 7vw, 84px)', maxWidth: 860, color: 'var(--sdv-cream)', lineHeight: 0.96 }}>
                为团队建立
                <br />
                <span className="text-glow-teal" style={{ color: 'var(--sdv-silver)' }}>
                  可执行的 AI 工具栈
                </span>
              </h1>

              <p className="font-dot mb-10" style={{ fontSize: 'clamp(17px, 2vw, 20px)', color: 'var(--sdv-dim)', maxWidth: 720, lineHeight: 1.85 }}>
                AI Skill Radar 以岗位、功能和信号质量为统一视角，帮助团队用更像产品决策的方式评估工具、比较方案，并更快形成真正可落地的工作流组合。
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  href="/skills"
                  className="sdv-btn"
                  style={{
                    minHeight: 56,
                    paddingInline: 24,
                    background: 'linear-gradient(180deg, rgba(244, 248, 255, 0.98) 0%, rgba(215, 226, 255, 0.94) 100%)',
                    color: '#08111f',
                    boxShadow: '0 24px 60px rgba(72, 118, 255, 0.22)',
                  }}
                >
                  浏览全部工具
                </Link>
                <Link
                  href="/rankings"
                  className="sdv-btn"
                  style={{
                    minHeight: 56,
                    paddingInline: 24,
                    background: 'rgba(9, 18, 34, 0.28)',
                    color: 'var(--sdv-silver)',
                  }}
                >
                  查看高信号榜单
                </Link>
              </div>

              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 max-w-5xl">
                {[
                  { label: '已收录工具', value: formatNumber(totalSkills), hint: '每日自动更新' },
                  { label: '本周新增', value: `+${newThisWeek}`, hint: '持续抓取高分来源' },
                  { label: '覆盖岗位', value: '14', hint: '按团队角色组织' },
                  { label: '功能维度', value: '20', hint: '支持场景化筛选' },
                ].map(item => (
                  <div key={item.label} className="sdv-panel px-5 py-5 text-left">
                    <p className="font-dot" style={{ fontSize: '13px', color: 'var(--sdv-dim)' }}>{item.label}</p>
                    <p className="font-pixel mt-3" style={{ fontSize: '32px', color: 'var(--sdv-cream)' }}>{item.value}</p>
                    <p className="font-dot mt-2" style={{ fontSize: '13px', color: 'var(--sdv-dim)' }}>{item.hint}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mt-8">
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

            <div className="sdv-panel h-full p-6 md:p-8" style={{ overflow: 'hidden' }}>
              <div className="sdv-chip inline-flex items-center font-dot" style={{ padding: '8px 14px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--sdv-silver)' }}>
                Weekly Signal
              </div>
              <h2 className="font-pixel mt-5" style={{ fontSize: 'clamp(30px, 3vw, 40px)', color: 'var(--sdv-cream)', lineHeight: 1.05 }}>
                当前最值得进入团队工作流的工具
              </h2>
              <p className="font-dot mt-4" style={{ fontSize: '16px', color: 'var(--sdv-dim)', lineHeight: 1.8 }}>
                从最新抓取和已验证数据中挑出高分候选，让你先看值得投入试用、培训和集成的那一层。
              </p>

              <div className="mt-8 space-y-3">
                {featuredSkills.slice(0, 3).map((skill, index) => (
                  <Link
                    key={skill.id}
                    href={`/skills/${skill.slug}`}
                    className="sdv-panel sdv-panel-hover flex items-start gap-4 p-4"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="sdv-slot shrink-0 flex items-center justify-center" style={{ width: 48, height: 48, fontSize: 16 }}>
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-pixel truncate" style={{ fontSize: '20px', color: 'var(--sdv-cream)' }}>
                          {skill.name}
                        </p>
                        <span className="font-dot shrink-0" style={{ fontSize: '13px', color: 'var(--sdv-teal)', fontWeight: 700 }}>
                          {skill.score}分
                        </span>
                      </div>
                      <p className="font-dot mt-2 line-clamp-2" style={{ fontSize: '14px', color: 'var(--sdv-dim)', lineHeight: 1.75 }}>
                        {skill.oneLiner || skill.chineseSummary || '高信号 AI 工具候选'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <Link href="/roles" className="sdv-panel sdv-panel-hover p-4" style={{ textDecoration: 'none' }}>
                  <p className="font-dot" style={{ fontSize: '12px', color: 'var(--sdv-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>By Role</p>
                  <p className="font-pixel mt-2" style={{ fontSize: '20px', color: 'var(--sdv-cream)' }}>岗位导航</p>
                </Link>
                <Link href="/categories" className="sdv-panel sdv-panel-hover p-4" style={{ textDecoration: 'none' }}>
                  <p className="font-dot" style={{ fontSize: '12px', color: 'var(--sdv-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>By Function</p>
                  <p className="font-pixel mt-2" style={{ fontSize: '20px', color: 'var(--sdv-cream)' }}>功能分层</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mt-20 space-y-20">
        <SdvSection icon="High Signal" title="精选高信号工具" sub="优先展示评分、口碑和落地价值更高的候选，让你先看值得进入团队工具栈的那一层。" linkHref="/rankings" linkLabel="查看榜单">
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

        <SdvSection icon="By Role" title="按岗位理解工具栈" sub="从团队角色出发浏览工具，更接近真实的采购、培训和落地路径。" linkHref="/roles" linkLabel="全部岗位">
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

        <SdvSection icon="By Function" title="按功能筛选方案" sub="围绕写作、研究、自动化、会议等关键任务，快速收敛到具体可用的工具类别。" linkHref="/categories" linkLabel="全部分类">
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

        <SdvSection icon="Recently Added" title="最新收录" sub="持续抓取和清洗新的 AI 产品与开源项目，让目录保持新鲜而不过载。" linkHref="/skills?sortBy=newest" linkLabel="更多">
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
