'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Bloques que entran con un desplazamiento suave al aparecer en pantalla.
const REVEAL = [
  '.nx-page .nx-section .nx-wrap > :not(.nx-trio):not(.nx-posts):not(.nx-quotes):not(.nx-cards):not(.nx-logos):not(.nx-abt-values):not(.nx-abt-team):not(.nx-sticky-grid):not(.nx-feat):not(.nx-process):not(.nx-stack):not(.nx-whocards):not(.nx-autorows):not(.nx-benefits):not(.nx-autoblock-top):not(.nx-guide-grid):not(.nx-cases):not(.nx-channels)',
  '.nx-feat > li',
  '.nx-process > li',
  '.nx-stack > article',
  '.nx-hoverlist > li',
  '.nx-whocards > li',
  '.nx-autorows > article',
  '.nx-benefits > li',
  '.nx-channels > li',
  '.nx-guide-body > *',
  '.nx-autoblock-top > *',
  '.nx-page .nx-sticky-grid > *',
  '.nx-trio > article',
  '.nx-posts > *',
  '.nx-quotes > figure',
  '.nx-cards > *',
  '.nx-logos > *',
  '.nx-abt-values > li',
  '.nx-abt-team > figure',
  '.nx-abt-story > li',
  '.nx-numbered > li',
  '.nx-steps > li',
  '.nx-faq > *',
  '.nx-schedule-grid > *',
  '.nx-footer-main > *',
].join(',')

// Cifras que cuentan desde cero cuando aparecen.
const COUNTERS = '.nx-stats dd, .nx-abt-stats dd, .nx-hero-stat strong, .nx-metricband dd'

function countUp(el: HTMLElement) {
  const original = el.textContent ?? ''
  const match = original.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/)
  if (!match) return
  const [, before, number, after] = match
  const target = parseFloat(number.replace(',', '.'))
  const start = performance.now()
  const duration = 1400
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - t, 3)
    el.textContent = `${before}${Math.round(target * eased)}${after}`
    if (t < 1) requestAnimationFrame(step)
    else el.textContent = original
  }
  requestAnimationFrame(step)
}

/**
 * Capa de movimiento del sitio: revela bloques al hacer scroll, cuenta las cifras
 * y respeta a quien prefiere menos movimiento. Lo que ya está en pantalla al cargar no se oculta.
 */
export function Motion() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const fold = window.innerHeight

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          el.classList.add('is-in')
          if (el.matches(COUNTERS)) countUp(el)
          observer.unobserve(el)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )

    const below = (el: Element) => el.getBoundingClientRect().top > fold * 0.92
    document.querySelectorAll<HTMLElement>(REVEAL).forEach((el) => {
      if (el.classList.contains('is-in') || el.closest('.nx-hero, .nx-svchero, .nx-abt-hero')) return
      if (el.classList.contains('nx-rv')) return observer.observe(el)
      if (!below(el)) return
      const index = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0
      el.style.setProperty('--rv-d', `${Math.min(index, 5) * 80}ms`)
      el.classList.add('nx-rv')
      observer.observe(el)
    })
    document.querySelectorAll<HTMLElement>(COUNTERS).forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [pathname])

  return null
}
