import { getPosts } from '@/lib/content'
import { site } from '@/lib/site'

export const dynamic = 'force-static'
export const revalidate = 3600

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export async function GET() {
  const items = (await getPosts())
    .slice(0, 30)
    .map(
      (post) => `<item><title>${escape(post.title)}</title><link>${site.url}/${post.slug}/</link><guid>${site.url}/${post.slug}/</guid><pubDate>${new Date(post.date).toUTCString()}</pubDate><description>${escape(post.seo.description || post.excerpt)}</description></item>`,
    )
    .join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Blog de Agencia IDP</title><link>${site.url}/blog/</link><description>Guías sobre MVP, software, IA, SEO y GEO para empresas en Colombia.</description><language>es-CO</language>${items}</channel></rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
