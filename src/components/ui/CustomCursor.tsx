'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Skip on touch-only devices
    if (typeof window === 'undefined') return
    if (window.matchMedia('(hover: none)').matches) return

    // Hide native cursor
    document.documentElement.classList.add('custom-cursor-active')

    let mx = -200, my = -200
    let rx = -200, ry = -200
    let isHover = false
    let isFormControl = false
    let raf: number

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx - 5}px, ${my - 5}px)`
      }
      const target = e.target as HTMLElement
      isFormControl = !!target?.closest('input, select, textarea')
      isHover = !!target?.closest('a, button, [role="button"]') || isFormControl
    }

    const loop = () => {
      rx += (mx - rx) * 0.14
      ry += (my - ry) * 0.14
      if (dotRef.current) {
        dotRef.current.style.opacity = isFormControl ? '0' : '1'
      }
      if (ringRef.current) {
        const size = isHover ? 48 : 36
        ringRef.current.style.transform = `translate(${rx - size / 2}px, ${ry - size / 2}px)`
        ringRef.current.style.width = size + 'px'
        ringRef.current.style.height = size + 'px'
        ringRef.current.style.borderColor = isHover ? '#FFD600' : '#000'
        ringRef.current.style.borderWidth = isHover ? '3px' : '2px'
        ringRef.current.style.opacity = isFormControl ? '0' : '1'
      }
      raf = requestAnimationFrame(loop)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [])

  return (
    <>
      {/* Dot — snaps to cursor */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 10, height: 10,
          background: '#FFD600',
          border: '2px solid #000',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
          transition: 'opacity 0.12s ease',
        }}
      />
      {/* Ring — lags behind */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 36, height: 36,
          border: '2px solid #000',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99998,
          willChange: 'transform',
          transition: 'width 0.15s ease, height 0.15s ease, border-color 0.15s ease, border-width 0.15s ease, opacity 0.12s ease',
        }}
      />
    </>
  )
}
