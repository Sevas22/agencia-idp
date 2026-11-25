'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import sanitizeHtml from 'sanitize-html'
import { checkCredentials, endSession, requireAdmin, startSession } from '@/lib/admin-auth'
import { createPost, deletePost, findById, slugTaken, updatePost, type PostInput } from '@/lib/posts-repo'
import { getPageSlugs } from '@/lib/content'

export type LoginState = { error?: string; email?: string }

export async function loginAction(_: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get('email') ?? '')
  const result = await checkCredentials(email, String(form.get('password') ?? ''))
  // El correo se devuelve para no obligar a escribirlo de nuevo tras un error.
  if (!result.ok) return { error: result.error, email: email.slice(0, 200) }
  await startSession()
  redirect('/admin/')
}

export async function logoutAction() {
  await endSession()
  redirect('/admin/login/')
}

/** Solo se permite HTML de contenido; se quitan scripts, eventos y enlaces peligrosos. */
const cleanHtml = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: ['h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'mark', 'small', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'img', 'figure', 'figcaption', 'iframe', 'span', 'div', 'details', 'summary'],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
      iframe: ['src', 'title', 'width', 'height', 'allow', 'allowfullscreen', 'loading'],
      th: ['colspan', 'rowspan', 'scope'],
      td: ['colspan', 'rowspan'],
      '*': ['id', 'class', 'style'],
    },
    allowedStyles: { '*': { 'text-align': [/^(left|right|center|justify)$/] } },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https'] },
    allowProtocolRelative: false,
    allowedIframeHostnames: ['www.youtube.com', 'www.youtube-nocookie.com'],
    transformTags: { a: (tag, attribs) => ({ tagName: tag, attribs: attribs.target === '_blank' ? { ...attribs, rel: 'noopener noreferrer' } : attribs }) },
  }).trim()

const text = (value: unknown, max: number) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max)
const isUrl = (value: string) => /^https?:\/\/[^\s]+$/i.test(value)

export type SaveResult = { ok: true; id: string; message: string } | { ok: false; error: string }

export async function savePostAction(id: string | null, raw: PostInput): Promise<SaveResult> {
  await requireAdmin()

  const slug = text(raw.slug, 120).toLowerCase()
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return { ok: false, error: 'La URL solo puede tener letras sin tilde, números y guiones.' }
  if (getPageSlugs().includes(slug) || ['blog', 'admin', 'contacto', 'precios'].includes(slug)) return { ok: false, error: 'Esa URL ya la usa una página del sitio.' }
  if (await slugTaken(slug, id ?? undefined)) return { ok: false, error: 'Ya existe otro artículo con esa URL.' }

  const title = text(raw.title, 200)
  if (title.length < 5) return { ok: false, error: 'El título es obligatorio.' }

  const imageSrc = text(raw.image?.src, 500)
  if (imageSrc && !imageSrc.startsWith('/') && !isUrl(imageSrc)) return { ok: false, error: 'La portada debe ser una ruta del sitio (/media/...) o una URL https.' }

  const input: PostInput = {
    slug,
    title,
    excerpt: text(raw.excerpt, 500),
    html: cleanHtml(String(raw.html ?? '')),
    category: text(raw.category, 60) || 'Blog',
    status: raw.status === 'published' ? 'published' : 'draft',
    keywords: (raw.keywords ?? []).map((k) => text(k, 80)).filter(Boolean).slice(0, 10),
    seoTitle: text(raw.seoTitle, 120),
    seoDescription: text(raw.seoDescription, 320),
    image: imageSrc ? { src: imageSrc, alt: text(raw.image?.alt, 200), width: Number(raw.image?.width) || 1200, height: Number(raw.image?.height) || 630 } : null,
    faqs: (raw.faqs ?? []).map((f) => ({ q: text(f.q, 300), a: text(f.a, 2000) })).filter((f) => f.q && f.a).slice(0, 20),
    sources: (raw.sources ?? []).map((s) => ({ label: text(s.label, 200), url: text(s.url, 500) })).filter((s) => s.label && isUrl(s.url)).slice(0, 30),
  }

  try {
    let saved
    let oldSlug: string | null = null
    if (id) {
      const { post, previous } = await updatePost(id, input)
      saved = post
      oldSlug = previous.slug !== post.slug ? previous.slug : null
    } else {
      saved = await createPost(input)
    }
    // El sitio público se regenera en el acto con el cambio.
    for (const path of ['/', '/blog/', `/${saved.slug}/`, '/sitemap.xml', '/feed.xml', '/llms.txt']) revalidatePath(path)
    if (oldSlug) revalidatePath(`/${oldSlug}/`)
    revalidatePath('/blog/page/[n]', 'page')
    revalidatePath('/admin/')
    return { ok: true, id: saved.id, message: saved.status === 'published' ? 'Guardado y publicado.' : 'Guardado como borrador.' }
  } catch (error) {
    console.error(error)
    return { ok: false, error: 'No se pudo guardar. Revisa la conexión con la base de datos.' }
  }
}

export async function deletePostAction(id: string) {
  await requireAdmin()
  const post = await findById(id)
  if (!post) return
  await deletePost(id)
  for (const path of ['/', '/blog/', `/${post.slug}/`, '/sitemap.xml', '/feed.xml', '/llms.txt']) revalidatePath(path)
  revalidatePath('/blog/page/[n]', 'page')
  redirect('/admin/')
}

/** Regenera todas las páginas públicas con los datos actuales de la base (útil después de un despliegue). */
export async function refreshSiteAction() {
  await requireAdmin()
  revalidatePath('/', 'layout')
  redirect('/admin/?actualizado=1')
}
