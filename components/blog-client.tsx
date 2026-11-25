'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Search, X } from 'lucide-react'

type SearchItem = { slug: string; title: string; category: string }

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Buscador del blog: filtra por título y categoría mientras se escribe. */
export function BlogSearch({ items }: { items: SearchItem[] }) {
  const [q, setQ] = useState('')
  const results = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean)
    if (!words.length) return []
    return items.filter((i) => words.every((w) => norm(`${i.title} ${i.category}`).includes(w))).slice(0, 6)
  }, [q, items])

  return (
    <div className="bl-search">
      <label className="bl-search-box">
        <Search size={20} aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busca una guía: MVP, Shopify, agentes de IA…" aria-label="Buscar en el blog" />
        {q && (
          <button type="button" onClick={() => setQ('')} aria-label="Borrar búsqueda">
            <X size={18} />
          </button>
        )}
      </label>
      {q && (
        <div className="bl-search-results" role="listbox">
          {results.length ? (
            results.map((r) => (
              <Link key={r.slug} href={`/${r.slug}/`} role="option" aria-selected={false}>
                <small>{r.category}</small>
                <span>{r.title}</span>
                <ArrowRight size={16} aria-hidden />
              </Link>
            ))
          ) : (
            <p>No encontramos guías con esas palabras. Prueba con otro término.</p>
          )}
        </div>
      )}
    </div>
  )
}

/** Barra fina que muestra cuánto del artículo se ha leído. */
export function ReadingProgress({ target }: { target: string }) {
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = document.querySelector(target)
      if (!el || !bar.current) return
      const box = el.getBoundingClientRect()
      const total = box.height - window.innerHeight * 0.6
      const p = Math.min(1, Math.max(0, -box.top / Math.max(total, 1)))
      bar.current.style.transform = `scaleX(${p})`
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
  }, [target])
  return <div className="bl-progress" ref={bar} aria-hidden />
}

/** Índice del artículo que marca la sección que se está leyendo. */
export function Toc({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = useState(items[0]?.id)
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => Boolean(e))
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-120px 0px -65% 0px' },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [items])

  if (items.length < 2) return null
  return (
    <nav className="bl-toc" aria-label="Contenido del artículo">
      <p>En este artículo</p>
      <ol>
        {items.map((i, n) => (
          <li key={i.id} className={active === i.id ? 'is-active' : undefined}>
            <a href={`#${i.id}`}>
              <span>{String(n + 1).padStart(2, '0')}</span>
              {i.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
