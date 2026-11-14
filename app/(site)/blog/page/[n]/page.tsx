import type { Metadata } from 'next'
import { BlogList } from '@/components/blog-list'
import { buildMetadata, getPosts, getSeo, POSTS_PER_PAGE } from '@/lib/content'

export const revalidate = 3600

type Props = { params: Promise<{ n: string }> }

export async function generateStaticParams() {
  const pages = Math.ceil((await getPosts()).length / POSTS_PER_PAGE)
  return Array.from({ length: pages - 1 }, (_, i) => ({ n: String(i + 2) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params
  const seo = getSeo('blog')
  return buildMetadata({ ...seo, title: `Blog, página ${n} | Agencia IDP` }, `/blog/page/${n}/`)
}

export default async function BlogPaged({ params }: Props) {
  const { n } = await params
  return <BlogList page={Number(n)} />
}
