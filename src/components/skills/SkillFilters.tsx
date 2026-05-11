'use client'

import { useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROLES, CATEGORIES } from '@/lib/constants'

interface FilterSection {
  title: string
  key: string
  options: { id: string; label: string; icon?: string }[]
  multi?: boolean
}

const FILTER_SECTIONS: FilterSection[] = [
  {
    title: '适用岗位',
    key: 'role',
    multi: true,
    options: ROLES.map(r => ({ id: r.id, label: r.name, icon: r.icon })),
  },
  {
    title: '功能分类',
    key: 'category',
    multi: true,
    options: CATEGORIES.map(c => ({ id: c.id, label: c.name, icon: c.icon })),
  },
  {
    title: '价格类型',
    key: 'pricing',
    multi: true,
    options: [
      { id: 'free', label: '完全免费' },
      { id: 'freemium', label: 'Freemium' },
      { id: 'open_source', label: '开源' },
      { id: 'paid', label: '付费' },
    ],
  },
  {
    title: '使用难度',
    key: 'difficulty',
    multi: true,
    options: [
      { id: 'beginner', label: '新手友好' },
      { id: 'intermediate', label: '中级' },
      { id: 'advanced', label: '需要技术' },
    ],
  },
]

export default function SkillFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  function getValues(key: string): string[] {
    return searchParams.getAll(key)
  }

  function toggleFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.getAll(key)
    // Remove page when filters change
    params.delete('page')

    if (current.includes(value)) {
      params.delete(key)
      current.filter(v => v !== value).forEach(v => params.append(key, v))
    } else {
      params.append(key, value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  function clearAll() {
    const params = new URLSearchParams()
    const search = searchParams.get('search')
    if (search) params.set('search', search)
    const sortBy = searchParams.get('sortBy')
    if (sortBy) params.set('sortBy', sortBy)
    router.push(`${pathname}?${params.toString()}`)
  }

  const activeCount = FILTER_SECTIONS.reduce(
    (n, s) => n + getValues(s.key).length, 0
  )

  return (
    <aside className="w-full space-y-4">
      {/* Filter header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-300">筛选</span>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300"
          >
            <X className="h-3 w-3" />
            清除 ({activeCount})
          </button>
        )}
      </div>

      {FILTER_SECTIONS.map(section => {
        const selected = getValues(section.key)
        const isCollapsed = collapsed[section.key]
        const showItems = isCollapsed
          ? section.options.slice(0, 5)
          : section.options

        return (
          <div key={section.key} className="border border-gray-800 rounded-lg overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-gray-300 hover:bg-gray-800 transition-colors"
              onClick={() => setCollapsed(c => ({ ...c, [section.key]: !isCollapsed }))}
            >
              <span className="flex items-center gap-1.5">
                {section.title}
                {selected.length > 0 && (
                  <span className="rounded-full bg-violet-600/30 text-violet-300 px-1.5 py-0.5 text-xs">
                    {selected.length}
                  </span>
                )}
              </span>
              {isCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
            </button>

            {!isCollapsed && (
              <div className="px-3 pb-3 pt-1 space-y-1">
                {showItems.map(opt => {
                  const active = selected.includes(opt.id)
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleFilter(section.key, opt.id)}
                      className={cn(
                        'w-full flex items-center gap-2 text-left px-2 py-1.5 rounded-md text-xs transition-colors',
                        active
                          ? 'bg-violet-600/20 text-violet-300'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                      )}
                    >
                      {opt.icon && <span>{opt.icon}</span>}
                      <span className="truncate">{opt.label}</span>
                      {active && <span className="ml-auto text-violet-400">✓</span>}
                    </button>
                  )
                })}
                {section.options.length > 5 && (
                  <button
                    onClick={() => setCollapsed(c => ({ ...c, [`${section.key}_expand`]: !c[`${section.key}_expand`] }))}
                    className="text-xs text-gray-600 hover:text-gray-400 px-2 pt-1"
                  >
                    {collapsed[`${section.key}_expand`]
                      ? `展开全部 ${section.options.length} 项`
                      : '收起'}
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Special filters */}
      <div className="border border-gray-800 rounded-lg px-3 py-3 space-y-2">
        <p className="text-xs font-medium text-gray-300 mb-2">其他筛选</p>
        {[
          { key: 'isOpenSource', value: 'true', label: '仅看开源' },
          { key: 'requiresCoding', value: 'false', label: '无需代码' },
        ].map(f => {
          const active = searchParams.get(f.key) === f.value
          return (
            <button
              key={f.key}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString())
                params.delete('page')
                if (active) {
                  params.delete(f.key)
                } else {
                  params.set(f.key, f.value)
                }
                router.push(`${pathname}?${params.toString()}`)
              }}
              className={cn(
                'w-full flex items-center gap-2 text-left px-2 py-1.5 rounded-md text-xs transition-colors',
                active
                  ? 'bg-violet-600/20 text-violet-300'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              )}
            >
              <span className="w-4 h-4 rounded border flex items-center justify-center shrink-0
                              border-gray-600 bg-gray-800">
                {active && <span className="text-violet-400 text-xs">✓</span>}
              </span>
              {f.label}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
