import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContactPage } from '@/components/contact-page'
import { nxPages } from '@/components/nx-subpages'
import { PhasePage, phaseMetadata, type PhaseKey } from '@/components/phase-page'
import { PricingPage } from '@/components/pricing-page'
import { FaqPage, faqSeo } from '@/components/faq-page'
import { buildMetadata, getPage, getSeo } from '@/lib/content'
import { enSlugs, routes, type RouteKey } from '@/lib/i18n'
import { setLang } from '@/lib/lang'

// Solo existen las páginas traducidas; cualquier otro slug en /en/ es 404.
export const dynamicParams = false

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return enSlugs.map(({ slug }) => ({ slug }))
}

const phaseKeys: RouteKey[] = ['ideate', 'develop', 'validate']
const keyFor = (slug: string): RouteKey | undefined => enSlugs.find((s) => s.slug === slug)?.key
// Slug en español (archivo de contenido y componente) de cada página traducida.
const esSlugOf = (key: RouteKey) => routes[key][0].replace(/^\/|\/$/g, '')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  setLang('en')
  const { slug } = await params
  const key = keyFor(slug)
  if (!key) return {}
  const pathname = routes[key][1]
  if (key === 'contact') return buildMetadata(getSeo('contacto'), pathname)
  if (key === 'pricing') return buildMetadata(getSeo('precios'), pathname)
  if (key === 'faq') return buildMetadata(faqSeo('en'), pathname)
  if (phaseKeys.includes(key)) return phaseMetadata(key as PhaseKey, 'en')
  return buildMetadata(getPage(esSlugOf(key)).seo, pathname)
}

export default async function EnglishPage({ params }: Props) {
  setLang('en')
  const { slug } = await params
  const key = keyFor(slug)
  if (!key) notFound()
  if (key === 'contact') return <ContactPage />
  if (key === 'pricing') return <PricingPage />
  if (key === 'faq') return <FaqPage />
  if (phaseKeys.includes(key)) return <PhasePage phase={key as PhaseKey} />
  const esSlug = esSlugOf(key)
  const Composed = nxPages[esSlug]
  if (!Composed) notFound()
  return <Composed page={getPage(esSlug)} />
}
