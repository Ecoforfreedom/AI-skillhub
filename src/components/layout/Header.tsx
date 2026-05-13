'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, Search, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/skills', label: '全部工具' },
  { href: '/roles', label: '按岗位' },
  { href: '/categories', label: '按功能' },
  { href: '/rankings', label: '排行榜' },
]

function scoreToStars(score: number): string {
  if (score >= 90) return '★★★★★'
  if (score >= 80) return '★★★★'
  if (score >= 70) return '★★★'
  if (score >= 60) return '★★'
  return '★'
}

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`)
        const data = await response.json()
        setResults(data.results || [])
      } catch {
        setResults([])
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, paddingTop: 18 }}>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          className="page-enter"
          style={{
            minHeight: 78,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: '14px 18px',
            borderRadius: 999,
            background: 'rgba(7, 15, 28, 0.74)',
            border: '1px solid rgba(151, 184, 255, 0.14)',
            boxShadow: '0 24px 80px rgba(2, 6, 23, 0.34)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
          }}
        >
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <span className="sdv-slot flex items-center justify-center" style={{ width: 42, height: 42, position: 'relative' }}>
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, var(--sdv-teal), var(--sdv-blue))',
                  boxShadow: '0 0 18px rgba(124, 230, 255, 0.42)',
                }}
              />
            </span>
            <span className="hidden sm:flex flex-col">
              <span className="font-pixel" style={{ fontSize: '18px', color: 'var(--sdv-cream)' }}>
                AI Skill Radar
              </span>
              <span className="font-dot" style={{ fontSize: '12px', color: 'var(--sdv-dim)' }}>
                Curated tooling intelligence for modern teams
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2 ml-3">
            {NAV_LINKS.map(link => {
              const active = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-dot"
                  style={{
                    position: 'relative',
                    padding: '12px 16px',
                    fontSize: '16px',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    color: active ? 'var(--sdv-cream)' : 'var(--sdv-dim)',
                    transition: 'color 220ms ease, transform 220ms ease',
                  }}
                >
                  <span>{link.label}</span>
                  <span
                    style={{
                      position: 'absolute',
                      left: 16,
                      right: 16,
                      bottom: 6,
                      height: 2,
                      borderRadius: 999,
                      background: active ? 'linear-gradient(90deg, var(--sdv-teal), var(--sdv-blue))' : 'transparent',
                      boxShadow: active ? '0 0 16px rgba(124, 230, 255, 0.35)' : 'none',
                    }}
                  />
                </Link>
              )
            })}
          </nav>

          <div className="hidden lg:block flex-1 max-w-md ml-auto relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--sdv-dim)' }} />
              <input
                type="text"
                placeholder="搜索工具、岗位、场景..."
                value={query}
                onChange={event => setQuery(event.target.value)}
                onFocus={() => {
                  if (query.trim().length >= 2) setShowResults(true)
                }}
                className="sdv-input w-full pl-11 pr-10 font-dot text-sm"
                style={{ fontSize: '15px' }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setResults([])
                    setShowResults(false)
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--sdv-dim)' }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {showResults && results.length > 0 && (
              <div
                className="absolute top-full mt-3 w-full overflow-hidden sdv-panel"
                style={{
                  borderRadius: 24,
                  borderColor: 'rgba(124, 230, 255, 0.24)',
                }}
              >
                {results.map(result => (
                  <Link
                    key={result.id}
                    href={`/skills/${result.slug}`}
                    onClick={() => {
                      setShowResults(false)
                      setQuery('')
                    }}
                    className="flex items-center gap-3 px-4 py-3"
                    style={{ borderBottom: '1px solid rgba(151, 184, 255, 0.08)' }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-pixel truncate" style={{ fontSize: '14px', color: 'var(--sdv-cream)' }}>
                        {result.name}
                      </p>
                      <p className="font-dot truncate" style={{ fontSize: '14px', color: 'var(--sdv-dim)' }}>
                        {result.oneLiner}
                      </p>
                    </div>
                    {result.score ? (
                      <span className="font-dot shrink-0" style={{ fontSize: '13px', color: 'var(--sdv-teal)' }}>
                        {scoreToStars(result.score)}
                      </span>
                    ) : null}
                  </Link>
                ))}
                <Link
                  href={`/skills?search=${encodeURIComponent(query)}`}
                  onClick={() => setShowResults(false)}
                  className="block px-4 py-3 font-dot text-center"
                  style={{ fontSize: '14px', color: 'var(--sdv-teal)' }}
                >
                  查看全部结果
                </Link>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3 ml-auto lg:ml-0">
            <Link
              href="/skills"
              className="sdv-btn"
              style={{
                background: 'linear-gradient(180deg, rgba(244, 248, 255, 0.96) 0%, rgba(212, 224, 255, 0.92) 100%)',
                color: '#09111f',
              }}
            >
              开始探索
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex items-center gap-2 ml-auto md:hidden">
            <button
              type="button"
              className="sdv-btn"
              style={{ minHeight: 42, width: 42, padding: 0 }}
              onClick={() => setShowResults(!showResults)}
            >
              <Search className="h-4 w-4" />
            </button>
            <button type="button" className="sdv-btn" style={{ minHeight: 42, width: 42, padding: 0 }} onClick={() => setOpen(!open)}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {showResults && (
          <div className="lg:hidden mt-3 sdv-panel p-4" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--sdv-dim)' }} />
              <input
                type="text"
                placeholder="搜索工具、岗位、场景..."
                value={query}
                onChange={event => setQuery(event.target.value)}
                className="sdv-input w-full pl-11 pr-10 font-dot text-sm"
                style={{ fontSize: '15px' }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setResults([])
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--sdv-dim)' }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {results.length > 0 && (
              <div className="mt-3 overflow-hidden" style={{ borderRadius: 20, border: '1px solid rgba(151, 184, 255, 0.12)' }}>
                {results.map(result => (
                  <Link
                    key={result.id}
                    href={`/skills/${result.slug}`}
                    onClick={() => {
                      setShowResults(false)
                      setQuery('')
                    }}
                    className="flex items-center gap-3 px-4 py-3"
                    style={{ borderBottom: '1px solid rgba(151, 184, 255, 0.08)' }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-pixel truncate" style={{ fontSize: '14px', color: 'var(--sdv-cream)' }}>
                        {result.name}
                      </p>
                      <p className="font-dot truncate" style={{ fontSize: '14px', color: 'var(--sdv-dim)' }}>
                        {result.oneLiner}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {open && (
          <div className="md:hidden mt-3 sdv-panel p-3 flex flex-col gap-2">
            {NAV_LINKS.map(link => {
              const active = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-dot px-4 py-3"
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: active ? 'var(--sdv-cream)' : 'var(--sdv-dim)',
                    borderRadius: 18,
                    background: active ? 'rgba(124, 230, 255, 0.08)' : 'transparent',
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link href="/skills" className="sdv-btn mt-2" onClick={() => setOpen(false)}>
              开始探索
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
