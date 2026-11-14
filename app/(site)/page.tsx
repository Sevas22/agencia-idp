import type { Metadata } from 'next'
import { HomePage } from '@/components/home-page'
import { buildMetadata, getSeo } from '@/lib/content'

export const revalidate = 3600

export const metadata: Metadata = buildMetadata(getSeo('home'), '/')

export default function Page() {
  return <HomePage />
}
