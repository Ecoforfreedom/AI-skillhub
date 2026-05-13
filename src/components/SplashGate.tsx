'use client'

import { useEffect, useState } from 'react'

export default function SplashGate() {
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem('splash-seen')) {
      setVisible(true)
    }
  }, [])

  function dismiss() {
    setFading(true)
    setTimeout(() => {
      setVisible(false)
      sessionStorage.setItem('splash-seen', '1')
    }, 500)
  }

  if (!visible) return null

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.5s ease',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Crosshair decoration */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', width: '1px', height: '100%', background: 'rgba(255,214,0,0.12)' }} />
        <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'rgba(255,214,0,0.12)' }} />
        {/* Corner brackets */}
        <div style={{ position: 'absolute', top: 32, left: 32, width: 40, height: 40, borderTop: '3px solid #FFD600', borderLeft: '3px solid #FFD600' }} />
        <div style={{ position: 'absolute', top: 32, right: 32, width: 40, height: 40, borderTop: '3px solid #FFD600', borderRight: '3px solid #FFD600' }} />
        <div style={{ position: 'absolute', bottom: 32, left: 32, width: 40, height: 40, borderBottom: '3px solid #FFD600', borderLeft: '3px solid #FFD600' }} />
        <div style={{ position: 'absolute', bottom: 32, right: 32, width: 40, height: 40, borderBottom: '3px solid #FFD600', borderRight: '3px solid #FFD600' }} />
      </div>

      {/* Badge */}
      <div style={{
        background: '#FFD600',
        color: '#000',
        padding: '5px 14px',
        fontFamily: "'IBM Plex Mono', 'Microsoft YaHei', '微软雅黑', monospace",
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom: '36px',
      }}>
        AI 工具导航 · 2026
      </div>

      {/* Main title */}
      <h1 style={{
        fontFamily: "'Bebas Neue', Impact, 'Microsoft YaHei', '微软雅黑', sans-serif",
        fontSize: 'clamp(72px, 14vw, 180px)',
        color: '#FFD600',
        lineHeight: 0.88,
        letterSpacing: '0.04em',
        textAlign: 'center',
        margin: 0,
      }}>
        AI SKILL
        <br />
        RADAR
      </h1>

      {/* Tagline */}
      <p style={{
        fontFamily: "'IBM Plex Mono', 'Microsoft YaHei', '微软雅黑', monospace",
        fontSize: 'clamp(13px, 1.6vw, 16px)',
        color: '#888',
        marginTop: '28px',
        letterSpacing: '0.05em',
        textAlign: 'center',
        maxWidth: 480,
        lineHeight: 1.8,
        padding: '0 24px',
      }}>
        发现每个岗位能用的 AI 工具
      </p>

      {/* Enter button */}
      <button
        onClick={e => { e.stopPropagation(); dismiss() }}
        style={{
          marginTop: '52px',
          background: '#FFD600',
          color: '#000',
          border: '3px solid #FFD600',
          padding: '16px 52px',
          fontFamily: "'IBM Plex Mono', 'Microsoft YaHei', '微软雅黑', monospace",
          fontSize: '15px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          boxShadow: '5px 5px 0 #FFD600, 5px 5px 0 1px rgba(255,255,255,0.15)',
          transition: 'transform 0.1s, box-shadow 0.1s',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.transform = 'translate(-2px, -2px)'
          el.style.boxShadow = '7px 7px 0 #FFD600, 7px 7px 0 1px rgba(255,255,255,0.15)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.transform = ''
          el.style.boxShadow = '5px 5px 0 #FFD600, 5px 5px 0 1px rgba(255,255,255,0.15)'
        }}
      >
        ENTER →
      </button>

      {/* Hint */}
      <p style={{
        position: 'absolute',
        bottom: 28,
        fontFamily: "'IBM Plex Mono', 'Microsoft YaHei', '微软雅黑', monospace",
        fontSize: '11px',
        color: '#444',
        letterSpacing: '0.08em',
      }}>
        点击任意位置进入
      </p>
    </div>
  )
}
