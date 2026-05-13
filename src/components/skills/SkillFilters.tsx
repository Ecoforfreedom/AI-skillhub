'use client'

import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORIES, ROLES } from '@/lib/constants'

interface FilterSection {
  title: string
  key: string
  options: { id: string; label: string; icon?: string }[]
}

const FILTER_SECTIONS: FilterSection[] = [
  {
    title: '适用岗位',
    key: 'role',
    options: ROLES.map(role => ({ id: role.id, label: role.name, icon: role.icon })),
  },
  {
    title: '功能分类',
    key: 'category',
    options: CATEGORIES.map(category => ({ id: category.id, label: category.name, icon: category.icon })),
  },
  {
    title: '价格类型',
    key: 'pricing',
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

    params.delete('page')
    params.delete(key)

    if (!current.includes(value)) {
      current.concat(value).forEach(item => params.append(key, item))
    } else {
      current.filter(item => item !== value).forEach(item => params.append(key, item))
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  function clearAll() {
    const params = new URLSearchParams()
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy')

    if (search) params.set('search', search)
    if (sortBy) params.set('sortBy', sortBy)

    router.push(`${pathname}?${params.toString()}`)
  }

  const activeCount = FILTER_SECTIONS.reduce((count, section) => count + getValues(section.key).length, 0)

  return (
    <aside className="w-full space-y-4">
      <div className="sdv-panel px-4 py-3 flex items-center justify-between">
        <span className="font-pixel" style={{ fontSize: '8px', color: 'var(--sdv-gold)' }}>
          筛选面板
        </span>
        {activeCount > 0 ? (
          <button type="button" onClick={clearAll} className="font-dot flex items-center gap-1" style={{ fontSize: '15px', color: 'var(--sdv-teal)' }}>
            <X className="h-3 w-3" /> 清除 ({activeCount})
          </button>
        ) : null}
      </div>

      {FILTER_SECTIONS.map(section => {
        const selected = getValues(section.key)
        const isCollapsed = collapsed[section.key]

        return (
          <div key={section.key} className="sdv-panel overflow-hidden">
            <button
              type="button"
              className="w-full flex items-center justify-between px-4 py-3"
              onClick={() => setCollapsed(current => ({ ...current, [section.key]: !isCollapsed }))}
            >
              <span className="font-pixel" style={{ fontSize: '7px', color: 'var(--sdv-cream)' }}>
                {section.title} {selected.length > 0 ? `(${selected.length})` : ''}
              </span>
              {isCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
            </button>

            {!isCollapsed ? (
              <div className="px-3 pb-3 flex flex-wrap gap-2">
                {section.options.map(option => {
                  const active = selected.includes(option.id)
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleFilter(section.key, option.id)}
                      className={cn('font-dot px-2.5 py-1.5 transition-colors', active ? '' : '')}
                      style={{
                        fontSize: '15px',
                        border: `2px solid ${active ? 'var(--sdv-teal)' : 'var(--sdv-border)'}`,
                        color: active ? 'var(--sdv-teal)' : 'var(--sdv-warm)',
                        background: active ? 'rgba(80,200,160,0.08)' : 'rgba(14,9,24,0.45)',
                      }}
                    >
                      {option.icon ? `${option.icon} ` : ''}
                      {option.label}
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>
        )
      })}

      <div className="sdv-panel px-4 py-3 space-y-2">
        <p className="font-pixel" style={{ fontSize: '7px', color: 'var(--sdv-cream)' }}>
          其他筛选
        </p>
        {[
          { key: 'isOpenSource', value: 'true', label: '仅看开源' },
          { key: 'requiresCoding', value: 'false', label: '无需代码' },
        ].map(filter => {
          const active = searchParams.get(filter.key) === filter.value

          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString())
                params.delete('page')

                if (active) params.delete(filter.key)
                else params.set(filter.key, filter.value)

                router.push(`${pathname}?${params.toString()}`)
              }}
              className="w-full flex items-center gap-2 font-dot px-2 py-1.5"
              style={{
                fontSize: '15px',
                color: active ? 'var(--sdv-teal)' : 'var(--sdv-warm)',
                border: `2px solid ${active ? 'var(--sdv-teal)' : 'var(--sdv-border)'}`,
                background: active ? 'rgba(80,200,160,0.08)' : 'rgba(14,9,24,0.45)',
              }}
            >
              <span className="sdv-slot flex items-center justify-center shrink-0" style={{ width: 20, height: 20, fontSize: 10 }}>
                {active ? '✓' : ''}
              </span>
              {filter.label}
            </button>
          )
        })}
      </div>
    </aside>
  )
}