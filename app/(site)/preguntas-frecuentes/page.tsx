import type { Metadata } from 'next'
import { FaqPage, faqSeo } from '@/components/faq-page'
import { buildMetadata } from '@/lib/content'

export const metadata: Metadata = buildMetadata(faqSeo('es'), '/preguntas-frecuentes/')

export default function Page() {
  return <FaqPage />
}
