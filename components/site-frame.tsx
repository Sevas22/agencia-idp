import { Analytics } from '@vercel/analytics/next'
import type { ReactNode } from 'react'
import { Integrations } from '@/components/integrations'
import { LangProvider } from '@/components/lang-context'
import { Motion } from '@/components/motion'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { pick, type Lang } from '@/lib/i18n'
import { site, socials } from '@/lib/site'

/** Datos estructurados de la empresa: una sola entidad para los dos idiomas. */
const organization = {
  '@context': 'https://schema.org',
  '@type': ['ProfessionalService', 'Organization'],
  '@id': `${site.url}/#organization`,
  name: site.legalName,
  alternateName: [site.name, 'IDP Agency'],
  url: site.url,
  logo: `${site.url}/brand/logo-agencia-idp.webp`,
  image: `${site.url}/brand/logo-agencia-idp.webp`,
  email: site.email,
  telephone: site.phone,
  address: { '@type': 'PostalAddress', addressLocality: 'Medellín', addressRegion: 'Antioquia', addressCountry: 'CO' },
  areaServed: ['CO', 'US', 'MX', 'DO', 'CR', 'ES', 'BR'],
  knowsLanguage: ['es', 'en'],
  slogan: 'Impulsamos tus ideas',
  description: 'Empresa de innovación con fábrica de software in house en Colombia. Su compromiso es que sus clientes vendan más en su negocio y con nuevos modelos de negocio digitales.',
  sameAs: socials.filter((s) => !s.href.includes('wa.link')).map((s) => s.href),
  openingHours: ['Mo,Tu,We,Th,Fr,Sa,Su 09:00-17:00'],
}

const websiteOf = (lang: Lang) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${site.url}${pick(lang, '/', '/en/')}#website`,
  url: `${site.url}${pick(lang, '/', '/en/')}`,
  name: site.name,
  alternateName: pick(lang, 'Empresa de innovación en Medellín', 'Innovation company in Colombia'),
  description: pick(
    lang,
    'Empresa de innovación con fábrica de software in house. Ayudamos a nuestros clientes a vender más en su negocio y con nuevos modelos de negocio digitales.',
    'Innovation company with an in-house software factory. We help clients sell more in their business and through new digital business models.',
  ),
  inLanguage: pick(lang, 'es-CO', 'en'),
  publisher: { '@id': `${site.url}/#organization` },
})

/** Marco del sitio público: menú, pie, datos estructurados, analítica y chat. El panel /admin no lo usa. */
export function SiteFrame({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <LangProvider lang={lang}>
      <a className="skip-link" href="#contenido">
        {pick(lang, 'Saltar al contenido', 'Skip to content')}
      </a>
      <SiteHeader />
      <main id="contenido">{children}</main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([organization, websiteOf(lang)]) }} />
      <Integrations />
      <Motion />
      {/* Vercel Analytics solo funciona alojado en Vercel; en Dokploy no se carga. */}
      {process.env.VERCEL && <Analytics />}
    </LangProvider>
  )
}
