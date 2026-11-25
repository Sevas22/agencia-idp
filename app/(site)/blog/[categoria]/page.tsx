import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogCategoryPage } from '@/components/blog-category'
import { blogCategories, categoryBySlug, categoryPath } from '@/lib/blog-categories'
import { buildMetadata, getPosts } from '@/lib/content'

export const revalidate = 3600
// Solo existen las categorías definidas en lib/blog-categories.ts.
export const dynamicParams = false

type Props = { params: Promise<{ categoria: string }> }

export function generateStaticParams() {
  return blogCategories.map((c) => ({ categoria: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = categoryBySlug((await params).categoria)
  if (!category) return {}
  return buildMetadata({ title: category.seoTitle, description: category.seoDescription, image: null }, categoryPath(category))
}

export default async function CategoryPage({ params }: Props) {
  const category = categoryBySlug((await params).categoria)
  if (!category) notFound()
  const allPosts = await getPosts()
  const posts = allPosts.filter((p) => p.category === category.name)
  return <BlogCategoryPage category={category} posts={posts} allPosts={allPosts} />
}
