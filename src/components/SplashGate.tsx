'use client'

import { useEffect, useRef, useState } from 'react'

const BOOT_LINES = [
  '> INITIALIZING AI AGENT ARSENAL v2.0...',
  '> SCANNING 200+ AI TOOLS...',
  '> LOADING ROLE PROFILES...',
  '> CALIBRATING SIGNAL SCORES...',
  '> SYSTEM READY. LAUNCH CONFIRMED.',
]

const FONT_MONO = "'IBM Plex Mono', 'Microsoft YaHei', '微软雅黑', monospace"
const FONT_HEAD = "'Bebas Neue', Impact, 'Microsoft YaHei', '微软雅黑', sans-serif"

export default function SplashGate() {
  const [phase, setPhase] = useState<'idle' | 'boot' | 'main' | 'exit' | 'done'>('idle')
  const [visibleLines, setVisibleLines] = useState(0)
  const [glitch, setGlitch] = useState(false)
  const [enterHover, setEnterHover] = useState(false)
  const scanRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem('splash-seen')) {
      setPhase('done')
      return
    }

    setPhase('boot')

    // Reveal boot lines one by one
    BOOT_LINES.forEach((_, i) => {
      setTimeout(() => setVisibleLines(i + 1), 300 + i * 420)
    })

    // Switch to main splash after boot
    const mainDelay = 300 + BOOT_LINES.length * 420 + 300
    const timer = setTimeout(() => setPhase('main'), mainDelay)
    return () => clearTimeout(timer)
  }, [])

  // Periodic glitch on title
  useEffect(() => {
    if (phase !== 'main') return
    const interval = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 220)
    }, 3200)
    return () => clearInterval(interval)
  }, [phase])

  function dismiss() {
    setPhase('exit')
    setTimeout(() => {
      setPhase('done')
      sessionStorage.setItem('splash-seen', '1')
    }, 550)
  }

  if (phase === 'idle' || phase === 'done') return null

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#000',
        cursor: 'pointer',
        opacity: phase === 'exit' ? 0 : 1,
        transition: 'opacity 0.55s ease',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* CRT scanlines overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.018) 2px, rgba(255,255,255,0.018) 4px)',
      }} />

      {/* Moving scan beam */}
      <div
        ref={scanRef}
        style={{
          position: 'absolute', left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,214,0,0.0) 10%, rgba(255,214,0,0.7) 50%, rgba(255,214,0,0.0) 90%, transparent 100%)',
          pointerEvents: 'none', zIndex: 3,
          animation: 'scanBeam 2.8s linear infinite',
        }}
      />

      {/* Corner brackets */}
      {[
        { top: 28, left: 28, borderTop: '3px solid #FFD600', borderLeft: '3px solid #FFD600' },
        { top: 28, right: 28, borderTop: '3px solid #FFD600', borderRight: '3px solid #FFD600' },
        { bottom: 28, left: 28, borderBottom: '3px solid #FFD600', borderLeft: '3px solid #FFD600' },
        { bottom: 28, right: 28, borderBottom: '3px solid #FFD600', borderRight: '3px solid #FFD600' },
      ].map((style, i) => (
        <div key={i} style={{ position: 'absolute', width: 44, height: 44, pointerEvents: 'none', zIndex: 4, ...style }} />
      ))}

      {/* Crosshair lines */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', width: 1, height: '100%', background: 'rgba(255,214,0,0.07)' }} />
        <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: 1, background: 'rgba(255,214,0,0.07)' }} />
      </div>

      {/* ── BOOT PHASE ── */}
      {(phase === 'boot') && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(40px, 8vw, 120px)',
          zIndex: 10,
        }}>
          <p style={{ fontFamily: FONT_MONO, fontSize: '11px', color: '#333', letterSpacing: '0.1em', marginBottom: 24 }}>
            SYSTEM BOOT — AI AGENT ARSENAL
          </p>
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <p
              key={i}
              style={{
                fontFamily: FONT_MONO,
                fontSize: 'clamp(12px, 1.4vw, 15px)',
                color: i === visibleLines - 1 ? '#FFD600' : '#3a3a3a',
                margin: '5px 0',
                letterSpacing: '0.06em',
                animation: 'bootLine 0.3s ease both',
              }}
            >
              {line}
              {i === visibleLines - 1 && (
                <span style={{ animation: 'blink 0.8s step-end infinite', marginLeft: 2 }}>█</span>
              )}
            </p>
          ))}
        </div>
      )}

      {/* ── MAIN PHASE ── */}
      {(phase === 'main' || phase === 'exit') && (
        <div
          style={{
            position: 'absolute', inset: 0, display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 10,
            animation: 'revealUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
          }}
        >
          {/* Year badge */}
          <div style={{
            fontFamily: FONT_MONO, fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            background: '#FFD600', color: '#000',
            padding: '5px 16px', marginBottom: 36,
          }}>
            AI AGENT GEAR LIBRARY · 2026
          </div>

          {/* Main glitch title */}
          <h1
            style={{
              fontFamily: FONT_HEAD,
              fontSize: 'clamp(72px, 14vw, 200px)',
              color: '#FFD600',
              lineHeight: 0.88,
              letterSpacing: '0.04em',
              textAlign: 'center',
              margin: 0,
              animation: glitch ? 'glitchText 0.22s ease both' : undefined,
            }}
          >
            AI AGENT
            <br />
            ARSENAL
          </h1>

          {/* Tagline */}
          <p style={{
            fontFamily: FONT_MONO,
            fontSize: 'clamp(12px, 1.4vw, 15px)',
            color: '#666',
            marginTop: 28,
            letterSpacing: '0.05em',
            textAlign: 'center',
            maxWidth: 500,
            lineHeight: 1.9,
            padding: '0 24px',
          }}>
            发现每个岗位能用的 AI 工具
          </p>

          {/* Enter button */}
          <button
            onClick={e => { e.stopPropagation(); dismiss() }}
            onMouseEnter={() => setEnterHover(true)}
            onMouseLeave={() => setEnterHover(false)}
            style={{
              marginTop: 52,
              background: '#FFD600',
              color: '#000',
              border: '3px solid #FFD600',
              padding: '18px 60px',
              fontFamily: FONT_MONO,
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transform: enterHover ? 'translate(-3px, -3px)' : 'translate(0, 0)',
              boxShadow: enterHover ? '8px 8px 0 rgba(255,214,0,0.35)' : '5px 5px 0 rgba(255,214,0,0.3)',
              transition: 'transform 0.12s ease, box-shadow 0.12s ease',
              animation: 'borderPulse 2s ease infinite',
            }}
          >
            ENTER →
          </button>

          {/* Hint */}
          <p style={{
            position: 'absolute', bottom: 28,
            fontFamily: FONT_MONO, fontSize: '11px', color: '#333',
            letterSpacing: '0.08em',
          }}>
            点击任意位置进入
          </p>
        </div>
      )}
    </div>
  )
}
