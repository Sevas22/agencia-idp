'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, Globe, Menu, Plus, X } from 'lucide-react'
import { counterpart, pathOf } from '@/lib/i18n'
import { nav, navEn, site } from '@/lib/site'
import { useLang, useT } from './lang-context'

/** Debe coincidir con la media query del menú móvil en redesign.css. */
const MOBILE_MENU = '(max-width: 1120px), (hover: none) and (max-width: 1366px)'

/** Menú flotante: toma el color de la sección que tiene debajo. */
export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const [openSub, setOpenSub] = useState<string | null>(null)
  const pathname = usePathname()
  const lang = useLang()
  const t = useT()
  const items = lang === 'en' ? navEn : nav
  const other = lang === 'en' ? 'es' : 'en'
  // Mismo contenido en el otro idioma (o su inicio si la página no está traducida).
  const switchHref = counterpart(pathname, other)

  useEffect(() => {
    setOpen(false)
    setOpenSub(null)
  }, [pathname])

  // Con el menú abierto, la página de atrás no se desplaza y Escape lo cierra.
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    const media = window.matchMedia(MOBILE_MENU)
    const close = () => setOpen(false)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    const onChange = () => {
      if (!media.matches) close()
    }
    window.addEventListener('keydown', onKey)
    media.addEventListener('change', onChange)
    return () => {
      root.style.overflow = previous
      window.removeEventListener('keydown', onKey)
      media.removeEventListener('change', onChange)
    }
  }, [open])

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const sections = document.querySelectorAll<HTMLElement>('[data-theme]')
      let current = false
      for (const section of sections) {
        const box = section.getBoundingClientRect()
        if (box.top <= 44 && box.bottom > 44) current = section.dataset.theme === 'dark'
      }
      setDark(current)
      setAtTop(window.scrollY < 40)
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
  }, [pathname])

  return (
    <header className={`nx-header ${dark ? 'is-dark' : ''} ${open ? 'is-open' : ''} ${atTop ? 'is-top' : ''}`}>
      <Link href={pathOf('home', lang)} className="nx-logo" aria-label={t('Agencia IDP, ir al inicio', 'Agencia IDP, go to home')}>
        <img src={dark ? '/brand/logo-agencia-idp-blanco.webp' : '/brand/logo-agencia-idp.webp'} alt="Agencia IDP" width={640} height={401} />
      </Link>

      <nav className="nx-nav" aria-label={t('Principal', 'Main')}>
        <ul>
          {items.map((item) => (
            <li key={item.label} className={item.children ? `has-sub ${openSub === item.label ? 'is-open' : ''}` : undefined}>
              <Link href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>
                {item.label}
                {item.children && <Plus size={13} aria-hidden />}
              </Link>
              {item.children && (
                <button
                  type="button"
                  className="nx-sub-toggle"
                  aria-expanded={openSub === item.label}
                  aria-label={lang === 'en' ? `${openSub === item.label ? 'Close' : 'Open'} ${item.label} submenu` : `${openSub === item.label ? 'Cerrar' : 'Abrir'} submenú de ${item.label}`}
                  onClick={() => setOpenSub(openSub === item.label ? null : item.label)}
                >
                  <Plus size={18} aria-hidden />
                </button>
              )}
              {item.children && (
                <ul className="nx-sub">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link href={child.href}>{child.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <a className="nx-lang" href={switchHref} hrefLang={other} lang={other} aria-label={t('Read this page in English', 'Ver esta página en español')}>
          <Globe size={15} aria-hidden /> {other.toUpperCase()}
        </a>
        <a className="nx-btn nx-nav-cta" href={site.whatsapp} target="_blank" rel="noopener noreferrer">
          {t('Hablemos', "Let's talk")} <ArrowRight size={16} strokeWidth={2.2} className="nx-arrow" aria-hidden />
        </a>
      </nav>

      <a className="nx-btn nx-btn-sm nx-header-cta" href={site.whatsapp} target="_blank" rel="noopener noreferrer">
        {t('Hablemos', "Let's talk")} <ArrowRight size={16} strokeWidth={2.2} className="nx-arrow" aria-hidden />
      </a>

      <button type="button" className="nx-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? t('Cerrar menú', 'Close menu') : t('Abrir menú', 'Open menu')}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  )
}
