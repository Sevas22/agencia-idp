// Crea las tablas del blog en Postgres (Neon) e importa los artículos que hoy viven en content/.
// Uso: node --env-file=.env.local scripts/db-setup.mjs
// Es seguro repetirlo: no sobrescribe artículos que ya existan en la base.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) throw new Error('Falta DATABASE_URL en .env.local')
const sql = neon(process.env.DATABASE_URL)
const root = process.cwd()
const read = (file) => JSON.parse(readFileSync(path.join(root, 'content', file), 'utf8'))

await sql`create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  html text not null default '',
  category text not null default 'Blog',
  status text not null default 'draft' check (status in ('draft', 'published')),
  keywords text[] not null default '{}',
  seo_title text not null default '',
  seo_description text not null default '',
  image jsonb,
  faqs jsonb not null default '[]',
  sources jsonb not null default '[]',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)`
await sql`create index if not exists blog_posts_status_published on blog_posts (status, published_at desc)`
await sql`create table if not exists blog_post_revisions (
  id bigserial primary key,
  post_id uuid not null references blog_posts(id) on delete cascade,
  snapshot jsonb not null,
  created_at timestamptz not null default now()
)`
await sql`create index if not exists blog_post_revisions_post on blog_post_revisions (post_id, created_at desc)`
await sql`create table if not exists blog_media (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  mime text not null,
  size int not null,
  bytes bytea not null,
  created_at timestamptz not null default now()
)`

// Misma lógica de lib/content.ts: índice importado + versiones optimizadas, sin los duplicados fusionados.
const blogTs = readFileSync(path.join(root, 'lib', 'blog.ts'), 'utf8')
const mergedBlock = blogTs.slice(blogTs.indexOf('export const mergedPosts'), blogTs.indexOf('}', blogTs.indexOf('export const mergedPosts')))
const merged = new Set([...mergedBlock.matchAll(/'([^']+)':/g)].map((m) => m[1]))
const seoDir = path.join(root, 'content', 'blog-seo')
const overrides = new Map(existsSync(seoDir) ? readdirSync(seoDir).filter((f) => f.endsWith('.json')).map((f) => { const p = read(`blog-seo/${f}`); return [p.slug, p] }) : [])
const index = read('posts-index.json').filter((p) => !merged.has(p.slug))
const slugs = [...new Set([...index.map((p) => p.slug), ...overrides.keys()])]

let inserted = 0
for (const slug of slugs) {
  const file = path.join(root, 'content', 'posts', `${slug}.json`)
  const base = existsSync(file) ? read(`posts/${slug}.json`) : {}
  const meta = index.find((p) => p.slug === slug) ?? {}
  const post = { ...meta, ...base, ...overrides.get(slug) }
  const seo = post.seo ?? {}
  const rows = await sql`insert into blog_posts (slug, title, excerpt, html, category, status, seo_title, seo_description, image, faqs, sources, published_at, created_at, updated_at)
    values (${slug}, ${post.title}, ${post.excerpt ?? ''}, ${post.html ?? ''}, ${post.category ?? 'Blog'}, 'published', ${seo.title ?? ''}, ${seo.description ?? ''},
      ${post.image ? JSON.stringify(post.image) : null}, ${JSON.stringify(post.faqs ?? [])}, ${JSON.stringify(post.sources ?? [])},
      ${post.date}, ${post.date}, ${post.modified ?? post.date})
    on conflict (slug) do nothing returning id`
  inserted += rows.length
}
const [{ count }] = await sql`select count(*)::int as count from blog_posts`
console.log(`Artículos encontrados: ${slugs.length}. Insertados ahora: ${inserted}. Total en la base: ${count}.`)
