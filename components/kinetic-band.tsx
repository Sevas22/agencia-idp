'use client'

import { useEffect, useRef } from 'react'

/**
 * Franja de palabras grandes que se desplaza en sentidos opuestos según el scroll.
 * Es decorativa: el contenido real ya está en la página.
 */
export function KineticBand({ rows }: { rows: string[][] }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const box = el.getBoundingClientRect()
      if (box.bottom < 0 || box.top > window.innerHeight) return
      el.style.setProperty('--kb', String(window.innerHeight - box.top))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="nx-kinetic" ref={ref} aria-hidden>
      {rows.map((words, i) => (
        <div key={i} className={i % 2 ? 'is-reverse' : undefined}>
          {[...words, ...words, ...words].map((word, j) => (
            <span key={j}>{word}</span>
          ))}
        </div>
      ))}
    </div>
  )
}
