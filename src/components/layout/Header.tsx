'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Menu, Search, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/skills', label: '全部工具', icon: '🧰' },
  { href: '/roles', label: '按岗位', icon: '👤' },
  { href: '/categories', label: '按功能', icon: '📦' },
  { href: '/rankings', label: '排行榜', icon: '🏆' },
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
      setShowResults(false)
      return
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`)
        const data = await response.json()
        setResults(data.results || [])
        setShowResults(true)
      } catch {
        setResults([])
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '4px solid var(--sdv-border)',
        boxShadow: '0 4px 0 var(--sdv-sh)',
        background: 'linear-gradient(180deg, var(--sdv-wood2) 0%, var(--sdv-wood) 100%)',
      }}
    >
      <div className="container flex h-16 items-center gap-4" style={{ position: 'relative', zIndex: 1 }}>
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span
            className="sdv-slot flex items-center justify-center"
            style={{ width: 38, height: 38, fontSize: 20 }}
          >
            🌾
          </span>
          <span className="hidden sm:inline font-pixel text-glow-gold" style={{ fontSize: '10px', color: 'var(--sdv-gold)' }}>
            SKILL <span style={{ color: 'var(--sdv-teal)' }}>RADAR</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {NAV_LINKS.map(link => {
            const active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className="font-pixel"
                style={{
                  fontSize: '8px',
                  padding: '8px 10px',
                  color: active ? 'var(--sdv-gold)' : 'var(--sdv-warm)',
                  borderBottom: active ? '3px solid var(--sdv-gold)' : '3px solid transparent',
                  textShadow: active ? '0 0 6px rgba(240,192,48,0.4)' : 'none',
                }}
              >
                {link.icon} {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex-1 max-w-sm ml-auto relative" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--sdv-teal)' }} />
            <input
              type="text"
              placeholder="搜索工具..."
              value={query}
              onChange={event => setQuery(event.target.value)}
              onFocus={() => {
                if (query.trim().length >= 2) setShowResults(true)
              }}
              className="sdv-input w-full pl-9 pr-9 font-dot text-base"
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
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {showResults && results.length > 0 && (
            <div
              className="absolute top-full mt-1 w-full overflow-hidden"
              style={{
                background: 'var(--sdv-wood)',
                border: '3px solid var(--sdv-teal)',
                boxShadow: '3px 3px 0 var(--sdv-sh)',
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
                  className="flex items-center gap-3 px-4 py-2"
                  style={{ borderBottom: '2px solid var(--sdv-sh)' }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-pixel truncate" style={{ fontSize: '8px', color: 'var(--sdv-cream)' }}>
                      {result.name}
                    </p>
                    <p className="font-dot truncate" style={{ fontSize: '15px', color: 'var(--sdv-dim)' }}>
                      {result.oneLiner}
                    </p>
                  </div>
                  {result.score ? (
                    <span className="font-pixel shrink-0" style={{ fontSize: '7px', color: 'var(--sdv-gold)' }}>
                      {scoreToStars(result.score)}
                    </span>
                  ) : null}
                </Link>
              ))}
              <Link
                href={`/skills?search=${encodeURIComponent(query)}`}
                onClick={() => setShowResults(false)}
                className="block px-4 py-2 font-dot text-center"
                style={{ fontSize: '15px', color: 'var(--sdv-teal)' }}
              >
                ▶ 查看全部结果
              </Link>
            </div>
          )}
        </div>

        <button type="button" className="md:hidden p-2" style={{ color: 'var(--sdv-gold)' }} onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 py-3 flex flex-col gap-2" style={{ borderTop: '3px solid var(--sdv-border)', background: 'var(--sdv-wood)' }}>
          {NAV_LINKS.map(link => {
            const active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-pixel px-3 py-2"
                style={{
                  fontSize: '8px',
                  color: active ? 'var(--sdv-gold)' : 'var(--sdv-warm)',
                  borderLeft: `3px solid ${active ? 'var(--sdv-gold)' : 'transparent'}`,
                }}
              >
                {link.icon} {link.label}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}