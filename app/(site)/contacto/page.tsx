import type { Metadata } from 'next'
import { ContactPage } from '@/components/contact-page'
import { buildMetadata, getSeo } from '@/lib/content'

export const metadata: Metadata = buildMetadata(getSeo('contacto'), '/contacto/')

export default function Page() {
  return <ContactPage />
}
