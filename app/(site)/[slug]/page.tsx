import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ReadingProgress, Toc } from '@/components/blog-client'
import { BlogCta, PostGrid, SectionHead } from '@/components/blog-ui'
import { FaqList } from '@/components/nx'
import { nxPages } from '@/components/nx-subpages'
import { buildMetadata, formatDate, getPage, getPageSlugs, getPost, getPosts } from '@/lib/content'
import { clusterOf, withAnchors } from '@/lib/blog'
import { categoryByName, categoryPath } from '@/lib/blog-categories'
import { site } from '@/lib/site'

// Los artículos nuevos del panel se generan al pedirlos por primera vez.
export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

// WordPress publicaba páginas y artículos en la raíz; se conservan las mismas URLs.
export async function generateStaticParams() {
  return [...getPageSlugs(), ...(await getPosts()).map((post) => post.slug)].map((slug) => ({ slug }))
}

const isPage = (slug: string) => getPageSlugs().includes(slug)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (isPage(slug)) return buildMetadata(getPage(slug).seo, `/${slug}/`)
  const meta = (await getPosts()).find((post) => post.slug === slug)
  if (!meta) return {}
  return buildMetadata({ ...meta.seo, image: meta.seo.image ?? meta.image?.src ?? null }, `/${slug}/`, { type: 'article' })
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params
  if (isPage(slug)) {
    const Composed = nxPages[slug]
    if (!Composed) notFound()
    return <Composed page={getPage(slug)} />
  }

  const posts = await getPosts()
  const index = posts.findIndex((post) => post.slug === slug)
  if (index < 0) notFound()
  const post = await getPost(slug)
  if (!post) notFound()
  const previous = posts[index + 1]
  const cluster = clusterOf(`${post.slug} ${post.title}`)
  const category = categoryByName(post.category)
  // Relacionados: misma categoría; si no tiene, el mismo grupo temático.
  const related = posts.filter((p) => p.slug !== slug && (category ? p.category === post.category : clusterOf(`${p.slug} ${p.title}`).key === cluster.key)).slice(0, 3)
  const service = category?.service ?? cluster.service

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.modified,
    image: post.image ? `${site.url}${post.image.src}` : undefined,
    mainEntityOfPage: `${site.url}/${slug}/`,
    author: { '@type': 'Organization', name: 'Equipo de Agencia IDP', url: `${site.url}/transforma-agencia-software-colombia/` },
    publisher: { '@id': `${site.url}/#organization` },
    inLanguage: 'es-CO',
    description: post.seo?.description,
  }
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${site.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site.url}/blog/` },
      ...(category ? [{ '@type': 'ListItem', position: 3, name: category.name, item: `${site.url}${categoryPath(category)}` }] : []),
      { '@type': 'ListItem', position: category ? 4 : 3, name: post.title, item: `${site.url}/${slug}/` },
    ],
  }
  const faqSchema = post.faqs?.length
    ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: post.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
    : null
  const jsonLd = [schema, breadcrumbs, ...(faqSchema ? [faqSchema] : [])]

  const html = withAnchors(post.html)
  const toc = [...html.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map((m) => ({ id: m[1], text: m[2].replace(/<[^>]+>/g, '').trim() }))
  const words = post.html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 220))
  const next = posts[index - 1]
  const updated = post.modified || post.date

  return (
    <div className="nx-page bl-page">
      <ReadingProgress target=".bl-article-body" />
      <section className="bl-article-head" data-theme="light">
        <div className="nx-wrap">
          <nav className="bl-crumbs" aria-label="Ruta de navegación">
            <Link href="/blog/">Blog</Link>
            {category && (
              <>
                <span aria-hidden>/</span>
                <Link href={categoryPath(category)}>{category.name}</Link>
              </>
            )}
          </nav>
          <h1 className="bl-article-title">{post.title}</h1>
          {post.excerpt && <p className="bl-article-lead">{post.excerpt}</p>}
          <div className="bl-byline">
            <span className="bl-avatar" aria-hidden>
              IDP
            </span>
            <div>
              <strong>Equipo de Agencia IDP</strong>
              <span>
                Actualizado el <time dateTime={updated}>{formatDate(updated)}</time> · {minutes} min de lectura
              </span>
            </div>
          </div>
        </div>
      </section>

      {post.image && (
        <div className="bl-cover">
          <img src={post.image.src} alt={post.image.alt ?? ''} width={post.image.width} height={post.image.height} />
        </div>
      )}

      <section className="bl-article" data-theme="light">
        <div className="bl-article-grid">
          <aside className="bl-article-aside">
            <Toc items={toc} />
            <div className="bl-aside-card">
              <small>Agencia IDP</small>
              <p>{service.text}</p>
              <Link href={service.href}>
                {service.label} <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </aside>

          <article className="bl-article-body">
            <div className="nx-prose is-flush bl-prose" dangerouslySetInnerHTML={{ __html: html }} />

            {post.faqs && post.faqs.length > 0 && (
              <section className="bl-part">
                <h2>Preguntas frecuentes</h2>
                <FaqList items={post.faqs.map((faq) => ({ q: faq.q, a: `<p>${faq.a}</p>` }))} />
              </section>
            )}

            {post.sources && post.sources.length > 0 && (
              <section className="bl-part">
                <h2>Fuentes</h2>
                <ol className="bl-sources">
                  {post.sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        <span>{source.label}</span>
                        <small>{source.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}</small>
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <div className="bl-author">
              <span className="bl-avatar is-lg" aria-hidden>
                IDP
              </span>
              <div>
                <small>Escrito por</small>
                <strong>Equipo de Agencia IDP</strong>
                <p>Empresa de innovación con fábrica de software in house en Medellín. Nuestro compromiso es que nuestros clientes vendan más.</p>
                <Link href="/transforma-agencia-software-colombia/">
                  Conoce al equipo <ArrowRight size={15} aria-hidden />
                </Link>
              </div>
            </div>

            {(previous || next) && (
              <nav className="bl-pager" aria-label="Más artículos">
                {previous && (
                  <Link href={`/${previous.slug}/`}>
                    <small>Anterior</small>
                    <span>{previous.title}</span>
                  </Link>
                )}
                {next && (
                  <Link href={`/${next.slug}/`} className="is-next">
                    <small>Siguiente</small>
                    <span>{next.title}</span>
                  </Link>
                )}
              </nav>
            )}
          </article>
        </div>
      </section>

      {related.length > 0 && (
        <section className="nx-section nx-grey" data-theme="light">
          <div className="nx-wrap">
            <SectionHead
              label="Sigue leyendo"
              title={category ? `Más sobre ${category.name}` : 'Artículos relacionados'}
              link={category ? { href: categoryPath(category), text: 'Ver la categoría' } : { href: '/blog/', text: 'Ver el blog' }}
            />
            <PostGrid posts={related} />
          </div>
        </section>
      )}

      <BlogCta href={service.href} label={service.label} title="¿Quieres aplicarlo en tu empresa?" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\u003c') }} />
    </div>
  )
}
