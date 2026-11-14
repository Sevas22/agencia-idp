import type { Metadata } from 'next'
import { HomePage } from '@/components/home-page'
import { buildMetadata, getSeo } from '@/lib/content'
import { setLang } from '@/lib/lang'

export const revalidate = 3600

export function generateMetadata(): Metadata {
  setLang('en')
  return buildMetadata(getSeo('home'), '/en/')
}

export default function Page() {
  setLang('en')
  return <HomePage />
}
