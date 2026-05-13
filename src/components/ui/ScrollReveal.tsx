'use client'

import { useEffect, useRef } from 'react'

/**
 * Attaches an IntersectionObserver to all `.reveal-section` elements
 * within the provided container (or document body). When an element
 * enters the viewport it gains the `is-visible` class which triggers
 * the CSS transition defined in globals.css.
 */
export default function ScrollReveal() {
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) return
    mounted.current = true

    const elements = document.querySelectorAll<HTMLElement>('.reveal-section')

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return null
}
