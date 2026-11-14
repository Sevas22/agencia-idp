/** Grupos temáticos del blog: cada artículo enlaza a su servicio y a sus artículos hermanos. */
export type Cluster = { key: string; match: RegExp; service: { href: string; label: string; text: string } }

export const clusters: Cluster[] = [
  { key: 'seo', match: /\bseo\b|\bgeo\b|posicionamiento/i, service: { href: '/agentes-seo/', label: 'Diagnóstico SEO y GEO', text: 'Mide cómo te ven Google y las IA con un informe de tu sitio.' } },
  { key: 'nearshore', match: /nearshore|outsourcing|tercerizar/i, service: { href: '/software-nearshore-en-colombia/', label: 'Software nearshore en Colombia', text: 'Equipos de desarrollo en tu zona horaria, dedicados o por proyecto.' } },
  { key: 'ecommerce', match: /shopify|e-?commerce|tienda online/i, service: { href: '/shopify-en-colombia/', label: 'Agencia Shopify en Colombia', text: 'Tiendas Shopify enfocadas en ventas y escalabilidad.' } },
  { key: 'ia', match: /\bias?\b|inteligencia artificial|chatgpt|agentes|automatiz/i, service: { href: '/automatizaciones-con-ia/', label: 'Automatizaciones con IA', text: 'Automatizamos citas, atención, ventas, cartera y seguimiento.' } },
  { key: 'mvp', match: /mvp|m[ií]nimo viable|prueba de concepto|lean|validar|venture|startup|pilotos|vibe coding|experimentaci|riesgo/i, service: { href: '/impulsa-desarrollo-producto-minimo-viable/', label: 'Desarrollo de MVP', text: 'Valida tu idea con un producto real, desde $1000 USD.' } },
  { key: 'transformacion', match: /transformaci[oó]n digital|pymes|cloud|roi/i, service: { href: '/empresa-de-transformacion-digital/', label: 'Transformación digital', text: 'Planificación, descubrimiento e investigación para tu empresa.' } },
  { key: 'software', match: /.*/, service: { href: '/agencia-de-software-en-colombia/', label: 'Desarrollo de software a la medida', text: 'Aplicaciones web y móviles, integraciones y software a la medida.' } },
]

export const clusterOf = (text: string) => clusters.find((c) => c.match.test(text)) as Cluster

/** Artículos casi idénticos: la URL secundaria redirige con 301 a la principal. */
export const mergedPosts: Record<string, string> = {
  'validar-idea-negocio-mvp-30-dias-colombia': 'validar-idea-de-negocio-mvp-30-dias',
  'cloud-computing-pymes-colombia-aws-google-azure-2026': 'cloud-computing-pymes-colombianas-aws-google-cloud-azure',
  'ux-design-experiencia-usuario-aumenta-ventas': 'ux-design-diseno-experiencia-usuario-aumenta-ventas',
  'agentes-de-ia-que-son-como-implementar-empresa-2026-2': 'agentes-de-ia-que-son-como-implementar-empresa-2026',
}

/** Devuelve a cada h2 el ancla que espera el índice del artículo, que se perdió al limpiar el HTML. */
export function withAnchors(html: string) {
  const targets = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1])
  const headings = html.match(/<h2>/g)?.length ?? 0
  const offset = Math.max(headings - targets.length, 0)
  let index = 0
  return html.replace(/<h2>/g, () => {
    index += 1
    const target = targets[index - 1 - offset]
    return `<h2 id="${target ?? `s${index}`}">`
  })
}
