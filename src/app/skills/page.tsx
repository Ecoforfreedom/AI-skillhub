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
  const total = data?.total || 0

  return (
    <div className="container py-8 space-y-8">
      <div className="sdv-panel px-6 py-7 md:px-8 md:py-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="sdv-chip inline-flex items-center font-dot" style={{ padding: '8px 14px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--sdv-silver)' }}>
              Mission Select
            </div>
            <h1 className="font-pixel mt-5" style={{ fontSize: 'clamp(38px, 5vw, 60px)', color: 'var(--sdv-cream)', lineHeight: 1.02 }}>
              像挑装备一样
              <br />
              选择 AI 工具
            </h1>
            <p className="font-dot mt-4" style={{ fontSize: '17px', color: 'var(--sdv-dim)', lineHeight: 1.85, maxWidth: 720 }}>
              保持原有筛选能力，但把浏览方式做得更像一块游戏任务板。你可以按岗位、功能和分数快速锁定合适工具。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-0 xl:w-[520px]">
            {[
              { label: '背包总数', value: total ? String(total) : '...', hint: '持续清洗更新' },
              { label: '排序规则', value: SORT_OPTIONS.find(option => option.value === sortBy)?.label || '推荐评分', hint: '支持多维排序' },
              { label: '当前关卡', value: String(page), hint: data ? `共 ${data.totalPages} 页` : '正在加载' },
            ].map(item => (
              <div key={item.label} className="sdv-panel px-4 py-4">
                <p className="font-dot" style={{ fontSize: '12px', color: 'var(--sdv-dim)' }}>{item.label}</p>
                <p className="font-pixel mt-2" style={{ fontSize: '24px', color: 'var(--sdv-cream)' }}>{item.value}</p>
                <p className="font-dot mt-2" style={{ fontSize: '12px', color: 'var(--sdv-dim)' }}>{item.hint}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-8 flex-wrap">
          <div className="relative flex-1 min-w-[240px] max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--sdv-teal)' }} />
            <input
              type="text"
              placeholder="搜索工具名称、岗位、功能或使用场景"
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

          <select value={sortBy} onChange={event => setSortBy(event.target.value)} className="sdv-select px-4 min-w-[180px]">
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
              <p className="font-pixel" style={{ fontSize: '16px', color: 'var(--sdv-gold)' }}>
                当前区域没有找到合适装备
              </p>
              <p className="font-dot mt-3" style={{ fontSize: '17px', color: 'var(--sdv-dim)' }}>
                试试更换关键词，或者放宽筛选条件后再看一次结果。
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