import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { PostMeta } from '@/lib/content'
import { blogCategories, categoryPath, type BlogCategory } from '@/lib/blog-categories'
import { site } from '@/lib/site'
import { BlogCta, FeaturedPosts, PostGrid, SectionHead, TopicGrid } from './blog-ui'
import { FaqList, Label } from './nx'

/** Menú de categorías del blog; marca la actual. */
export function CategoryNav({ current, counts }: { current?: string; counts: Record<string, number> }) {
  return (
    <nav className="nx-blogcats" aria-label="Categorías del blog">
      <Link href="/blog/" aria-current={current ? undefined : 'page'}>
        Todos
      </Link>
      {blogCategories
        .filter((c) => counts[c.name])
        .map((c) => (
          <Link key={c.slug} href={categoryPath(c)} aria-current={current === c.slug ? 'page' : undefined}>
            {c.name} <small>{counts[c.name]}</small>
          </Link>
        ))}
    </nav>
  )
}

export const countByCategory = (posts: PostMeta[]) =>
  posts.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.category]: (acc[p.category] ?? 0) + 1 }), {})

/** Página de una categoría: introducción, guías clave, todos los artículos, servicio y preguntas frecuentes. */
export function BlogCategoryPage({ category, posts, allPosts }: { category: BlogCategory; posts: PostMeta[]; allPosts: PostMeta[] }) {
  const featured = category.featured.map((slug) => posts.find((p) => p.slug === slug)).filter((p): p is PostMeta => Boolean(p))
  const rest = posts.filter((p) => !category.featured.includes(p.slug))
  const url = `${site.url}${categoryPath(category)}`

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: category.name,
      description: category.seoDescription,
      url,
      inLanguage: 'es-CO',
      isPartOf: { '@id': `${site.url}/#website` },
      about: category.name,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: posts.length,
        itemListElement: posts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.url}/${p.slug}/`, name: p.title })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${site.url}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site.url}/blog/` },
        { '@type': 'ListItem', position: 3, name: category.name, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: category.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ]

  return (
    <div className="nx-page bl-page">
      <section className="bl-hero" data-theme="light">
        <div className="nx-wrap">
          <Label>
            <Link href="/blog/">Blog</Link> / {posts.length} artículos
          </Label>
          <h1 className="nx-display">{category.name}</h1>
          <p className="nx-lead">{category.lead}</p>
          <p className="nx-blogcat-intro">{category.intro}</p>
          <CategoryNav current={category.slug} counts={countByCategory(allPosts)} />
        </div>
      </section>

      {featured.length > 0 && (
        <section className="nx-section bl-pad-sm" data-theme="light">
          <div className="nx-wrap">
            <SectionHead label="Empieza por aquí" title="Las guías esenciales" />
            <FeaturedPosts posts={featured} />
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="nx-section nx-grey" data-theme="light">
          <div className="nx-wrap">
            <SectionHead label="Biblioteca" title={`Más sobre ${category.name}`} />
            <PostGrid posts={rest} />
          </div>
        </section>
      )}

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap nx-sticky-grid">
          <div className="nx-sticky">
            <Label>Preguntas frecuentes</Label>
            <h2 className="nx-h2">Sobre {category.name}</h2>
            <Link className="nx-phase-next" href={category.service.href}>
              <small>{category.service.text}</small>
              <strong>{category.service.label}</strong>
              <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
          <FaqList items={category.faqs.map((f) => ({ q: f.q, a: `<p>${f.a}</p>` }))} />
        </div>
      </section>

      <section className="nx-section nx-grey" data-theme="light">
        <div className="nx-wrap">
          <SectionHead label="Otros temas" title="Sigue explorando" link={{ href: '/blog/', text: 'Ver todo el blog' }} />
          <TopicGrid counts={countByCategory(allPosts)} current={category.slug} />
        </div>
      </section>

      <BlogCta href={category.service.href} label={category.service.label} title="¿Quieres aplicarlo en tu empresa?" />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </div>
  )
}
