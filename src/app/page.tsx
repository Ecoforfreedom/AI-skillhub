import Link from 'next/link'
import prisma from '@/lib/db'
import { ROLES, CATEGORIES } from '@/lib/constants'
import SkillCard from '@/components/skills/SkillCard'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
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
    <section className="page-enter reveal-section" style={{ animationDelay: '120ms' }}>
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <div className="sdv-chip inline-flex items-center font-dot" style={{ marginBottom: 12 }}>
            {icon}
          </div>
          <h2 className="font-pixel" style={{ fontSize: 'clamp(36px, 4.5vw, 58px)', color: '#000' }}>
            {title.toUpperCase()}
          </h2>
          <p className="font-dot mt-2" style={{ fontSize: '14px', color: '#555', maxWidth: 640, lineHeight: 1.7, letterSpacing: '0.02em' }}>
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
      <section className="page-enter" style={{ padding: '64px 0 40px', position: 'relative', overflow: 'hidden' }}>
        <div className="container relative">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] items-stretch">
            <div className="text-left">
              <div className="sdv-chip inline-flex items-center gap-2 font-dot mb-8" style={{ padding: '8px 14px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFD600', display: 'inline-block', border: '2px solid #FFD600' }} />
                LIVE DATA
              </div>

              <h1 className="font-pixel mb-6" style={{ fontSize: 'clamp(64px, 9vw, 120px)', maxWidth: 900, color: '#000', lineHeight: 0.92 }}>
                AI AGENT
                <br />
                <span style={{ color: '#000' }}>
                  ARSENAL
                </span>
              </h1>

              <p className="font-dot mb-10" style={{ fontSize: 'clamp(14px, 1.5vw, 17px)', color: '#333', maxWidth: 640, lineHeight: 1.75, letterSpacing: '0.02em' }}>
                按岗位和功能筛选 AI 工具。用评分和 GitHub stars 排序，帮你快速锁定高信号工具，减少试错时间。
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link href="/skills" className="sdv-btn" style={{ minHeight: 52, paddingInline: 28, fontSize: '15px' }}>
                  BROWSE TOOLS
                </Link>
                <Link
                  href="/rankings"
                  className="sdv-btn"
                  style={{ minHeight: 52, paddingInline: 28, fontSize: '15px', background: '#FFD600', color: '#000', border: '3px solid #000', boxShadow: '4px 4px 0 rgba(0,0,0,0.28)' }}
                >
                  TOP CHARTS
                </Link>
              </div>

              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 max-w-5xl">
                {[
                  { label: 'TOOLS', value: totalSkills, suffix: '', hint: '每天自动补货' },
                  { label: 'NEW THIS WEEK', value: newThisWeek, prefix: '+', hint: '新工具持续入库' },
                  { label: 'ROLES', value: 14, suffix: '', hint: '按岗位分类' },
                  { label: 'CATEGORIES', value: 20, suffix: '', hint: '支持快速筛选' },
                ].map((item, i) => (
                  <div key={item.label} className="sdv-panel px-5 py-4 text-left" style={{ animationDelay: `${i * 80}ms` }}>
                    <p className="font-dot" style={{ fontSize: '11px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
                    <p className="font-pixel mt-2" style={{ fontSize: '38px', color: '#000', lineHeight: 1 }}>
                      <AnimatedCounter value={item.value} prefix={item.prefix} />
                    </p>
                    <p className="font-dot mt-2" style={{ fontSize: '12px', color: '#888', letterSpacing: '0.02em' }}>{item.hint}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-8">
            {ROLES.slice(0, 8).map(role => (
              <Link
                key={role.id}
                href={`/skills?role=${role.id}`}
                className="flex items-center gap-2 font-dot sdv-chip"
                style={{ padding: '7px 12px', fontSize: '12px', textDecoration: 'none', background: '#FFD600', color: '#000', border: '2px solid #000', boxShadow: '2px 2px 0 #000' }}
              >
                <span>{role.icon}</span>
                <span>{role.name}</span>
              </Link>
            ))}
            <Link href="/roles" className="font-dot sdv-chip" style={{ textDecoration: 'none', padding: '7px 12px', fontSize: '12px' }}>
              查看全部岗位 →
            </Link>
              </div>
            </div>

            <div className="sdv-panel h-full p-6 md:p-8" style={{ overflow: 'hidden', background: '#fff' }}>
              <div className="sdv-chip inline-flex items-center font-dot" style={{ padding: '7px 12px' }}>
                FEATURED
              </div>
              <h2 className="font-pixel mt-4" style={{ fontSize: 'clamp(28px, 3vw, 42px)', color: '#000', lineHeight: 1.0 }}>
                TOP PICKS
              </h2>
              <p className="font-dot mt-3" style={{ fontSize: '13px', color: '#555', lineHeight: 1.75, letterSpacing: '0.02em' }}>
                按评分排序的高信号工具，优先上手，减少试错。
              </p>

              <div className="mt-6 space-y-3">
                {featuredSkills.slice(0, 3).map((skill, index) => (
                  <Link
                    key={skill.id}
                    href={`/skills/${skill.slug}`}
                    className="sdv-panel sdv-panel-hover flex items-start gap-4 p-4"
                    style={{ textDecoration: 'none', background: index === 0 ? '#FFD600' : '#fff' }}
                  >
                    <div
                      className="shrink-0 flex items-center justify-center font-pixel"
                      style={{ width: 44, height: 44, fontSize: '18px', background: '#000', color: '#FFD600', border: '3px solid #000', borderRadius: 4 }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-pixel truncate" style={{ fontSize: '20px', color: '#000' }}>
                          {skill.name}
                        </p>
                        <span
                          className="font-dot shrink-0"
                          style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', padding: '3px 7px', background: '#000', color: '#FFD600', border: '2px solid #000', borderRadius: 3 }}
                        >
                          Lv.{skill.score}
                        </span>
                      </div>
                      <p className="font-dot mt-1 line-clamp-2" style={{ fontSize: '12px', color: '#555', lineHeight: 1.65 }}>
                        {skill.oneLiner || skill.chineseSummary || '高信号 AI 工具'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <Link href="/roles" className="sdv-panel sdv-panel-hover p-4" style={{ textDecoration: 'none', background: '#FFD600' }}>
                  <p className="font-dot" style={{ fontSize: '10px', fontWeight: 700, color: '#000', textTransform: 'uppercase', letterSpacing: '0.06em' }}>BY ROLE</p>
                  <p className="font-pixel mt-2" style={{ fontSize: '20px', color: '#000' }}>ROLE MAP</p>
                </Link>
                <Link href="/categories" className="sdv-panel sdv-panel-hover p-4" style={{ textDecoration: 'none' }}>
                  <p className="font-dot" style={{ fontSize: '10px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>BY FUNCTION</p>
                  <p className="font-pixel mt-2" style={{ fontSize: '20px', color: '#000' }}>SKILL TREE</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mt-20 space-y-20">
        <SdvSection icon="BOSS PICKS" title="精选工具" sub="高评分 AI 工具，优先上手，减少试错。" linkHref="/rankings" linkLabel="查看榜单">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredSkills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill as any} index={index} />
            ))}
          </div>
          {featuredSkills.length === 0 && (
            <div className="sdv-panel py-16 text-center">
              <p className="font-pixel mb-3" style={{ fontSize: '28px', color: '#000' }}>
                暂无数据
              </p>
              <p className="font-dot" style={{ color: '#555', fontSize: '14px', letterSpacing: '0.02em' }}>
                等待服务器启动时自动导入初始数据...
              </p>
            </div>
          )}
        </SdvSection>

        <SdvSection icon="ROLE MAP" title="按岗位选" sub="从角色视角出发，找到最适合这个岗位的 AI 工具。" linkHref="/roles" linkLabel="全部岗位">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {ROLES.map(role => (
              <Link
                key={role.id}
                href={`/skills?role=${role.id}`}
                className="flex flex-col items-center gap-3 p-4 text-center sdv-panel sdv-panel-hover"
                style={{ textDecoration: 'none' }}
              >
                <span style={{ fontSize: '28px' }}>{role.icon}</span>
                <span className="font-pixel" style={{ fontSize: '16px', color: '#000', letterSpacing: '0.02em' }}>
                  {role.name}
                </span>
                <span className="font-dot" style={{ fontSize: '12px', color: '#555', letterSpacing: '0.02em' }}>
                  {roleCounts[role.id] || 0} 个
                </span>
              </Link>
            ))}
          </div>
        </SdvSection>

        <SdvSection icon="SKILL TREE" title="按功能筛" sub="围绕写作、自动化、编程等任务筛选对应工具。" linkHref="/categories" linkLabel="全部分类">
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
                  <p className="font-pixel truncate" style={{ fontSize: '16px', color: '#000', letterSpacing: '0.02em' }}>
                    {category.name}
                  </p>
                  <p className="font-dot" style={{ fontSize: '12px', color: '#555', letterSpacing: '0.02em' }}>
                    {catCounts[category.id] || 0} 个
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </SdvSection>

        <SdvSection icon="NEW DROP" title="最新入库" sub="持续更新的新工具列表，保持简洁不堆页面。" linkHref="/skills?sortBy=newest" linkLabel="更多">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestSkills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill as any} compact index={index} />
            ))}
          </div>
        </SdvSection>
      </div>
    </div>
  )
}
