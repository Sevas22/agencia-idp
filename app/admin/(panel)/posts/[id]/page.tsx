import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostEditor } from '@/components/admin/post-editor'
import { countRevisions, findById } from '@/lib/posts-repo'

export const metadata: Metadata = { title: 'Editar post' }

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await findById(id)
  if (!post) notFound()
  const revisions = await countRevisions(id)
  // Las fechas se formatean aquí para que servidor y navegador muestren exactamente lo mismo.
  const format = (iso: string, time = false) => new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', ...(time ? { timeStyle: 'short' } : {}), timeZone: 'America/Bogota' }).format(new Date(iso))
  return <PostEditor post={post} revisions={revisions.count} dates={{ created: format(post.createdAt), updated: format(post.updatedAt, true) }} />
}
