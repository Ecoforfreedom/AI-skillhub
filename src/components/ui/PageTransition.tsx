'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const EXIT_MS = 280
const ENTER_MS = 420

export default function PageTransition() {
  const router = useRouter()
  const pathname = usePathname()
  const [phase, setPhase] = useState<'idle' | 'exiting' | 'entering'>('idle')
  const lastPathname = useRef(pathname)
  const timers = useRef<number[]>([])

  function clearTimers() {
    timers.current.forEach(timer => window.clearTimeout(timer))
    timers.current = []
  }

  function schedule(callback: () => void, delay: number) {
    const timer = window.setTimeout(callback, delay)
    timers.current.push(timer)
  }

  useEffect(() => {
    return () => clearTimers()
  }, [])

  useEffect(() => {
    if (lastPathname.current !== pathname) {
      lastPathname.current = pathname
      setPhase('entering')
      clearTimers()
      schedule(() => setPhase('idle'), ENTER_MS)
    }
  }, [pathname])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const target = event.target as HTMLElement | null
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return

      const rawHref = anchor.getAttribute('href')
      if (!rawHref || rawHref.startsWith('#')) return
      if (/^(mailto:|tel:|javascript:)/i.test(rawHref)) return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (`${url.pathname}${url.search}${url.hash}` === `${window.location.pathname}${window.location.search}${window.location.hash}`) return

      event.preventDefault()
      clearTimers()
      setPhase('exiting')

      schedule(() => {
        router.push(`${url.pathname}${url.search}${url.hash}`)
        schedule(() => setPhase('entering'), 90)
        schedule(() => setPhase('idle'), 90 + ENTER_MS)
      }, EXIT_MS)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [router])

  const active = phase !== 'idle'
  const exiting = phase === 'exiting'

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: active ? 'auto' : 'none',
        zIndex: 99997,
        opacity: active ? 1 : 0,
        transition: 'opacity 90ms linear',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#FFD600',
          borderTop: '6px solid #000',
          borderBottom: '6px solid #000',
          transform: exiting ? 'translateX(0)' : 'translateX(100%)',
          transition: `transform ${exiting ? EXIT_MS : ENTER_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#000',
          clipPath: 'polygon(0 0, 78% 0, 58% 100%, 0 100%)',
          transform: exiting ? 'translateX(0)' : 'translateX(-110%)',
          transition: `transform ${exiting ? EXIT_MS : ENTER_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 'clamp(24px, 7vw, 96px)',
          top: '50%',
          transform: exiting ? 'translateY(-50%) translateX(0)' : 'translateY(-50%) translateX(-40px)',
          opacity: exiting ? 1 : 0,
          transition: 'opacity 160ms ease, transform 220ms ease',
          color: '#FFD600',
          fontFamily: "'Bebas Neue', Impact, 'Microsoft YaHei', '微软雅黑', sans-serif",
          fontSize: 'clamp(48px, 9vw, 120px)',
          lineHeight: 0.9,
          letterSpacing: '0.04em',
        }}
      >
        LOADING
      </div>
      <div
        style={{
          position: 'absolute',
          right: 'clamp(18px, 5vw, 72px)',
          bottom: 'clamp(18px, 5vw, 64px)',
          color: exiting ? '#000' : '#FFD600',
          background: exiting ? '#FFD600' : '#000',
          border: '3px solid #000',
          boxShadow: '5px 5px 0 #000',
          padding: '8px 14px',
          fontFamily: "'IBM Plex Mono', 'Microsoft YaHei', '微软雅黑', monospace",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.08em',
        }}
      >
        AI AGENT ARSENAL
      </div>
    </div>
  )
}
