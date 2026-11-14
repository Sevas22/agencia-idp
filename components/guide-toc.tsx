'use client'

import { useEffect, useState } from 'react'
import { useT } from './lang-context'

/** Índice lateral de la guía: marca la sección que se está leyendo y muestra el avance. */
export function GuideToc({ items }: { items: { id: string; title: string }[] }) {
  const t = useT()
  const [active, setActive] = useState(items[0]?.id)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const sections = items.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-20% 0px -60% 0px' },
    )
    sections.forEach((section) => observer.observe(section))

    const guide = document.querySelector<HTMLElement>('.nx-guide-body')
    let frame = 0
    const onScroll = () => {
      if (frame || !guide) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const box = guide.getBoundingClientRect()
        const value = (window.innerHeight * 0.3 - box.top) / box.height
        setProgress(Math.min(1, Math.max(0, value)))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [items])

  return (
    <nav className="nx-guide-toc" aria-label={t('Contenido de la guía', 'Guide contents')}>
      <p className="nx-label">{t('En esta guía', 'In this guide')}</p>
      <span className="nx-guide-bar" aria-hidden>
        <i style={{ transform: `scaleY(${progress})` }} />
      </span>
      <ol>
        {items.map((item, i) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={active === item.id ? 'is-active' : undefined} aria-current={active === item.id ? 'true' : undefined}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
