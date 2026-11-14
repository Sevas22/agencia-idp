import type { Metadata } from 'next'
import { PricingPage } from '@/components/pricing-page'
import { buildMetadata, getSeo } from '@/lib/content'

export const metadata: Metadata = buildMetadata(getSeo('precios'), '/precios/')

export default function Page() {
  return <PricingPage />
}
