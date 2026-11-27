import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { cache } from 'react'
import type { Metadata } from 'next'
import { mergedPosts } from './blog'
import { keyOf, langOf, languagesOf } from './i18n'
import { getLang } from './lang'
import { findPublished, hasDatabase, listPublished, type DbPost } from './posts-repo'
import { site } from './site'

export type Img = { src: string; width: number; height: number; alt?: string }
export type Seo = { title: string; description: string; image: string | null }

export type Block =
  | { t: 'heading'; level: number; text: string }
  | { t: 'rich'; html: string }
  | ({ t: 'image' } & Img)
  | { t: 'button'; href: string; text: string }
  | { t: 'kicker'; text: string }
  | { t: 'label'; text: string }
  | { t: 'anchor'; id: string }
  | { t: 'card'; title: string; html: string; kicker?: string; image?: Img; href?: string; cta?: string }
  | { t: 'list'; items: string[] }
  | { t: 'chips'; items: string[] }
  | { t: 'stat'; value: string; suffix: string; label: string }
  | { t: 'faq'; q: string; a: string }
  | { t: 'quote'; text: string; name: string; role: string; image?: Img }
  | { t: 'person'; text: string; name: string; role: string; image?: Img }
  | { t: 'gallery'; images: Img[] }
  | { t: 'video'; src: string }
  | { t: 'contact' }

export type Page = { slug: string; title: string; seo: Seo; modified: string; sections: { blocks: Block[] }[] }

export type PostMeta = {
  slug: string
  title: string
  date: string
  modified: string
  excerpt: string
  category: string
  image: Img | null
  seo: Seo
}
export type Faq = { q: string; a: string }
export type Post = PostMeta & { html: string; faqs?: Faq[]; sources?: { label: string; url: string }[] }

export type Plan = { name: string; desc: string; price: string; items: string[] }
export type PriceGroup = { title: string; tabs: { name: string; plans: Plan[] }[] }

export const read = <T,>(file: string): T =>
  JSON.parse(readFileSync(path.join(process.cwd(), 'content', file), 'utf8')) as T

// content/blog-seo guarda las versiones optimizadas y los artículos nuevos. Tienen prioridad
// sobre lo importado de WordPress y no se pierden si se repite la importación.
const seoDir = path.join(process.cwd(), 'content', 'blog-seo')
const seoPosts = () => (existsSync(seoDir) ? readdirSync(seoDir).filter((f) => f.endsWith('.json')).map((f) => read<Partial<Post> & { slug: string }>(`blog-seo/${f}`)) : [])

const filePosts = (): PostMeta[] => {
  const overrides = new Map(seoPosts().map((p) => [p.slug, p]))
  const base = read<PostMeta[]>('posts-index.json')
    .filter((p) => !mergedPosts[p.slug])
    .map((p) => ({ ...p, ...overrides.get(p.slug), html: undefined, faqs: undefined, sources: undefined }) as PostMeta)
  const added = [...overrides.values()].filter((p) => !base.some((b) => b.slug === p.slug)).map((p) => ({ ...p, html: undefined, faqs: undefined, sources: undefined }) as unknown as PostMeta)
  return [...base, ...added].sort((a, b) => b.date.localeCompare(a.date))
}

const filePost = (slug: string): Post | null => {
  const override = seoPosts().find((p) => p.slug === slug)
  const file = path.join(process.cwd(), 'content', 'posts', `${slug}.json`)
  if (!override && !existsSync(file)) return null
  return { ...(existsSync(file) ? read<Post>(`posts/${slug}.json`) : ({} as Post)), ...override }
}

const fromDb = (p: DbPost): Post => ({
  slug: p.slug,
  title: p.title,
  date: p.publishedAt ?? p.createdAt,
  modified: p.updatedAt,
  excerpt: p.excerpt,
  category: p.category,
  image: p.image,
  seo: { title: p.seoTitle || p.title, description: p.seoDescription, image: null },
  html: p.html,
  faqs: p.faqs,
  sources: p.sources,
})

/**
 * Los artículos viven en Postgres y se editan desde /admin. Si la base no está configurada
 * o no responde, el sitio sigue funcionando con los archivos de content/.
 */
export const getPosts = cache(async (): Promise<PostMeta[]> => {
  if (!hasDatabase()) return filePosts()
  try {
    return (await listPublished()).map(fromDb)
  } catch (error) {
    console.error('No se pudo leer el blog desde la base; se usan los archivos.', error)
    return filePosts()
  }
})

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  if (!hasDatabase()) return filePost(slug)
  try {
    const post = await findPublished(slug)
    return post ? fromDb(post) : null
  } catch (error) {
    console.error('No se pudo leer el artículo desde la base; se usa el archivo.', error)
    return filePost(slug)
  }
})
/** En inglés usa content/en/<archivo> si existe; si no, el original en español. */
export const localFile = (file: string) => (getLang() === 'en' && existsSync(path.join(process.cwd(), 'content', 'en', file)) ? `en/${file}` : file)
export const readLocal = <T,>(file: string): T => read<T>(localFile(file))

export const getPageSlugs = () => read<string[]>('pages-index.json')
export const getPage = (slug: string) => readLocal<Page>(`pages/${slug}.json`)
export const getPrices = () => readLocal<PriceGroup[]>('precios.json')
export const getSeo = (key: string) => readLocal<Record<string, Seo>>('seo.json')[key]

export const POSTS_PER_PAGE = 12

export function buildMetadata(seo: Seo, pathname: string, opts: { noindex?: boolean; type?: 'website' | 'article' } = {}): Metadata {
  const key = keyOf(pathname)
  const lang = langOf(pathname)
  return {
    title: { absolute: seo.title },
    description: seo.description || undefined,
    // hreflang solo en páginas que existen en los dos idiomas.
    alternates: { canonical: pathname, ...(key && !opts.noindex ? { languages: languagesOf(key) } : {}) },
    robots: opts.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: seo.title,
      description: seo.description || undefined,
      url: `${site.url}${pathname}`,
      siteName: site.name,
      locale: lang === 'en' ? 'en_US' : 'es_CO',
      alternateLocale: key ? [lang === 'en' ? 'es_CO' : 'en_US'] : undefined,
      type: opts.type ?? 'website',
      // Sin imagen propia, cada página comparte la imagen de marca de su idioma.
      images: [seo.image ? seo.image : { url: `/og/agencia-idp-${lang}.jpg`, width: 1200, height: 630, alt: lang === 'en' ? 'Agencia IDP, innovation company' : 'Agencia IDP, empresa de innovación' }],
    },
  }
}

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
