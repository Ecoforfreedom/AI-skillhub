'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function TrafficTracker() {
  const pathname = usePathname()
  const lastTracked = useRef('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) return

    const path = `${pathname}${window.location.search || ''}`
    if (lastTracked.current === path) return
    lastTracked.current = path

    const payload = JSON.stringify({
      path,
      referrer: document.referrer || null,
    })

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' })
      navigator.sendBeacon('/api/analytics/track', blob)
      return
    }

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {})
  }, [pathname])

  return null
}
