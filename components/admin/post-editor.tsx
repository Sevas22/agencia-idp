'use client'

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, EyeOff, ExternalLink, Eye, Plus, Sparkles, Trash2, Upload, X } from 'lucide-react'
import { savePostAction } from '@/app/admin/actions'
import { scoreContent, type Check as ScoreCheck, type Score } from '@/lib/content-score'
import type { DbPost, PostInput } from '@/lib/posts-repo'
import { DeleteButton } from './delete-button'
import { RichEditor } from './rich-editor'
import { blogCategories } from '@/lib/blog-categories'

type Props = { post: DbPost | null; revisions?: number; dates?: { created: string; updated: string }; children?: React.ReactNode }

const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 75)
    .replace(/-+$/g, '')

const empty: PostInput = { slug: '', title: '', excerpt: '', html: '', category: blogCategories[0].name, status: 'draft', keywords: [], seoTitle: '', seoDescription: '', image: null, faqs: [], sources: [] }

async function uploadImage(file: File) {
  const body = new FormData()
  body.append('file', file)
  const res = await fetch('/admin/upload/', { method: 'POST', body })
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
  if (!res.ok || !data.url) {
    window.alert(data.error ?? 'No se pudo subir la imagen.')
    return null
  }
  return data.url
}

export function PostEditor({ post, revisions = 0, dates }: Props) {
  const router = useRouter()
  const [data, setData] = useState<PostInput>(() => (post ? { ...post } : empty))
  const [keywordsText, setKeywordsText] = useState(() => (post?.keywords ?? []).join(', '))
  const [slugTouched, setSlugTouched] = useState(Boolean(post))
  const [dirty, setDirty] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [saving, startSaving] = useTransition()
  const [coverUploading, setCoverUploading] = useState(false)
  const coverInput = useRef<HTMLInputElement>(null)

  const keywords = useMemo(() => keywordsText.split(',').map((k) => k.trim()).filter(Boolean), [keywordsText])
  const scores = useMemo(() => scoreContent({ ...data, keywords }), [data, keywords])

  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const set = useCallback(<K extends keyof PostInput>(key: K, value: PostInput[K]) => {
    setData((current) => ({ ...current, [key]: value }))
    setDirty(true)
    setMessage(null)
  }, [])
  const setHtml = useCallback((html: string) => set('html', html), [set])

  const setTitle = (title: string) => {
    setData((current) => ({ ...current, title, slug: slugTouched ? current.slug : slugify(title) }))
    setDirty(true)
  }

  const save = () => {
    const payload = { ...data, keywords }
    startSaving(async () => {
      const result = await savePostAction(post?.id ?? null, payload)
      if (!result.ok) return setMessage({ ok: false, text: result.error })
      setData(payload)
      setDirty(false)
      setMessage({ ok: true, text: result.message })
      if (!post) router.replace(`/admin/posts/${result.id}/`)
      else router.refresh()
    })
  }

  const changeCover = async (file: File | undefined) => {
    if (!file) return
    setCoverUploading(true)
    const url = await uploadImage(file)
    setCoverUploading(false)
    if (url) set('image', { src: url, alt: data.image?.alt ?? '', width: 1200, height: 630 })
  }

  const focus = (id: string) => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    window.setTimeout(() => (el as HTMLElement | null)?.focus(), 300)
  }
  const append = (snippet: string, atStart = false) => {
    set('html', atStart ? snippet + data.html : data.html + snippet)
    window.setTimeout(() => focus('adm-content-editor'), 50)
  }

  // Cada «Fix» lleva al campo que falta o inserta la estructura que pide el criterio, lista para completar.
  const fixes: Record<string, () => void> = {
    keyword: () => focus('f-keywords'),
    kwTitle: () => focus('f-title'),
    titleLength: () => focus('f-title'),
    kwMeta: () => focus('f-meta-desc'),
    metaDesc: () => focus('f-meta-desc'),
    metaTitle: () => focus('f-meta-title'),
    excerpt: () => focus('f-excerpt'),
    cover: () => focus('f-cover'),
    coverAlt: () => focus(data.image?.src ? 'f-cover-alt' : 'f-cover'),
    slug: () => focus('f-slug'),
    h2: () => append('<h2>Nuevo subtítulo</h2><p></p>'),
    h3: () => append('<h3>Nuevo subtítulo</h3><p></p>'),
    answer: () => append('<p class="answer"><strong>Escribe aquí la respuesta directa en una o dos frases.</strong></p>', true),
    questions: () => append('<h2>¿Escribe aquí la pregunta que resuelve esta sección?</h2><p></p>'),
    lists: () => append('<ul><li>Primer punto</li><li>Segundo punto</li></ul>'),
    table: () => append('<table><thead><tr><th>Opción</th><th>Ventaja</th><th>Costo</th></tr></thead><tbody><tr><td></td><td></td><td></td></tr></tbody></table><p></p>'),
    conclusion: () => append('<h2>Conclusión</h2><p></p>'),
    faq: () => {
      set('faqs', [...data.faqs, { q: '', a: '' }, ...(data.faqs.length ? [] : [{ q: '', a: '' }])])
      window.setTimeout(() => focus('f-faqs'), 50)
    },
    sources: () => {
      set('sources', [...data.sources, { label: '', url: '' }])
      window.setTimeout(() => focus('f-sources'), 50)
    },
  }
  const onFix = (check: ScoreCheck) => (fixes[check.id] ?? (() => focus('adm-content-editor')))()

  const metaTitle = data.seoTitle || data.title
  const isPublished = data.status === 'published'

  return (
    <>
      <header className="adm-topbar">
        <div className="adm-topbar-start">
          <Link href="/admin/" className="adm-back" aria-label="Volver a los posts">
            <ArrowLeft size={18} />
          </Link>
          <h1>Blog · {post ? 'Editar post' : 'Nuevo post'}</h1>
        </div>
        <div className="adm-topbar-end">
          {message && (
            <span className={message.ok ? 'adm-ok' : 'adm-error'} role="status">
              {message.text}
            </span>
          )}
          {dirty && !message && <span className="adm-unsaved">Cambios sin guardar</span>}
          {post?.status === 'published' && (
            <a className="adm-pill" href={`/${post.slug}/`} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={17} aria-hidden /> Ver en el sitio
            </a>
          )}
          <button type="button" className="adm-btn is-primary" onClick={save} disabled={saving}>
            <Check size={18} aria-hidden /> {saving ? 'Guardando…' : 'Guardar todo'}
          </button>
        </div>
      </header>

      <div className="adm-page adm-editor">
        <div className="adm-editor-main">
          <section className="adm-card adm-settings">
            <div className="adm-settings-row">
              <label className="adm-field">
                Slug
                <input
                  id="f-slug"
                  value={data.slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    set('slug', slugify(e.target.value))
                  }}
                  placeholder="como-elegir-una-agencia-de-software"
                />
              </label>
              <div className="adm-field">
                <span>Estado</span>
                <button type="button" className={`adm-statebtn ${isPublished ? 'is-on' : ''}`} onClick={() => set('status', isPublished ? 'draft' : 'published')} aria-pressed={isPublished}>
                  {isPublished ? <Eye size={18} aria-hidden /> : <EyeOff size={18} aria-hidden />}
                  {isPublished ? 'Publicado' : 'Borrador'}
                </button>
              </div>
            </div>

            <div className="adm-cover-row">
              <div>
                <span className="adm-label">Portada por defecto</span>
                <div className="adm-filepick">
                  <button type="button" id="f-cover" className="adm-btn" onClick={() => coverInput.current?.click()} disabled={coverUploading}>
                    <Upload size={17} aria-hidden /> {coverUploading ? 'Subiendo…' : data.image?.src ? 'Cambiar imagen' : 'Elegir imagen'}
                  </button>
                  <span className="adm-muted">WebP, JPG o PNG de hasta 4 MB. Ideal 1200 × 630.</span>
                </div>
                <input ref={coverInput} type="file" accept="image/webp,image/jpeg,image/png,image/gif,image/avif" hidden onChange={(e) => { changeCover(e.target.files?.[0]); e.target.value = '' }} />
                <label className="adm-field">
                  Texto alternativo de la portada
                  <input id="f-cover-alt" value={data.image?.alt ?? ''} disabled={!data.image?.src} onChange={(e) => data.image && set('image', { ...data.image, alt: e.target.value })} placeholder="Describe la imagen e incluye la keyword" />
                </label>
              </div>
              <div className="adm-cover-preview">
                {data.image?.src ? <img src={data.image.src} alt="" /> : <span>Sin portada</span>}
                {data.image?.src && (
                  <button type="button" className="adm-icon-btn is-danger" onClick={() => set('image', null)} aria-label="Quitar portada" title="Quitar portada">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
            <p className="adm-hint">Todos los cambios se guardan con el botón «Guardar todo» de la parte superior.</p>
          </section>

          <section className="adm-card adm-fields">
            <label className="adm-field">
              Keywords objetivo (SEO/GEO)
              <input id="f-keywords" value={keywordsText} onChange={(e) => { setKeywordsText(e.target.value); setDirty(true) }} placeholder="agencia de software en Colombia, desarrollo de MVP" />
              <small>Separadas por comas. La primera es la principal.</small>
            </label>
            <label className="adm-field">
              Categoría
              <select id="f-category" value={data.category} onChange={(e) => set('category', e.target.value)}>
                {!blogCategories.some((c) => c.name === data.category) && <option value={data.category}>{data.category} (sin página)</option>}
                {blogCategories.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <small>Define en qué página de categoría del blog aparece el artículo.</small>
            </label>
            <label className="adm-field">
              Título
              <input id="f-title" value={data.title} onChange={(e) => setTitle(e.target.value)} placeholder="Cómo elegir una agencia de software en Colombia" />
            </label>
            <label className="adm-field">
              Extracto
              <textarea id="f-excerpt" rows={2} value={data.excerpt} onChange={(e) => set('excerpt', e.target.value)} placeholder="Resumen de una o dos frases que se ve en el listado del blog." />
            </label>
            <div className="adm-field">
              <span>Contenido</span>
              <RichEditor html={data.html} onChange={setHtml} onUpload={uploadImage} />
              <small>
                {scores.words.toLocaleString('es-CO')} palabras · Al guardar se limpian scripts y atributos inseguros.
              </small>
            </div>
          </section>

          <section className="adm-card" id="f-faqs" tabIndex={-1}>
            <h2>Preguntas frecuentes</h2>
            <p className="adm-muted">Se muestran al final del artículo y se publican como datos estructurados FAQPage.</p>
            {data.faqs.map((faq, i) => (
              <div key={i} className="adm-repeat">
                <input value={faq.q} onChange={(e) => set('faqs', data.faqs.map((f, j) => (j === i ? { ...f, q: e.target.value } : f)))} placeholder="Pregunta" aria-label={`Pregunta ${i + 1}`} />
                <textarea rows={2} value={faq.a} onChange={(e) => set('faqs', data.faqs.map((f, j) => (j === i ? { ...f, a: e.target.value } : f)))} placeholder="Respuesta" aria-label={`Respuesta ${i + 1}`} />
                <button type="button" className="adm-icon-btn" onClick={() => set('faqs', data.faqs.filter((_, j) => j !== i))} aria-label={`Quitar pregunta ${i + 1}`}>
                  <X size={16} />
                </button>
              </div>
            ))}
            <button type="button" className="adm-btn" onClick={() => set('faqs', [...data.faqs, { q: '', a: '' }])}>
              <Plus size={16} aria-hidden /> Agregar pregunta
            </button>
          </section>

          <section className="adm-card" id="f-sources" tabIndex={-1}>
            <h2>Fuentes</h2>
            <p className="adm-muted">Las citas verificables ayudan a que Google y las IA confíen en el artículo.</p>
            {data.sources.map((source, i) => (
              <div key={i} className="adm-repeat is-inline">
                <input value={source.label} onChange={(e) => set('sources', data.sources.map((s, j) => (j === i ? { ...s, label: e.target.value } : s)))} placeholder="Nombre de la fuente" aria-label={`Nombre de la fuente ${i + 1}`} />
                <input value={source.url} onChange={(e) => set('sources', data.sources.map((s, j) => (j === i ? { ...s, url: e.target.value } : s)))} placeholder="https://" aria-label={`URL de la fuente ${i + 1}`} />
                <button type="button" className="adm-icon-btn" onClick={() => set('sources', data.sources.filter((_, j) => j !== i))} aria-label={`Quitar fuente ${i + 1}`}>
                  <X size={16} />
                </button>
              </div>
            ))}
            <button type="button" className="adm-btn" onClick={() => set('sources', [...data.sources, { label: '', url: '' }])}>
              <Plus size={16} aria-hidden /> Agregar fuente
            </button>
          </section>

          {post && (
            <section className="adm-card adm-danger">
              <div>
                <h2>Eliminar artículo</h2>
                <p className="adm-muted">Se borra de la base y deja de verse en el sitio. Si solo quieres ocultarlo, cámbialo a borrador.</p>
                {dates && (
                  <p className="adm-muted">
                    Creado el {dates.created} · Última edición {dates.updated} · {revisions} {revisions === 1 ? 'versión anterior guardada' : 'versiones anteriores guardadas'}
                  </p>
                )}
              </div>
              <DeleteButton id={post.id} title={post.title} withLabel />
            </section>
          )}
        </div>

        <aside className="adm-editor-side">
          <ScoreCard title="SEO" icon="seo" score={scores.seo} onFix={onFix} />
          <ScoreCard title="GEO (IA)" icon="geo" score={scores.geo} onFix={onFix} />

          <section className="adm-card adm-serpcard">
            <h2>Vista en Google</h2>
            <div className="adm-serp">
              <span className="adm-serp-url">agenciaidp.com › {data.slug || 'url-del-articulo'}</span>
              <span className="adm-serp-title">{metaTitle || 'Título del artículo'}</span>
              <span className="adm-serp-desc">{data.seoDescription || 'Escribe una meta description de 120 a 160 caracteres.'}</span>
            </div>
            <label className="adm-field">
              Meta title
              <input id="f-meta-title" value={data.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} placeholder={data.title} />
              <small className={metaTitle.length <= 60 ? 'is-good' : 'is-warn'}>{metaTitle.length}/60</small>
            </label>
            <label className="adm-field">
              Meta description
              <textarea id="f-meta-desc" rows={3} value={data.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} />
              <small className={data.seoDescription.length >= 120 && data.seoDescription.length <= 160 ? 'is-good' : 'is-warn'}>{data.seoDescription.length}/160 · ideal desde 120</small>
            </label>
          </section>
        </aside>
      </div>
    </>
  )
}

function ScoreCard({ title, icon, score, onFix }: { title: string; icon: 'seo' | 'geo'; score: Score; onFix: (check: ScoreCheck) => void }) {
  return (
    <section className={`adm-card adm-scorecard is-${icon}`}>
      <div className="adm-score-head">
        <h2>{title}</h2>
        <strong>
          {score.score}
          <span>/100</span>
        </strong>
      </div>
      <div className="adm-bar">
        <i style={{ width: `${score.score}%` }} />
      </div>
      <ul>
        {score.checks.map((check) => (
          <li key={check.id} className={check.ok ? 'is-ok' : 'is-ko'}>
            {check.ok ? <Check size={14} aria-label="Cumple" /> : <X size={14} aria-label="Falta" />}
            <span>{check.label}</span>
            {!check.ok && (
              <button type="button" className="adm-fix" onClick={() => onFix(check)}>
                <Sparkles size={13} aria-hidden /> Fix
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
