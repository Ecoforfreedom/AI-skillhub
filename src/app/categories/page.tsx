import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import prisma from '@/lib/db'
import { CATEGORIES } from '@/lib/constants'

export const dynamic = 'force-dynamic'
export const revalidate = 300

async function getCategoryStats() {
  const allSkills = await prisma.skill.findMany({
    where: { isActive: true, isHidden: false },
    select: { functionCategories: true, name: true, slug: true, oneLiner: true, score: true },
  })

  const counts: Record<string, number> = {}
  const topTools: Record<string, any[]> = {}

  for (const skill of allSkills) {
    for (const cat of skill.functionCategories) {
      counts[cat] = (counts[cat] || 0) + 1
    }
  }

  for (const cat of CATEGORIES) {
    topTools[cat.id] = allSkills
      .filter(s => s.functionCategories.includes(cat.id))
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 3)
  }

  return { counts, topTools }
}

export default async function CategoriesPage() {
  const { counts, topTools } = await getCategoryStats()

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">按功能找工具</h1>
        <p className="text-gray-400">选择你当前要做的工作任务，找到最合适的工具</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORIES.map(cat => {
          const count = counts[cat.id] || 0
          const tools = topTools[cat.id] || []

          return (
            <div
              key={cat.id}
              className="group rounded-xl border border-gray-800 bg-gray-900 p-5 hover:border-violet-500/30 hover:bg-gray-900/80 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h2 className="text-sm font-semibold text-white">{cat.name}</h2>
                  <p className="text-xs text-gray-600">{cat.nameEn}</p>
                </div>
                <span className="ml-auto text-sm font-bold text-gray-600">{count}</span>
              </div>

              {tools.length > 0 && (
                <div className="mb-4 space-y-1.5">
                  {tools.map(t => (
                    <Link
                      key={t.slug}
                      href={`/skills/${t.slug}`}
                      className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-700 shrink-0" />
                      <span className="truncate">{t.name}</span>
                    </Link>
                  ))}
                </div>
              )}

              <Link
                href={`/skills?category=${cat.id}`}
                className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors mt-2"
              >
                {count > 0 ? `查看 ${count} 个工具` : '暂无数据'}
                {count > 0 && <ArrowRight className="h-3 w-3" />}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
