import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { Img } from '@/lib/content'
import { Btn, Html, Label, Pic } from './nx'
import { SmartLink } from './smart-link'
import { t } from '@/lib/lang'

/**
 * Bloques del rediseño de las páginas de servicio (2026-11-13).
 * Estructura inspirada en el referente; textos e imágenes son de Agencia IDP.
 */

export const strip = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

/** Cifras en cuadrícula para el lado derecho del héroe. */
export function HeroStats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className={`nx-abt-stats nx-svc-stats is-${items.length}`}>
      {items.map((item) => (
        <div key={item.label}>
          <dd>{item.value}</dd>
          <dt>{item.label}</dt>
        </div>
      ))}
    </dl>
  )
}

/** Cuadrícula numerada de beneficios o razones; se adapta al tema de la sección. */
export function FeatureGrid({ items, cols = 3 }: { items: { title: string; text?: string; html?: string }[]; cols?: 2 | 3 | 4 }) {
  return (
    <ul className={`nx-feat is-${cols}`}>
      {items.map((item, i) => (
        <li key={item.title}>
          <span>{String(i + 1).padStart(2, '0')}</span>
          <h3>{item.title}</h3>
          {item.text && <p>{item.text}</p>}
          {item.html && <Html html={item.html} />}
        </li>
      ))}
    </ul>
  )
}

/** Proceso en pasos horizontales unidos por una línea. */
export function ProcessSteps({ items }: { items: { title: string; html?: string; text?: string }[] }) {
  return (
    <ol className={`nx-process is-${Math.min(items.length, 5)}`}>
      {items.map((item, i) => (
        <li key={item.title}>
          <span className="nx-process-dot">{String(i + 1).padStart(2, '0')}</span>
          <h3>{item.title}</h3>
          {item.text && <p>{item.text}</p>}
          {item.html && <Html html={item.html} />}
        </li>
      ))}
    </ol>
  )
}

export type StackItem = { id?: string; label?: string; title: string; html?: string; extra?: string; image?: Img; cta?: { href: string; text: string }; tone?: 'light' | 'orange' | 'black' }

/** Tarjetas grandes que se quedan fijas y se apilan al bajar (como los servicios de la portada). */
export function StackCards({ items }: { items: StackItem[] }) {
  const tones = ['light', 'orange', 'black'] as const
  return (
    <div className="nx-stack">
      {items.map((item, i) => (
        <article key={item.title} id={item.id} className={`is-${item.tone ?? tones[i % 3]}`} style={{ ['--i' as string]: i }}>
          <div>
            <p className="nx-stack-label">
              <span>{String(i + 1).padStart(2, '0')}</span> {item.label}
            </p>
            <h3>{item.title}</h3>
            {item.html && <Html html={item.html} className="nx-stack-lead" />}
            {item.extra && <Html html={item.extra} />}
            {item.cta && (
              <SmartLink href={item.cta.href} className="nx-stack-cta">
                {item.cta.text} <ArrowUpRight size={16} aria-hidden />
              </SmartLink>
            )}
          </div>
          {item.image && <Pic image={item.image} alt="" className="nx-stack-photo" />}
        </article>
      ))}
    </div>
  )
}

/** Lista grande de servicios que se resalta al pasar el cursor. */
export function HoverList({ items }: { items: string[] }) {
  return (
    <ul className="nx-hoverlist">
      {items.map((item, i) => (
        <li key={item}>
          <span>{String(i + 1).padStart(2, '0')}</span>
          <strong>{item}</strong>
          <ArrowUpRight size={22} aria-hidden />
        </li>
      ))}
    </ul>
  )
}

/** Franja naranja de cifras; los números cuentan al aparecer. */
export function MetricsBand({ items }: { items: { value: string; label: string; text?: string }[] }) {
  return (
    <section className="nx-metricband" data-theme="light">
      <dl className="nx-wrap">
        {items.map((item) => (
          <div key={item.label}>
            <dd>{item.value}</dd>
            <dt>{item.label}</dt>
            {item.text && <p>{item.text}</p>}
          </div>
        ))}
      </dl>
    </section>
  )
}

/** Cierre oscuro con título grande y botones. */
export function BigCta({ label, title, text, children }: { label: string; title: string; text?: string; children: ReactNode }) {
  return (
    <section className="nx-section nx-abt-cta nx-glow" data-theme="dark">
      <div className="nx-wrap">
        <Label>{label}</Label>
        <h2 className="nx-display">{title}</h2>
        {text && <p className="nx-lead nx-bigcta-text">{text}</p>}
        <div className="nx-actions">{children}</div>
      </div>
    </section>
  )
}

/** Botones estándar de cierre: WhatsApp y agenda. */
export function CtaButtons({ href, text }: { href: string; text: string }) {
  return (
    <>
      <Btn href={href}>{text}</Btn>
      <Btn href="#agenda" variant="white">
        {t('Agenda una llamada', 'Book a call')}
      </Btn>
    </>
  )
}
