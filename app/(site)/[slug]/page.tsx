import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FaqList, Label, PostTile } from '@/components/nx'
import { nxPages } from '@/components/nx-subpages'
import { buildMetadata, formatDate, getPage, getPageSlugs, getPost, getPosts } from '@/lib/content'
import { clusterOf, withAnchors } from '@/lib/blog'
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
  const related = posts.filter((p) => p.slug !== slug && clusterOf(`${p.slug} ${p.title}`).key === cluster.key).slice(0, 3)

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
      { '@type': 'ListItem', position: 3, name: post.title, item: `${site.url}/${slug}/` },
    ],
  }
  const faqSchema = post.faqs?.length
    ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: post.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
    : null
  const jsonLd = [schema, breadcrumbs, ...(faqSchema ? [faqSchema] : [])]

  return (
    <div className="nx-page">
      <section className="nx-lighthead nx-article-head" data-theme="light">
        <div className="nx-wrap">
          <Label>
            <Link href="/blog/">Blog</Link> / <time dateTime={post.date}>{formatDate(post.date)}</time>
          </Label>
          <h1 className="nx-article-title">{post.title}</h1>
        </div>
      </section>
      <section className="nx-article" data-theme="light">
        <article>
          {post.image && <img className="nx-article-image" src={post.image.src} alt={post.image.alt ?? ''} width={post.image.width} height={post.image.height} />}
          <div className="nx-prose is-flush" dangerouslySetInnerHTML={{ __html: withAnchors(post.html) }} />
          {post.faqs && post.faqs.length > 0 && (
            <section className="nx-article-part">
              <h2>Preguntas frecuentes</h2>
              <FaqList items={post.faqs.map((faq) => ({ q: faq.q, a: `<p>${faq.a}</p>` }))} />
            </section>
          )}
          {post.sources && post.sources.length > 0 && (
            <section className="nx-article-part">
              <h2>Fuentes</h2>
              <ul>
                {post.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <aside className="nx-article-service">
            <p>{cluster.service.text}</p>
            <Link href={cluster.service.href} className="nx-btn">
              {cluster.service.label} <ArrowRight size={16} strokeWidth={2.2} className="nx-arrow" aria-hidden />
            </Link>
          </aside>
          {previous && (
            <p className="nx-article-prev">
              <span>Anterior</span>
              <Link href={`/${previous.slug}/`}>{previous.title}</Link>
            </p>
          )}
        </article>
      </section>
      {related.length > 0 && (
        <section className="nx-section nx-grey" data-theme="light">
          <div className="nx-wrap">
            <h2 className="nx-h2">Artículos relacionados</h2>
            <div className="nx-posts">
              {related.map((item) => (
                <PostTile key={item.slug} post={item} />
              ))}
            </div>
          </div>
        </section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </div>
  )
}
