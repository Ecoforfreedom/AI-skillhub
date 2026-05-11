import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import prisma from '@/lib/db'
import { ROLES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const revalidate = 300

async function getRoleStats() {
  const allSkills = await prisma.skill.findMany({
    where: { isActive: true, isHidden: false },
    select: { roleCategories: true, name: true, slug: true, oneLiner: true, score: true },
  })

  const counts: Record<string, number> = {}
  const topTools: Record<string, any[]> = {}

  for (const skill of allSkills) {
    for (const role of skill.roleCategories) {
      counts[role] = (counts[role] || 0) + 1
    }
  }

  for (const role of ROLES) {
    const roleSkills = allSkills
      .filter(s => s.roleCategories.includes(role.id))
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 3)
    topTools[role.id] = roleSkills
  }

  return { counts, topTools }
}

export default async function RolesPage() {
  const { counts, topTools } = await getRoleStats()

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">按岗位找工具</h1>
        <p className="text-gray-400">选择你的岗位，发现最适合你工作场景的 AI 工具和自动化方案</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ROLES.map(role => {
          const count = counts[role.id] || 0
          const tools = topTools[role.id] || []

          return (
            <div
              key={role.id}
              className="group rounded-xl border border-gray-800 bg-gray-900 p-6 hover:border-violet-500/30 hover:bg-gray-900/80 transition-all"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">{role.icon}</span>
                <div>
                  <h2 className="font-semibold text-white">{role.name}</h2>
                  <p className="text-xs text-gray-500">{role.nameEn}</p>
                </div>
                <span className="ml-auto text-sm font-bold text-gray-500">{count}</span>
              </div>

              <p className="text-xs text-gray-500 mb-4 leading-relaxed">{role.description}</p>

              {tools.length > 0 && (
                <div className="mb-4 space-y-2">
                  {tools.map(t => (
                    <Link
                      key={t.slug}
                      href={`/skills/${t.slug}`}
                      className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors group/tool"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover/tool:bg-violet-400 transition-colors shrink-0" />
                      <span className="truncate">{t.name}</span>
                      {t.score && (
                        <span className="ml-auto shrink-0 text-violet-500">{t.score}</span>
                      )}
                    </Link>
                  ))}
                </div>
              )}

              <Link
                href={`/skills?role=${role.id}`}
                className={cn(
                  'flex items-center gap-1 text-xs font-medium transition-colors',
                  count > 0 ? 'text-violet-400 hover:text-violet-300' : 'text-gray-600 cursor-default'
                )}
              >
                {count > 0 ? `查看全部 ${count} 个工具` : '暂无数据'}
                {count > 0 && <ArrowRight className="h-3 w-3" />}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
