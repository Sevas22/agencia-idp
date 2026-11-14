/**
 * Puntajes SEO y GEO de un artículo. Funciona en el navegador (editor en vivo) y en el servidor (listado).
 * Cada verificación vale lo mismo; el puntaje es el porcentaje de verificaciones cumplidas.
 */
export type ScoreInput = {
  slug: string
  title: string
  seoTitle: string
  seoDescription: string
  excerpt: string
  html: string
  keywords: string[]
  image: { src: string; alt?: string } | null
  faqs: { q: string; a: string }[]
  sources: { label: string; url: string }[]
}
export type Check = { id: string; label: string; ok: boolean }
export type Score = { score: number; checks: Check[] }

const SITE_HOSTS = ['agenciaidp.com', 'www.agenciaidp.com']

const norm = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

const decode = (text: string) =>
  text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")

export const plainText = (html: string) => decode(html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()

export const wordCount = (html: string) => {
  const text = plainText(html)
  return text ? text.split(' ').length : 0
}

const tagTexts = (html: string, tag: string) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi'))].map((m) => plainText(m[1]))
const count = (html: string, re: RegExp) => html.match(re)?.length ?? 0

function links(html: string) {
  const hrefs = [...html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1].trim())
  const internal = hrefs.filter((h) => h.startsWith('/') || SITE_HOSTS.some((host) => h.includes(`//${host}`)))
  const external = hrefs.filter((h) => /^https?:\/\//i.test(h) && !SITE_HOSTS.some((host) => h.includes(`//${host}`)))
  return { internal: internal.length, external: external.length }
}

export function scoreContent(input: ScoreInput): { seo: Score; geo: Score; words: number } {
  const html = input.html || ''
  const text = plainText(html)
  const words = wordCount(html)
  const keyword = norm(input.keywords[0] ?? '')
  const has = (value: string) => Boolean(keyword) && norm(value).includes(keyword)
  const metaTitle = input.seoTitle || input.title
  const h2 = tagTexts(html, 'h2')
  const h3 = tagTexts(html, 'h3')
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0])
  const { internal, external } = links(html)
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.split(' ').length > 2)
  const avgSentence = sentences.length ? Math.round((sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length) * 10) / 10 : 0
  const firstParagraph = tagTexts(html, 'p')[0] ?? ''
  const firstWords = firstParagraph ? firstParagraph.split(' ').length : 0
  const figures = text.match(/(\$\s?\d[\d.,]*|\d[\d.,]*\s?(%|usd|cop|eur|€|millones|mil\b|billones|años|meses|semanas|días|horas|minutos|gb|mb|ms\b|x\b))/gi)?.length ?? 0

  const seoChecks: Check[] = [
    { id: 'keyword', label: 'Al menos 1 keyword objetivo', ok: Boolean(keyword) },
    { id: 'kwTitle', label: 'Keyword principal en el título', ok: has(input.title) },
    { id: 'kwMeta', label: 'Keyword principal en la meta description', ok: has(input.seoDescription) },
    { id: 'kwHeading', label: 'Keyword en un H2 o H3', ok: [...h2, ...h3].some(has) },
    { id: 'kwIntro', label: 'Keyword en los primeros 400 caracteres', ok: has(text.slice(0, 400)) },
    { id: 'titleLength', label: `Título entre 30 y 65 caracteres (actual: ${input.title.length})`, ok: input.title.length >= 30 && input.title.length <= 65 },
    { id: 'metaTitle', label: `Meta title de máximo 60 caracteres (actual: ${metaTitle.length})`, ok: metaTitle.length > 0 && metaTitle.length <= 60 },
    { id: 'metaDesc', label: `Meta description entre 120 y 160 caracteres (actual: ${input.seoDescription.length})`, ok: input.seoDescription.length >= 120 && input.seoDescription.length <= 160 },
    { id: 'excerpt', label: 'Extracto presente', ok: input.excerpt.trim().length >= 40 },
    { id: 'words', label: `Al menos 700 palabras (actual: ${words})`, ok: words >= 700 },
    { id: 'h2', label: `Al menos 2 subtítulos H2 (actual: ${h2.length})`, ok: h2.length >= 2 },
    { id: 'h3', label: 'Al menos 1 subtítulo H3', ok: h3.length >= 1 },
    { id: 'imgAlt', label: 'Imágenes del contenido con texto alternativo', ok: imgs.every((tag) => /\balt\s*=\s*["'][^"']+["']/i.test(tag)) },
    { id: 'cover', label: 'Portada con texto alternativo', ok: Boolean(input.image?.src && input.image.alt?.trim()) },
    { id: 'coverAlt', label: 'Texto alternativo de la portada incluye la keyword', ok: has(input.image?.alt ?? '') },
    { id: 'internal', label: `Al menos 1 enlace interno (actual: ${internal})`, ok: internal >= 1 },
    { id: 'external', label: `Al menos 1 enlace externo (actual: ${external})`, ok: external >= 1 || input.sources.length >= 1 },
    { id: 'slug', label: 'URL corta, con guiones y sin tildes', ok: /^[a-z0-9]+(-[a-z0-9]+)*$/.test(input.slug) && input.slug.length <= 75 },
  ]

  const geoChecks: Check[] = [
    { id: 'answer', label: 'Respuesta directa en el primer párrafo', ok: /<p[^>]*class=["'][^"']*answer/i.test(html) || (firstWords >= 20 && firstWords <= 80) },
    { id: 'questions', label: 'Encabezados en forma de pregunta', ok: [...h2, ...h3].some((h) => h.includes('?')) },
    { id: 'faq', label: `Bloque de preguntas frecuentes (actual: ${input.faqs.length})`, ok: input.faqs.length >= 2 },
    { id: 'lists', label: 'Al menos 2 listas', ok: count(html, /<(ul|ol)\b/gi) >= 2 },
    { id: 'table', label: 'Al menos una tabla comparativa', ok: /<table\b/i.test(html) },
    { id: 'sources', label: `Al menos 2 fuentes o citas externas (actual: ${input.sources.length + external})`, ok: input.sources.length + external >= 2 },
    { id: 'figures', label: `Al menos 3 datos cuantitativos (actual: ${figures})`, ok: figures >= 3 },
    { id: 'year', label: 'Menciona un año reciente (2024 o posterior)', ok: /\b20(2[4-9]|[3-9]\d)\b/.test(text) },
    { id: 'entity', label: 'Menciona Agencia IDP como entidad', ok: /agencia idp/i.test(text) },
    { id: 'sentences', label: `Frases de máximo 22 palabras en promedio (actual: ${avgSentence})`, ok: avgSentence > 0 && avgSentence <= 22 },
    { id: 'strong', label: 'Ideas clave resaltadas con negrita', ok: count(html, /<(strong|b)\b/gi) >= 3 },
    { id: 'conclusion', label: 'Resumen o conclusión explícita', ok: h2.some((h) => /conclusi|resumen|en s[ií]ntesis|lo esencial|claves/i.test(h)) },
    { id: 'definition', label: 'La keyword aparece junto a una definición', ok: Boolean(keyword) && new RegExp(`${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+(es|son|significa|consiste|se refiere)`).test(norm(text)) },
  ]

  const score = (checks: Check[]) => ({ score: Math.round((checks.filter((c) => c.ok).length / checks.length) * 100), checks })
  return { seo: score(seoChecks), geo: score(geoChecks), words }
}
