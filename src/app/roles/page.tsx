import Link from 'next/link'
import prisma from '@/lib/db'
import { ROLES } from '@/lib/constants'
import { ensureSeeded } from '@/lib/seed'

export const dynamic = 'force-dynamic'
export const revalidate = 300

async function getRoleStats() {
  await ensureSeeded('[RolesPage]')

  const allSkills = await prisma.skill.findMany({
    where: { isActive: true, isHidden: false },
    select: { roleCategories: true, name: true, slug: true, score: true },
  })

  const counts: Record<string, number> = {}
  const topTools: Record<string, { name: string; slug: string; score: number | null }[]> = {}

  for (const skill of allSkills) {
    for (const role of skill.roleCategories) {
      counts[role] = (counts[role] || 0) + 1
    }
  }

  for (const role of ROLES) {
    topTools[role.id] = allSkills
      .filter(skill => skill.roleCategories.includes(role.id))
      .sort((left, right) => (right.score || 0) - (left.score || 0))
      .slice(0, 3)
  }

  return { counts, topTools }
}

export default async function RolesPage() {
  const { counts, topTools } = await getRoleStats()

  return (
    <div className="container py-10">
      <div className="sdv-panel px-6 py-6 mb-8">
        <p className="font-pixel text-glow-gold" style={{ fontSize: '8px', color: 'var(--sdv-gold)' }}>
          岗位图鉴
        </p>
        <h1 className="font-pixel mt-3" style={{ fontSize: '14px', color: 'var(--sdv-cream)' }}>
          按岗位找工具
        </h1>
        <p className="font-dot mt-2" style={{ fontSize: '17px', color: 'var(--sdv-dim)' }}>
          选择你的职业路线，看看这片农场里最适合你的 AI 装备。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ROLES.map(role => {
          const count = counts[role.id] || 0
          const tools = topTools[role.id] || []

          return (
            <div key={role.id} className="sdv-panel sdv-panel-hover p-5 transition-all duration-150">
              <div className="flex items-start gap-3 mb-4">
                <span style={{ fontSize: '28px' }}>{role.icon}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-pixel" style={{ fontSize: '8px', color: 'var(--sdv-cream)' }}>
                    {role.name}
                  </h2>
                  <p className="font-dot" style={{ fontSize: '15px', color: 'var(--sdv-dim)' }}>
                    {role.nameEn}
                  </p>
                </div>
                <span className="font-pixel" style={{ fontSize: '8px', color: 'var(--sdv-gold)' }}>
                  {count}
                </span>
              </div>

              <p className="font-dot mb-4" style={{ fontSize: '16px', color: 'var(--sdv-dim)', lineHeight: 1.7 }}>
                {role.description}
              </p>

              <div className="space-y-2 mb-4 min-h-[92px]">
                {tools.length > 0 ? (
                  tools.map(tool => (
                    <Link
                      key={tool.slug}
                      href={`/skills/${tool.slug}`}
                      className="flex items-center gap-2 font-dot"
                      style={{ fontSize: '15px', color: 'var(--sdv-warm)' }}
                    >
                      <span style={{ color: 'var(--sdv-teal)' }}>◆</span>
                      <span className="truncate">{tool.name}</span>
                      {tool.score ? (
                        <span className="ml-auto shrink-0" style={{ color: 'var(--sdv-gold)' }}>
                          {tool.score}
                        </span>
                      ) : null}
                    </Link>
                  ))
                ) : (
                  <p className="font-dot" style={{ fontSize: '15px', color: 'var(--sdv-dim)' }}>
                    暂无推荐工具
                  </p>
                )}
              </div>

              <Link href={`/skills?role=${role.id}`} className="sdv-btn w-full">
                {count > 0 ? `查看全部 ${count} 个工具` : '进入岗位页'}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}