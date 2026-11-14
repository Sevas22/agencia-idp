// Traducción del contenido de páginas a inglés conservando la misma estructura de bloques.
//
//   node scripts/i18n-content.mjs extract <slug>   → lista los textos traducibles (ruta → texto)
//   node scripts/i18n-content.mjs apply <slug>     → crea content/en/pages/<slug>.json desde content/en/strings/<slug>.json
//   node scripts/i18n-content.mjs check            → avisa de textos sin traducir
//
// Los componentes leen los bloques por posición, así que el inglés debe tener exactamente la misma forma.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const TEXT_KEYS = new Set(['text', 'html', 'title', 'kicker', 'cta', 'q', 'a', 'role', 'description', 'desc', 'name', 'paragraphs', 'items', 'intro', 'about', 'techIntro', 'focus', 'focusEnd', 'stack', 'work', 'testimonials', 'label'])
const SKIP_KEYS = new Set(['src', 'href', 'id', 't', 'image', 'images', 'width', 'height', 'alt', 'slug', 'modified', 'value', 'suffix', 'price', 'level', 'pct'])
// Nombres propios que no se traducen (personas en tarjetas de equipo y citas).
const KEEP_NAME_TYPES = new Set(['person', 'quote'])

// Mismo mapa que lib/i18n.ts (es → en) para traducir los enlaces internos del contenido.
const routes = {
  '/': '/en/',
  '/transforma-agencia-software-colombia/': '/en/about-us/',
  '/impulsa-desarrollo-producto-minimo-viable/': '/en/mvp-development/',
  '/software-nearshore-en-colombia/': '/en/nearshore-software-development/',
  '/empresa-de-transformacion-digital/': '/en/digital-transformation/',
  '/automatizaciones-con-ia/': '/en/ai-automation/',
  '/crea-paginas-web-profesionales-colombia/': '/en/case-studies/',
  '/contacto/': '/en/contact/',
  '/precios/': '/en/pricing/',
  '/shopify-en-colombia/': '/en/shopify-development/',
  '/agencia-de-software-en-colombia/': '/en/software-development-company-colombia/',
  '/herramientas/': '/en/tools/',
}
const localize = (href) => {
  if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('/en/')) return href
  const [p, hash] = href.split('#')
  const withSlash = (p || '/').endsWith('/') ? p || '/' : `${p}/`
  const en = routes[withSlash]
  return en ? `${en}${hash !== undefined ? `#${hash}` : ''}` : href
}

const fileFor = (slug) => (slug.endsWith('.json') ? slug : `pages/${slug}.json`)
const read = (rel) => JSON.parse(readFileSync(path.join(root, 'content', rel), 'utf8'))

function walk(node, at, out, parentType) {
  if (Array.isArray(node)) return node.forEach((v, i) => walk(v, `${at}[${i}]`, out, parentType))
  if (!node || typeof node !== 'object') return
  const type = node.t ?? parentType
  for (const [key, value] of Object.entries(node)) {
    if (SKIP_KEYS.has(key)) continue
    const here = at ? `${at}.${key}` : key
    if (key === 'name' && KEEP_NAME_TYPES.has(type)) continue
    if (typeof value === 'string') {
      if (TEXT_KEYS.has(key) && value.trim() && !/^(https?:|\/|#)/.test(value)) out.push([here, value])
    } else if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
      if (TEXT_KEYS.has(key)) value.forEach((v, i) => v.trim() && out.push([`${here}[${i}]`, v]))
    } else walk(value, here, out, type)
  }
}

const setAt = (obj, at, value) => {
  const parts = at.match(/[^.[\]]+/g)
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) cur = cur[/^\d+$/.test(parts[i]) ? Number(parts[i]) : parts[i]]
  const last = parts.at(-1)
  cur[/^\d+$/.test(last) ? Number(last) : last] = value
}

const localizeHrefs = (node) => {
  if (Array.isArray(node)) return node.forEach(localizeHrefs)
  if (!node || typeof node !== 'object') return
  for (const [key, value] of Object.entries(node)) {
    if (key === 'href') node[key] = localize(value)
    else if (typeof value === 'string' && key === 'html') node[key] = value.replace(/href="(\/[^"]*)"/g, (_, h) => `href="${localize(h)}"`)
    else localizeHrefs(value)
  }
}

const [mode, slug] = process.argv.slice(2)
if (mode === 'extract') {
  const out = []
  walk(read(fileFor(slug)), '', out)
  console.log(JSON.stringify(Object.fromEntries(out), null, 1))
} else if (mode === 'apply') {
  const rel = fileFor(slug)
  const data = read(rel)
  const strings = JSON.parse(readFileSync(path.join(root, 'content', 'en', 'strings', `${slug.replace(/\.json$/, '')}.json`), 'utf8'))
  const expected = []
  walk(data, '', expected)
  const missing = expected.filter(([at]) => !(at in strings)).map(([at]) => at)
  for (const [at, value] of Object.entries(strings)) setAt(data, at, value)
  localizeHrefs(data)
  const target = path.join(root, 'content', 'en', rel)
  mkdirSync(path.dirname(target), { recursive: true })
  writeFileSync(target, `${JSON.stringify(data, null, 1)}\n`)
  console.log(`ok ${rel}${missing.length ? ` · sin traducir: ${missing.join(', ')}` : ''}`)
} else {
  console.log('uso: extract|apply <slug>')
}
