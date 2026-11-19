import type { ReactNode } from 'react'
import { ArrowRight, Plus } from 'lucide-react'
import Link from 'next/link'
import type { Img, PostMeta } from '@/lib/content'
import { site } from '@/lib/site'
import { t } from '@/lib/lang'
import { SmartLink } from './smart-link'

export const Html = ({ html, className }: { html: string; className?: string }) => <div className={className} dangerouslySetInnerHTML={{ __html: html }} />

export const Pic = ({ image, className, alt, eager }: { image: Img; className?: string; alt?: string; eager?: boolean }) => (
  <img src={image.src} alt={alt ?? image.alt ?? ''} width={image.width} height={image.height} loading={eager ? 'eager' : 'lazy'} decoding="async" className={className} />
)

type BtnProps = { href: string; children: ReactNode; variant?: 'white' | 'line' }

export function Btn({ href, children, variant }: BtnProps) {
  return (
    <SmartLink href={href} className={`nx-btn ${variant ? `nx-btn-${variant}` : ''}`}>
      {children} <ArrowRight size={16} strokeWidth={2.2} className="nx-arrow" aria-hidden />
    </SmartLink>
  )
}

export const Label = ({ children }: { children: ReactNode }) => <p className="nx-label">{children}</p>

type StepItem = { title: string; text?: string; html?: string; meta?: string }

/** Lista numerada con el título fijo a la izquierda. */
export function NumberedList({ items }: { items: StepItem[] }) {
  return (
    <ol className="nx-numbered">
      {items.map((item, index) => (
        <li key={item.title}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3>
              {item.title}
              {item.meta && <em>{item.meta}</em>}
            </h3>
            {item.text && <p>{item.text}</p>}
            {item.html && <Html html={item.html} />}
          </div>
        </li>
      ))}
    </ol>
  )
}

/** Pasos unidos por una línea vertical. */
export function StepLine({ items }: { items: StepItem[] }) {
  return (
    <ol className="nx-stepline">
      {items.map((item, index) => (
        <li key={item.title}>
          <span>{index + 1}</span>
          <div>
            <h3>{item.title}</h3>
            {item.meta && <p className="nx-stepline-meta">{item.meta}</p>}
            {item.text && <p>{item.text}</p>}
            {item.html && <Html html={item.html} />}
          </div>
        </li>
      ))}
    </ol>
  )
}

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="nx-faq">
      {items.map((item, index) => (
        <details key={item.q} open={index === 0}>
          <summary>
            <Plus size={18} aria-hidden />
            {item.q}
          </summary>
          <Html html={item.a} />
        </details>
      ))}
    </div>
  )
}

export function ContactEmbed() {
  return <iframe className="nx-embed" src={site.contactForm} title={t('Formulario de contacto', 'Contact form')} loading="lazy" />
}

export function DarkHero({ label, title, html, children }: { label: string; title: string; html?: string; children?: ReactNode }) {
  return (
    <section className="nx-pagehero nx-center nx-grey" data-theme="light">
      <span className="nx-arc" aria-hidden />
      <div className="nx-wrap">
        <Label>{label}</Label>
        <h1 className="nx-display">{title}</h1>
        {html && <Html html={html} className="nx-lead nx-measure" />}
        {children}
      </div>
    </section>
  )
}

export function LightHead({ label, title, text }: { label: string; title: string; text?: string }) {
  return (
    <section className="nx-lighthead" data-theme="light">
      <div className="nx-wrap">
        <Label>{label}</Label>
        <h1 className="nx-display">{title}</h1>
        {text && <p className="nx-lead">{text}</p>}
      </div>
    </section>
  )
}

type Tile = { kicker?: string; title: string; html?: string; image?: Img; href?: string; cta?: string }

/** Tarjeta de proyecto: imagen, texto y barra naranja. */
export function WorkTile({ card, linkText }: { card: Tile; linkText?: string }) {
  linkText ??= t('Ver proyecto', 'View project')
  const body = (
    <>
      {card.image && <Pic image={card.image} alt={card.title} />}
      <span className="nx-tile-body">
        {card.kicker && <small>{card.kicker}</small>}
        <strong>{card.title}</strong>
        {card.html && <Html html={card.html} />}
      </span>
      {card.href && (
        <span className="nx-project-bar">
          {card.cta ?? linkText} <ArrowRight size={16} strokeWidth={2.2} className="nx-arrow" aria-hidden />
        </span>
      )}
    </>
  )
  return card.href ? (
    <SmartLink href={card.href} className="nx-tile">
      {body}
    </SmartLink>
  ) : (
    <article className="nx-tile">{body}</article>
  )
}

export const PostTile = ({ post }: { post: PostMeta }) => (
  <Link href={`/${post.slug}/`}>
    {post.image && <Pic image={post.image} />}
    <h3>{post.title}</h3>
    {post.excerpt && <p>{post.excerpt}</p>}
  </Link>
)
