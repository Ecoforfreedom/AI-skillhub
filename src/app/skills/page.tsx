'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react'
import SkillCard from '@/components/skills/SkillCard'
import SkillFilters from '@/components/skills/SkillFilters'
import type { PaginatedSkills } from '@/types'

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
      const response = await fetch(`/api/skills?${searchParams.toString()}`)
      const json = await response.json()
      setData(json)
    } catch {
      setData(null)
    }
    setLoading(false)
  }, [searchParams])

  useEffect(() => {
    fetchSkills()
  }, [fetchSkills])

  function setSearch(query: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (query) params.set('search', query)
    else params.delete('search')

    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  function setSortBy(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sortBy', value)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  function setPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(nextPage))
    router.push(`${pathname}?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const searchValue = searchParams.get('search') || ''
  const sortBy = searchParams.get('sortBy') || 'score'
  const page = parseInt(searchParams.get('page') || '1')

  return (
    <div className="container py-8">
      <div className="mb-6 sdv-panel px-5 py-5">
        <p className="font-pixel text-glow-gold" style={{ fontSize: '8px', color: 'var(--sdv-gold)' }}>
          工具图鉴
        </p>
        <h1 className="font-pixel mt-3" style={{ fontSize: '14px', color: 'var(--sdv-cream)' }}>
          全部工具
        </h1>
        <p className="font-dot mt-2" style={{ fontSize: '17px', color: 'var(--sdv-dim)' }}>
          {data ? `共 ${data.total} 个工具，按岗位和功能慢慢筛。` : '正在整理你的工具背包...'}
        </p>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--sdv-teal)' }} />
          <input
            type="text"
            placeholder="搜索工具名称、功能、场景..."
            defaultValue={searchValue}
            onKeyDown={event => {
              if (event.key === 'Enter') setSearch((event.target as HTMLInputElement).value)
            }}
            onBlur={event => setSearch(event.target.value)}
            className="sdv-input w-full pl-9 pr-10"
          />
          {searchValue ? (
            <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--sdv-dim)' }}>
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <select value={sortBy} onChange={event => setSortBy(event.target.value)} className="sdv-select px-3 min-w-[160px]">
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button type="button" onClick={() => setShowMobileFilters(!showMobileFilters)} className="sdv-btn lg:hidden">
          <SlidersHorizontal className="h-4 w-4" />
          筛选
        </button>
      </div>

      <div className="flex gap-6">
        <div className="hidden lg:block w-64 shrink-0">
          <SkillFilters />
        </div>

        {showMobileFilters ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute right-0 top-0 h-full w-80 overflow-y-auto px-4 py-4" style={{ background: 'var(--sdv-night)', borderLeft: '4px solid var(--sdv-border)' }}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-pixel" style={{ fontSize: '8px', color: 'var(--sdv-gold)' }}>
                  筛选
                </span>
                <button type="button" onClick={() => setShowMobileFilters(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SkillFilters />
            </div>
          </div>
        ) : null}

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="sdv-panel animate-pulse" style={{ height: 240 }} />
              ))}
            </div>
          ) : !data || data.skills.length === 0 ? (
            <div className="sdv-panel py-20 text-center px-6">
              <p className="font-pixel" style={{ fontSize: '10px', color: 'var(--sdv-gold)' }}>
                暂时没有找到匹配的工具
              </p>
              <p className="font-dot mt-3" style={{ fontSize: '17px', color: 'var(--sdv-dim)' }}>
                试试换个搜索词，或者把筛选条件放宽一点。
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {data.skills.map(skill => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>

              {data.totalPages > 1 ? (
                <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
                  <button type="button" onClick={() => setPage(page - 1)} disabled={page === 1} className="sdv-btn disabled:opacity-40">
                    <ChevronLeft className="h-4 w-4" /> 上一页
                  </button>
                  <span className="font-dot px-3" style={{ color: 'var(--sdv-warm)' }}>
                    {page} / {data.totalPages}
                  </span>
                  <button type="button" onClick={() => setPage(page + 1)} disabled={page === data.totalPages} className="sdv-btn disabled:opacity-40">
                    下一页 <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  )
}