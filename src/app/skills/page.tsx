'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react'
import SkillCard from '@/components/skills/SkillCard'
import SkillFilters from '@/components/skills/SkillFilters'
import type { SkillListItem, PaginatedSkills } from '@/types'

const SORT_OPTIONS = [
  { value: 'score', label: '推荐评分' },
  { value: 'stars', label: 'GitHub Stars' },
  { value: 'newest', label: '最新收录' },
  { value: 'votes', label: '热度' },
]

export default function SkillsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [data, setData] = useState<PaginatedSkills | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const fetchSkills = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/skills?${searchParams.toString()}`)
      const json = await res.json()
      setData(json)
    } catch {}
    setLoading(false)
  }, [searchParams])

  useEffect(() => { fetchSkills() }, [fetchSkills])

  function setSearch(q: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (q) params.set('search', q)
    else params.delete('search')
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  function setSortBy(val: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sortBy', val)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  function setPage(p: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(p))
    router.push(`${pathname}?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const searchVal = searchParams.get('search') || ''
  const sortBy = searchParams.get('sortBy') || 'score'
  const page = parseInt(searchParams.get('page') || '1')

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">全部工具</h1>
        <p className="text-sm text-gray-500">
          {data ? `共 ${data.total} 个工具` : '加载中...'}
        </p>
      </div>

      {/* Search + Sort bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="搜索工具名称、功能、场景..."
            defaultValue={searchVal}
            onKeyDown={e => { if (e.key === 'Enter') setSearch((e.target as HTMLInputElement).value) }}
            onBlur={e => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-9 rounded-md border border-gray-700 bg-gray-900 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
          {searchVal && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="h-9 rounded-md border border-gray-700 bg-gray-900 text-sm text-gray-300 px-3 focus:outline-none focus:ring-1 focus:ring-violet-500"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden flex items-center gap-1.5 h-9 px-3 rounded-md border border-gray-700 bg-gray-900 text-sm text-gray-300 hover:bg-gray-800"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters - desktop */}
        <div className="hidden lg:block w-56 shrink-0">
          <SkillFilters />
        </div>

        {/* Mobile filters overlay */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute right-0 top-0 h-full w-72 bg-gray-950 border-l border-gray-800 overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-white">筛选</span>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              <SkillFilters />
            </div>
          </div>
        )}

        {/* Skills grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-52 rounded-xl border border-gray-800 bg-gray-900 animate-pulse" />
              ))}
            </div>
          ) : !data || data.skills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-gray-500 text-lg mb-2">没有找到匹配的工具</p>
              <p className="text-gray-600 text-sm">尝试修改筛选条件或搜索关键词</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {data.skills.map(skill => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-md border border-gray-700 text-sm text-gray-400 disabled:opacity-40 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" /> 上一页
                  </button>

                  <span className="text-sm text-gray-500 px-3">
                    {page} / {data.totalPages}
                  </span>

                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === data.totalPages}
                    className="flex items-center gap-1 px-3 py-2 rounded-md border border-gray-700 text-sm text-gray-400 disabled:opacity-40 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    下一页 <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
