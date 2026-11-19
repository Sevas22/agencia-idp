import { site } from './site'

/**
 * Idiomas del sitio. El español vive en la raíz (como en WordPress) y el inglés en /en/.
 * Cada página traducida tiene una clave común que une sus dos URLs para el hreflang.
 */
export type Lang = 'es' | 'en'

export const pick = <T,>(lang: Lang, es: T, en: T): T => (lang === 'en' ? en : es)

export const routes = {
  home: ['/', '/en/'],
  about: ['/transforma-agencia-software-colombia/', '/en/about-us/'],
  mvp: ['/impulsa-desarrollo-producto-minimo-viable/', '/en/mvp-development/'],
  nearshore: ['/software-nearshore-en-colombia/', '/en/nearshore-software-development/'],
  transformation: ['/empresa-de-transformacion-digital/', '/en/digital-transformation/'],
  automation: ['/automatizaciones-con-ia/', '/en/ai-automation/'],
  cases: ['/crea-paginas-web-profesionales-colombia/', '/en/case-studies/'],
  contact: ['/contacto/', '/en/contact/'],
  pricing: ['/precios/', '/en/pricing/'],
  shopify: ['/shopify-en-colombia/', '/en/shopify-development/'],
  colombia: ['/agencia-de-software-en-colombia/', '/en/software-development-company-colombia/'],
  tools: ['/herramientas/', '/en/tools/'],
  // Fases de la metodología IDP, cada una con su página de servicio.
  ideate: ['/design-sprint-ideacion-de-producto/', '/en/design-sprint/'],
  develop: ['/desarrollo-de-software-a-la-medida/', '/en/custom-software-development/'],
  validate: ['/venture-lab-validacion-de-negocios/', '/en/venture-lab/'],
} as const satisfies Record<string, readonly [string, string]>

export type RouteKey = keyof typeof routes

const entries = Object.entries(routes) as [RouteKey, readonly [string, string]][]
const withSlash = (p: string) => (p.endsWith('/') ? p : `${p}/`)

/** Ruta de una página en el idioma pedido. */
export const pathOf = (key: RouteKey, lang: Lang) => routes[key][lang === 'en' ? 1 : 0]

/** Clave de la página a partir de su ruta (en cualquiera de los dos idiomas). */
export const keyOf = (pathname: string): RouteKey | undefined => {
  const p = withSlash(pathname.split(/[?#]/)[0])
  return entries.find(([, pair]) => pair[0] === p || pair[1] === p)?.[0]
}

export const langOf = (pathname: string): Lang => (pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es')

/** URL equivalente en el otro idioma; si la página no está traducida, lleva al inicio de ese idioma. */
export const counterpart = (pathname: string, target: Lang) => {
  const key = keyOf(pathname)
  return key ? pathOf(key, target) : pathOf('home', target)
}

/**
 * Convierte un enlace interno del contenido en español a su versión en inglés cuando existe.
 * Conserva el ancla (#agenda, #servicios). Los enlaces sin traducción (blog, herramientas en español) se dejan igual.
 */
export const localize = (href: string, lang: Lang) => {
  if (lang === 'es' || !href.startsWith('/') || href.startsWith('/en/')) return href
  const [pathPart, hash] = href.split('#')
  const key = keyOf(pathPart || '/')
  if (!key) return href
  return `${pathOf(key, 'en')}${hash !== undefined ? `#${hash}` : ''}`
}

/** hreflang de una página traducida: es, en y x-default (español, el mercado principal). */
export const languagesOf = (key: RouteKey) => ({
  es: `${site.url}${routes[key][0]}`,
  en: `${site.url}${routes[key][1]}`,
  'x-default': `${site.url}${routes[key][0]}`,
})

/** Slugs de las páginas en inglés que se generan en /en/[slug]/. */
export const enSlugs = entries.filter(([key]) => key !== 'home').map(([key, pair]) => ({ key, slug: pair[1].replace(/^\/en\/|\/$/g, '') }))
