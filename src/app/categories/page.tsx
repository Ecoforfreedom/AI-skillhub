import Link from 'next/link'
import prisma from '@/lib/db'
import { CATEGORIES } from '@/lib/constants'
import { ensureSeeded } from '@/lib/seed'

export const dynamic = 'force-dynamic'
export const revalidate = 300

async function getCategoryStats() {
  await ensureSeeded('[CategoriesPage]')

  const allSkills = await prisma.skill.findMany({
    where: { isActive: true, isHidden: false },
    select: { functionCategories: true, name: true, slug: true, score: true },
  })

  const counts: Record<string, number> = {}
  const topTools: Record<string, { name: string; slug: string }[]> = {}

  for (const skill of allSkills) {
    for (const category of skill.functionCategories) {
      counts[category] = (counts[category] || 0) + 1
    }
  }

  for (const category of CATEGORIES) {
    topTools[category.id] = allSkills
      .filter(skill => skill.functionCategories.includes(category.id))
      .sort((left, right) => (right.score || 0) - (left.score || 0))
      .slice(0, 3)
      .map(skill => ({ name: skill.name, slug: skill.slug }))
  }

  return { counts, topTools }
}

export default async function CategoriesPage() {
  const { counts, topTools } = await getCategoryStats()

  return (
    <div className="container py-10">
      <div className="sdv-panel px-6 py-6 mb-8">
        <p className="font-pixel text-glow-gold" style={{ fontSize: '8px', color: 'var(--sdv-gold)' }}>
          功能仓库
        </p>
        <h1 className="font-pixel mt-3" style={{ fontSize: '14px', color: 'var(--sdv-cream)' }}>
          按功能找工具
        </h1>
        <p className="font-dot mt-2" style={{ fontSize: '17px', color: 'var(--sdv-dim)' }}>
          按你手头的任务来挑工具，像从仓库里拿出最顺手的农具一样。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORIES.map(category => {
          const count = counts[category.id] || 0
          const tools = topTools[category.id] || []

          return (
            <div key={category.id} className="sdv-panel sdv-panel-hover p-5 transition-all duration-150">
              <div className="flex items-center gap-3 mb-3">
                <span style={{ fontSize: '24px' }}>{category.icon}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-pixel" style={{ fontSize: '7px', color: 'var(--sdv-cream)' }}>
                    {category.name}
                  </h2>
                  <p className="font-dot truncate" style={{ fontSize: '14px', color: 'var(--sdv-dim)' }}>
                    {category.nameEn}
                  </p>
                </div>
                <span className="font-pixel" style={{ fontSize: '8px', color: 'var(--sdv-gold)' }}>
                  {count}
                </span>
              </div>

              <div className="space-y-2 mb-4 min-h-[78px]">
                {tools.length > 0 ? (
                  tools.map(tool => (
                    <Link key={tool.slug} href={`/skills/${tool.slug}`} className="flex items-center gap-2 font-dot" style={{ fontSize: '15px', color: 'var(--sdv-warm)' }}>
                      <span style={{ color: 'var(--sdv-teal)' }}>◆</span>
                      <span className="truncate">{tool.name}</span>
                    </Link>
                  ))
                ) : (
                  <p className="font-dot" style={{ fontSize: '15px', color: 'var(--sdv-dim)' }}>
                    暂无推荐工具
                  </p>
                )}
              </div>

              <Link href={`/skills?category=${category.id}`} className="sdv-btn w-full">
                {count > 0 ? `查看 ${count} 个工具` : '进入分类页'}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}