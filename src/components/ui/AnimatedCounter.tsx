'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
  style?: React.CSSProperties
}

export default function AnimatedCounter({ value, duration = 900, prefix = '', suffix = '', className, style }: Props) {
  const [display, setDisplay] = useState(0)
  const [popped, setPopped] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()

          const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1)
            // easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
            setDisplay(Math.round(eased * value))
            if (progress < 1) {
              requestAnimationFrame(tick)
            } else {
              setPopped(true)
              setTimeout(() => setPopped(false), 400)
            }
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span
      ref={ref}
      className={className}
      style={{
        ...style,
        display: 'inline-block',
        animation: popped ? 'countPop 0.4s ease both' : undefined,
      }}
    >
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  )
}
