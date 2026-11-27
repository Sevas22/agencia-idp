import type { MetadataRoute } from 'next'
import { getPage, getPageSlugs, getPosts } from '@/lib/content'
import { blogCategories, categoryPath } from '@/lib/blog-categories'
import { keyOf, languagesOf, routes } from '@/lib/i18n'
import { site } from '@/lib/site'

export const revalidate = 3600

/** Fecha en formato W3C con zona horaria; Google rechaza fechas con hora pero sin zona. */
const w3c = (value?: string) => {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

/** Las páginas traducidas llevan sus alternativas hreflang también en el sitemap. */
const withAlternates = (path: string, lastModified?: string) => {
  const key = keyOf(path)
  return { url: `${site.url}${path}`, lastModified: w3c(lastModified), ...(key ? { alternates: { languages: languagesOf(key) } } : {}) }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixed = ['/', '/contacto/', '/precios/', '/preguntas-frecuentes/', '/blog/', '/agentes-seo/', '/pagina-posicionamiento-seo/', '/ui-ux/', '/design-sprint-ideacion-de-producto/', '/desarrollo-de-software-a-la-medida/', '/venture-lab-validacion-de-negocios/']
  const english = Object.values(routes).map(([es, en]) => {
    const slug = es.replace(/^\/|\/$/g, '')
    const modified = getPageSlugs().includes(slug) ? getPage(slug).modified : undefined
    return withAlternates(en, modified)
  })
  return [
    ...fixed.map((path) => withAlternates(path)),
    ...blogCategories.map((c) => ({ url: `${site.url}${categoryPath(c)}` })),
    ...getPageSlugs().map((slug) => withAlternates(`/${slug}/`, getPage(slug).modified)),
    ...english,
    ...(await getPosts()).map((post) => ({ url: `${site.url}/${post.slug}/`, lastModified: w3c(post.modified) })),
  ]
}
