import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { formatDate, type PostMeta } from '@/lib/content'
import { blogCategories, categoryByName, categoryPath } from '@/lib/blog-categories'
import { Btn, Label, Pic } from './nx'

/** Tarjeta de artículo. `layout` cambia la forma: vertical, grande u horizontal compacta. */
export function PostCard({ post, layout = 'grid', eager }: { post: PostMeta; layout?: 'grid' | 'hero' | 'row'; eager?: boolean }) {
  const category = categoryByName(post.category)
  return (
    <Link href={`/${post.slug}/`} className={`bl-card is-${layout}`}>
      <div className="bl-card-media">{post.image && <Pic image={post.image} eager={eager} />}</div>
      <div className="bl-card-body">
        {category && <span className="bl-tag">{category.name}</span>}
        <h3>{post.title}</h3>
        {post.excerpt && <p>{post.excerpt}</p>}
        <div className="bl-meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="bl-go">
            Leer <ArrowRight size={15} aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  )
}

/** Bloque editorial: un artículo grande y dos en columna. */
export function FeaturedPosts({ posts }: { posts: PostMeta[] }) {
  const [main, ...side] = posts
  if (!main) return null
  return (
    <div className="bl-featured">
      <PostCard post={main} layout="hero" eager />
      {side.length > 0 && (
        <div className="bl-featured-side">
          {side.slice(0, 3).map((p) => (
            <PostCard key={p.slug} post={p} layout="row" />
          ))}
        </div>
      )}
    </div>
  )
}

export function PostGrid({ posts }: { posts: PostMeta[] }) {
  return (
    <div className="bl-grid">
      {posts.map((p) => (
        <PostCard key={p.slug} post={p} />
      ))}
    </div>
  )
}

/** Tarjetas de los temas del blog con su número de artículos. */
export function TopicGrid({ counts, current }: { counts: Record<string, number>; current?: string }) {
  const topics = blogCategories.filter((c) => counts[c.name] && c.slug !== current)
  return (
    <div className="bl-topics">
      {topics.map((c, i) => (
        <Link key={c.slug} href={categoryPath(c)} className="bl-topic">
          <span className="bl-topic-num">{String(i + 1).padStart(2, '0')}</span>
          <h3>{c.name}</h3>
          <p>{c.lead}</p>
          <span className="bl-topic-foot">
            {counts[c.name]} artículos <ArrowUpRight size={18} aria-hidden />
          </span>
        </Link>
      ))}
    </div>
  )
}

export function SectionHead({ label, title, link }: { label: string; title: string; link?: { href: string; text: string } }) {
  return (
    <div className="bl-sechead">
      <div>
        <Label>{label}</Label>
        <h2 className="nx-h2">{title}</h2>
      </div>
      {link && (
        <Link href={link.href} className="bl-sechead-link">
          {link.text} <ArrowRight size={16} aria-hidden />
        </Link>
      )}
    </div>
  )
}

/** Cierre de las páginas del blog. */
export function BlogCta({ href = '/agentes-seo/', label = 'Diagnóstico SEO y GEO', title = 'Llevemos estas ideas a tu negocio', text = 'Somos una empresa de innovación con fábrica de software in house. Te ayudamos a vender más con tecnología.' }) {
  return (
    <section className="nx-section" data-theme="light">
      <div className="nx-wrap">
        <div className="bl-cta">
          <div>
            <Label>Agencia IDP</Label>
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
          <div className="bl-cta-actions">
            <Btn href={href}>{label}</Btn>
            <Btn href="/contacto/" variant="white">
              Agenda una llamada
            </Btn>
          </div>
        </div>
      </div>
    </section>
  )
}
