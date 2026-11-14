import type { Metadata } from 'next'
import { BlogList } from '@/components/blog-list'
import { buildMetadata, getSeo } from '@/lib/content'

export const revalidate = 3600

export const metadata: Metadata = buildMetadata(getSeo('blog'), '/blog/')

export default function BlogPage() {
  return <BlogList page={1} />
}
