import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getPosts, POSTS_PER_PAGE } from '@/lib/content'
import { CategoryNav, countByCategory } from './blog-category'
import { BlogSearch } from './blog-client'
import { BlogCta, FeaturedPosts, PostGrid, SectionHead, TopicGrid } from './blog-ui'
import { Label } from './nx'

const essentialSlugs = ['que-es-un-mvp-guia-definitiva-startups-colombia', 'cuanto-cuesta-desarrollar-un-mvp-en-colombia', 'agentes-de-ia-que-son-como-implementar-empresa-2026', 'cuanto-cuesta-una-pagina-web-en-colombia']

export async function BlogList({ page }: { page: number }) {
  const posts = await getPosts()
  const total = Math.ceil(posts.length / POSTS_PER_PAGE)
  if (page > Math.max(total, 1)) notFound()
  const visible = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)
  const counts = countByCategory(posts)
  const first = page === 1
  const featured = first ? visible.slice(0, 3) : []
  const grid = first ? visible.slice(3) : visible
  const essentials = essentialSlugs.map((slug) => posts.find((p) => p.slug === slug)).filter((p): p is (typeof posts)[number] => Boolean(p))

  return (
    <div className="nx-page bl-page">
      <section className="bl-hero" data-theme="light">
        <div className="nx-wrap">
          <div className="bl-hero-grid">
            <div>
              <Label>Blog de Agencia IDP{first ? '' : ` · Página ${page}`}</Label>
              <h1 className="nx-display">Ideas para vender más con tecnología</h1>
              <p className="nx-lead">Guías prácticas sobre MVP, software, IA, apps, e-commerce y posicionamiento, escritas por el equipo que construye.</p>
              <BlogSearch items={posts.map((p) => ({ slug: p.slug, title: p.title, category: p.category }))} />
            </div>
            <aside className="bl-hero-aside">
              <div className="bl-hero-stats">
                <p>
                  <strong>{posts.length}</strong> guías
                </p>
                <p>
                  <strong>{Object.keys(counts).length}</strong> temas
                </p>
              </div>
              <p className="bl-hero-aside-title">Guías esenciales</p>
              <ol>
                {essentials.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/${p.slug}/`}>
                      {p.title} <ArrowUpRight size={16} aria-hidden />
                    </Link>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
          <CategoryNav counts={counts} />
        </div>
      </section>

      {featured.length > 0 && (
        <section className="nx-section bl-pad-sm" data-theme="light">
          <div className="nx-wrap">
            <SectionHead label="Lo más reciente" title="Destacados" />
            <FeaturedPosts posts={featured} />
          </div>
        </section>
      )}

      <section className={`nx-section ${first ? 'nx-grey' : 'bl-pad-sm'}`} data-theme="light">
        <div className="nx-wrap">
          {first && <SectionHead label="Biblioteca" title="Todos los artículos" />}
          <PostGrid posts={grid} />
          {total > 1 && (
            <nav className="nx-pagination" aria-label="Páginas del blog">
              {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
                <Link key={n} href={n === 1 ? '/blog/' : `/blog/page/${n}/`} aria-current={n === page ? 'page' : undefined}>
                  {n}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap">
          <SectionHead label="Temas" title="Explora por tema" />
          <TopicGrid counts={counts} />
        </div>
      </section>

      <BlogCta />
    </div>
  )
}
