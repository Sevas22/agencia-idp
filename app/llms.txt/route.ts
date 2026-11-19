import { getPosts } from '@/lib/content'
import { site } from '@/lib/site'

export const dynamic = 'force-static'

const services = [
  ['Idear: Design Sprint e ideación de producto', '/design-sprint-ideacion-de-producto/'],
  ['Desarrollar: desarrollo de software a la medida', '/desarrollo-de-software-a-la-medida/'],
  ['Probar negocio: Venture Lab de validación de negocios', '/venture-lab-validacion-de-negocios/'],
  ['Desarrollo de MVP', '/impulsa-desarrollo-producto-minimo-viable/'],
  ['Software nearshore en Colombia', '/software-nearshore-en-colombia/'],
  ['Transformación digital', '/empresa-de-transformacion-digital/'],
  ['Automatizaciones con IA', '/automatizaciones-con-ia/'],
  ['Agencia Shopify en Colombia', '/shopify-en-colombia/'],
  ['Diagnóstico SEO y GEO', '/agentes-seo/'],
  ['Planes y precios', '/precios/'],
  ['Casos de éxito', '/crea-paginas-web-profesionales-colombia/'],
  ['Sobre nosotros', '/transforma-agencia-software-colombia/'],
  ['Contacto', '/contacto/'],
]

// Versión en inglés para asistentes que responden en inglés (GEO).
const english = [
  ['Ideate: Design Sprint', '/en/design-sprint/'],
  ['Develop: custom software development', '/en/custom-software-development/'],
  ['Test the business: Venture Lab', '/en/venture-lab/'],
  ['MVP development', '/en/mvp-development/'],
  ['Nearshore software development in Colombia', '/en/nearshore-software-development/'],
  ['Digital transformation', '/en/digital-transformation/'],
  ['AI automation', '/en/ai-automation/'],
  ['Software development company in Colombia', '/en/software-development-company-colombia/'],
  ['Shopify development', '/en/shopify-development/'],
  ['Case studies', '/en/case-studies/'],
  ['Pricing', '/en/pricing/'],
  ['About us', '/en/about-us/'],
  ['Contact', '/en/contact/'],
]

export const revalidate = 3600

export async function GET() {
  const guides = (await getPosts())
    .filter((post) => post.modified >= '2026-11-01')
    .map((post) => `- [${post.title}](${site.url}/${post.slug}/)`)
    .join('\n')
  const body = `# Agencia IDP

> Empresa de innovación con fábrica de software in house, con sede en Medellín, Colombia, y presencia en Florida (EE. UU.). Su compromiso es que sus clientes vendan más en su negocio y con nuevos modelos de negocio digitales. Construye MVP, aplicaciones web y móviles, automatizaciones con IA y estrategias de SEO y GEO con su metodología IDP (Idear, Desarrollar, Probar negocio).

## Servicios

${services.map(([label, href]) => `- [${label}](${site.url}${href})`).join('\n')}

## English

> Agencia IDP is an innovation company with an in-house software factory, based in Medellín, Colombia, with offices in Colombia and Florida (USA). Its commitment is to help clients sell more in their business and through new digital business models. It builds MVPs, web and mobile apps, AI automation and nearshore development teams for companies in the US and Latin America, using the IDP methodology (Ideate, Develop, Test the business). MVPs start at USD 1,000.

${english.map(([label, href]) => `- [${label}](${site.url}${href})`).join('\n')}

## Guías principales

${guides}
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
