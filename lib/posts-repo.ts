import 'server-only'
import { neon } from '@neondatabase/serverless'
import type { Faq, Img } from './content'

/** Artículo tal como vive en la tabla blog_posts. */
export type DbPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  html: string
  category: string
  status: 'draft' | 'published'
  keywords: string[]
  seoTitle: string
  seoDescription: string
  image: Img | null
  faqs: Faq[]
  sources: { label: string; url: string }[]
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export type PostInput = Omit<DbPost, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'> & { publishedAt?: string | null }

export const hasDatabase = () => Boolean(process.env.DATABASE_URL)

const db = () => {
  if (!process.env.DATABASE_URL) throw new Error('Falta DATABASE_URL')
  return neon(process.env.DATABASE_URL)
}

type Row = Record<string, unknown>
const iso = (value: unknown) => (value ? new Date(value as string).toISOString() : null)

const toPost = (r: Row): DbPost => ({
  id: r.id as string,
  slug: r.slug as string,
  title: r.title as string,
  excerpt: r.excerpt as string,
  html: (r.html as string) ?? '',
  category: r.category as string,
  status: r.status as DbPost['status'],
  keywords: (r.keywords as string[]) ?? [],
  seoTitle: r.seo_title as string,
  seoDescription: r.seo_description as string,
  image: (r.image as Img | null) ?? null,
  faqs: (r.faqs as Faq[]) ?? [],
  sources: (r.sources as DbPost['sources']) ?? [],
  publishedAt: iso(r.published_at),
  createdAt: iso(r.created_at) as string,
  updatedAt: iso(r.updated_at) as string,
})

/** Publicados, del más reciente al más antiguo (sin el HTML, para listados). */
export async function listPublished() {
  const rows = await db()`select id, slug, title, excerpt, '' as html, category, status, keywords, seo_title, seo_description, image, '[]'::jsonb as faqs, '[]'::jsonb as sources, published_at, created_at, updated_at
    from blog_posts where status = 'published' order by published_at desc nulls last`
  return rows.map(toPost)
}

export async function findPublished(slug: string) {
  const rows = await db()`select * from blog_posts where slug = ${slug} and status = 'published' limit 1`
  return rows[0] ? toPost(rows[0]) : null
}

/** Todos, para el panel. Incluye el HTML porque el listado calcula los puntajes SEO y GEO. */
export async function listAll() {
  const rows = await db()`select * from blog_posts order by updated_at desc`
  return rows.map(toPost)
}

export async function findById(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const rows = await db()`select * from blog_posts where id = ${id} limit 1`
  return rows[0] ? toPost(rows[0]) : null
}

export async function slugTaken(slug: string, exceptId?: string) {
  const rows = exceptId
    ? await db()`select 1 from blog_posts where slug = ${slug} and id <> ${exceptId} limit 1`
    : await db()`select 1 from blog_posts where slug = ${slug} limit 1`
  return rows.length > 0
}

export async function createPost(input: PostInput) {
  const publishedAt = input.status === 'published' ? (input.publishedAt ?? new Date().toISOString()) : (input.publishedAt ?? null)
  const rows = await db()`insert into blog_posts (slug, title, excerpt, html, category, status, keywords, seo_title, seo_description, image, faqs, sources, published_at)
    values (${input.slug}, ${input.title}, ${input.excerpt}, ${input.html}, ${input.category}, ${input.status}, ${input.keywords}, ${input.seoTitle}, ${input.seoDescription},
      ${input.image ? JSON.stringify(input.image) : null}, ${JSON.stringify(input.faqs)}, ${JSON.stringify(input.sources)}, ${publishedAt})
    returning *`
  return toPost(rows[0])
}

/** Guarda una copia de la versión anterior antes de actualizar, para poder recuperarla. */
export async function updatePost(id: string, input: PostInput) {
  const previous = await findById(id)
  if (!previous) throw new Error('El artículo no existe')
  const publishedAt = input.status === 'published' ? (previous.publishedAt ?? new Date().toISOString()) : previous.publishedAt
  const sql = db()
  await sql`insert into blog_post_revisions (post_id, snapshot) values (${id}, ${JSON.stringify(previous)})`
  const rows = await sql`update blog_posts set slug = ${input.slug}, title = ${input.title}, excerpt = ${input.excerpt}, html = ${input.html}, category = ${input.category},
      status = ${input.status}, keywords = ${input.keywords}, seo_title = ${input.seoTitle}, seo_description = ${input.seoDescription},
      image = ${input.image ? JSON.stringify(input.image) : null}, faqs = ${JSON.stringify(input.faqs)}, sources = ${JSON.stringify(input.sources)},
      published_at = ${publishedAt}, updated_at = now()
    where id = ${id} returning *`
  return { post: toPost(rows[0]), previous }
}

export async function deletePost(id: string) {
  const rows = await db()`delete from blog_posts where id = ${id} returning slug`
  return (rows[0]?.slug as string | undefined) ?? null
}

export async function countRevisions(id: string) {
  const rows = await db()`select count(*)::int as n, max(created_at) as last from blog_post_revisions where post_id = ${id}`
  return { count: (rows[0]?.n as number) ?? 0, last: iso(rows[0]?.last) }
}

/** Imágenes subidas desde el panel. Se guardan en la base para no depender del disco del servidor. */
export async function saveMedia(filename: string, mime: string, bytes: Uint8Array) {
  const rows = await db()`insert into blog_media (filename, mime, size, bytes) values (${filename}, ${mime}, ${bytes.byteLength}, ${bytes}) returning id`
  return rows[0].id as string
}

export async function findMedia(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const rows = await db()`select mime, bytes from blog_media where id = ${id} limit 1`
  return rows[0] ? { mime: rows[0].mime as string, bytes: rows[0].bytes as Uint8Array } : null
}
