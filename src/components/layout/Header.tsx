'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Search, Menu, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/skills',     label: '全部工具' },
  { href: '/roles',      label: '按岗位' },
  { href: '/categories', label: '按功能' },
  { href: '/rankings',   label: '榜单' },
]

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (query.length < 2) { setResults([]); setShowResults(false); return }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`)
        const data = await res.json()
        setResults(data.results || [])
        setShowResults(true)
      } catch {}
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm">
      <div className="container flex h-16 items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-white shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="hidden sm:inline text-sm">Work Skill Radar</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-1.5 text-sm rounded-md transition-colors',
                pathname.startsWith(link.href)
                  ? 'bg-violet-600/20 text-violet-300'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-md ml-auto relative" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索工具、岗位、功能..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setShowResults(true)}
              className="w-full h-9 pl-9 pr-4 rounded-md border border-gray-700 bg-gray-900 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>
          {showResults && results.length > 0 && (
            <div className="absolute top-full mt-1 w-full rounded-md border border-gray-700 bg-gray-900 shadow-xl z-50 overflow-hidden">
              {results.map(r => (
                <Link
                  key={r.id}
                  href={`/skills/${r.slug}`}
                  onClick={() => { setShowResults(false); setQuery('') }}
                  className="flex items-start gap-2 px-4 py-2.5 hover:bg-gray-800 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{r.name}</p>
                    <p className="text-xs text-gray-400 truncate">{r.oneLiner}</p>
                  </div>
                  {r.score && (
                    <span className="ml-auto shrink-0 text-xs text-violet-400">{r.score}分</span>
                  )}
                </Link>
              ))}
              <Link
                href={`/skills?search=${encodeURIComponent(query)}`}
                onClick={() => setShowResults(false)}
                className="block px-4 py-2 text-xs text-center text-violet-400 hover:bg-gray-800 border-t border-gray-700"
              >
                查看全部结果 →
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 text-gray-400 hover:text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950 px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                'px-3 py-2 text-sm rounded-md transition-colors',
                pathname.startsWith(link.href)
                  ? 'bg-violet-600/20 text-violet-300'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
