import { findMedia } from '@/lib/posts-repo'

/** Sirve las imágenes subidas desde el panel. Nunca cambian, así que se guardan en caché un año. */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const media = await findMedia(id)
  if (!media) return new Response('No encontrada', { status: 404 })
  return new Response(Buffer.from(media.bytes), {
    headers: {
      'Content-Type': media.mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'",
    },
  })
}
