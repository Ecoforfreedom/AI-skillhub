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

  const isHome = pathname === '/'

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#FFD600', borderBottom: '3px solid #000' }}>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          className="page-enter"
          style={{
            minHeight: 68,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '10px 4px',
          }}
        >
          <Link href="/" className="flex items-center shrink-0 min-w-0" style={{ paddingInline: 4 }}>
            <span className="flex flex-col min-w-0">
              <span className="font-pixel" style={{ fontSize: 'clamp(20px, 5vw, 26px)', color: '#000', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                AI AGENT ARSENAL
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2 mx-auto min-w-0">
            {NAV_LINKS.map(link => {
              const active = link.href === '/skills'
                ? pathname.startsWith('/skills')
                : pathname.startsWith(link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-dot"
                  style={{
                    padding: '8px 14px',
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    color: active ? '#FFD600' : '#000',
                    background: active ? '#000' : 'transparent',
                    border: '3px solid #000',
                    borderRadius: 4,
                    boxShadow: active ? '3px 3px 0 rgba(0,0,0,0.25)' : 'none',
                    transition: 'transform 100ms ease, box-shadow 100ms ease',
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden xl:block w-[280px] shrink-0 relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#000' }} />
              <input
                type="text"
                placeholder="搜索工具、岗位、场景"
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
                  style={{ color: '#000' }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {showResults && results.length > 0 && (
              <div
                className="absolute top-full mt-2 w-full overflow-hidden sdv-panel"
                style={{ zIndex: 100 }}
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
                      <span className="font-dot shrink-0" style={{ fontSize: '12px', fontWeight: 700, color: '#FF6B00' }}>
                        Lv.{result.score}
                      </span>
                    ) : null}
                  </Link>
                ))}
                <Link
                  href={`/skills?search=${encodeURIComponent(query)}`}
                  onClick={() => setShowResults(false)}
                  className="block px-4 py-3 font-dot text-center"
                  style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', background: '#FFD600', borderTop: '2px solid #000' }}
                >
                  查看全部结果 →
                </Link>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              href={isHome ? '/skills' : '/rankings'}
              className="sdv-btn"
              style={{ minHeight: 42, paddingInline: 18 }}
            >
              {isHome ? '开始探索' : '查看榜单'}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex items-center gap-2 ml-auto md:hidden">
            <button
              type="button"
              className="sdv-btn"
              style={{ minHeight: 40, width: 40, padding: 0 }}
              onClick={() => setShowResults(!showResults)}
            >
              <Search className="h-4 w-4" />
            </button>
            <button type="button" className="sdv-btn" style={{ minHeight: 40, width: 40, padding: 0 }} onClick={() => setOpen(!open)}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {showResults && (
          <div className="lg:hidden mt-2 sdv-panel p-4" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#000' }} />
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
                  style={{ color: '#000' }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {results.length > 0 && (
              <div className="mt-3 overflow-hidden" style={{ border: '3px solid #000', borderRadius: 4, boxShadow: '4px 4px 0 #000' }}>
                {results.map(result => (
                  <Link
                    key={result.id}
                    href={`/skills/${result.slug}`}
                    onClick={() => {
                      setShowResults(false)
                      setQuery('')
                    }}
                    className="flex items-center gap-3 px-4 py-3"
                    style={{ borderBottom: '2px solid #000' }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-pixel truncate" style={{ fontSize: '16px', color: '#000' }}>
                        {result.name}
                      </p>
                      <p className="font-dot truncate" style={{ fontSize: '12px', color: '#555' }}>
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
          <div className="md:hidden mt-0 sdv-panel p-3 flex flex-col gap-2" style={{ borderTop: 'none', borderRadius: '0 0 4px 4px', boxShadow: '5px 5px 0 #000' }}>
            {NAV_LINKS.map(link => {
              const active = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-dot px-4 py-3"
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: active ? '#FFD600' : '#000',
                    background: active ? '#000' : 'transparent',
                    border: '2px solid #000',
                    borderRadius: 4,
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
