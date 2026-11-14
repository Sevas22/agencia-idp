'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Párrafo grande que se va "encendiendo" palabra por palabra mientras se hace scroll.
 * Sin JavaScript o con movimiento reducido se ve completo desde el inicio.
 */
export function RevealText({ text, as: Tag = 'p', className }: { text: string; as?: 'p' | 'h2'; className?: string }) {
  const ref = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(1)
  const words = text.split(' ')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const el = ref.current
      if (!el) return
      const box = el.getBoundingClientRect()
      const start = window.innerHeight * 0.85
      const end = window.innerHeight * 0.35
      const value = (start - box.top) / (start - end + box.height * 0.5)
      setProgress(Math.min(1, Math.max(0, value)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  const lit = Math.round(progress * words.length)
  return (
    <Tag ref={ref as never} className={`nx-reveal ${className ?? ''}`}>
      {words.map((word, i) => (
        <span key={i} className={i < lit ? 'is-lit' : undefined}>
          {word}{' '}
        </span>
      ))}
    </Tag>
  )
}
