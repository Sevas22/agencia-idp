import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, Pencil, Plus, RefreshCw, Search } from 'lucide-react'
import { refreshSiteAction } from '../actions'
import { DeleteButton } from '@/components/admin/delete-button'
import { Topbar } from '@/components/admin/topbar'
import { scoreContent } from '@/lib/content-score'
import { listAll } from '@/lib/posts-repo'

export const metadata: Metadata = { title: 'Posts' }

type Props = { searchParams: Promise<{ q?: string; estado?: string; orden?: string; actualizado?: string }> }

const tone = (n: number) => (n >= 80 ? 'is-good' : n >= 60 ? 'is-mid' : 'is-low')
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default async function PostsPage({ searchParams }: Props) {
  const { q = '', estado = 'todos', orden = 'recientes', actualizado } = await searchParams
  const posts = (await listAll()).map((post) => ({ post, ...scoreContent(post) }))

  const published = posts.filter((p) => p.post.status === 'published').length
  const avg = (key: 'seo' | 'geo') => (posts.length ? Math.round(posts.reduce((sum, p) => sum + p[key].score, 0) / posts.length) : 0)

  let rows = posts.filter((p) => (estado === 'publicados' ? p.post.status === 'published' : estado === 'borradores' ? p.post.status === 'draft' : true))
  if (q.trim()) rows = rows.filter((p) => norm(`${p.post.title} ${p.post.slug} ${p.post.keywords.join(' ')}`).includes(norm(q.trim())))
  if (orden === 'seo') rows = [...rows].sort((a, b) => a.seo.score - b.seo.score)
  if (orden === 'geo') rows = [...rows].sort((a, b) => a.geo.score - b.geo.score)

  const tab = (value: string, label: string, n: number) => (
    <Link href={{ pathname: '/admin/', query: { ...(q ? { q } : {}), estado: value, orden } }} className={estado === value ? 'is-active' : undefined}>
      {label} <span>{n}</span>
    </Link>
  )

  return (
    <>
      <Topbar title="Blog · Posts" />
      <div className="adm-page">
        <div className="adm-pagehead">
          <p className="adm-count">
            {rows.length} {rows.length === 1 ? 'post' : 'posts'}
            <span>
              SEO medio <b className={tone(avg('seo'))}>{avg('seo')}</b> · GEO medio <b className={tone(avg('geo'))}>{avg('geo')}</b>
            </span>
          </p>
          <div className="adm-pagehead-actions">
            <form action={refreshSiteAction}>
              <button type="submit" className="adm-btn" title="Regenera todas las páginas públicas con los datos actuales de la base">
                <RefreshCw size={17} aria-hidden /> Actualizar sitio
              </button>
            </form>
            <Link href="/admin/posts/new/" className="adm-btn is-primary">
              <Plus size={19} aria-hidden /> Nuevo post
            </Link>
          </div>
        </div>
        {actualizado && <p className="adm-ok">Listo: el sitio público se regeneró con los datos actuales.</p>}

        <div className="adm-filterbar">
          <nav className="adm-tabs" aria-label="Estado">
            {tab('todos', 'Todos', posts.length)}
            {tab('publicados', 'Publicados', published)}
            {tab('borradores', 'Borradores', posts.length - published)}
          </nav>
          <form className="adm-filter" action="/admin/">
            <input type="hidden" name="estado" value={estado} />
            <label className="adm-search">
              <Search size={17} aria-hidden />
              <input type="search" name="q" defaultValue={q} placeholder="Buscar por título, URL o keyword" aria-label="Buscar" />
            </label>
            <select name="orden" defaultValue={orden} aria-label="Ordenar">
              <option value="recientes">Editados recientemente</option>
              <option value="seo">SEO más bajo primero</option>
              <option value="geo">GEO más bajo primero</option>
            </select>
            <button type="submit" className="adm-btn">
              Filtrar
            </button>
          </form>
        </div>

        <div className="adm-tablecard">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Portada</th>
                <th>Título</th>
                <th>Tipo</th>
                <th>Keyword principal</th>
                <th>Estado</th>
                <th>SEO</th>
                <th>GEO</th>
                <th className="is-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ post, seo, geo, words }) => (
                <tr key={post.id}>
                  <td>{post.image?.src ? <img className="adm-thumb" src={post.image.src} alt="" loading="lazy" /> : <span className="adm-thumb is-empty" />}</td>
                  <td className="adm-cell-title">
                    <Link href={`/admin/posts/${post.id}/`} className="adm-title">
                      {post.title}
                    </Link>
                    <span className="adm-slug">/{post.slug}</span>
                    <span className="adm-words">{words.toLocaleString('es-CO')} palabras</span>
                  </td>
                  <td>
                    <span className="adm-chip">{post.category || 'Blog'}</span>
                  </td>
                  <td>{post.keywords[0] ? <span className="adm-chip is-kw">{post.keywords[0]}</span> : <span className="adm-missing">Sin keyword</span>}</td>
                  <td>
                    <span className={`adm-state ${post.status === 'published' ? 'is-published' : 'is-draft'}`}>{post.status === 'published' ? 'publicado' : 'borrador'}</span>
                  </td>
                  <td>
                    <span className={`adm-score ${tone(seo.score)}`}>{seo.score}</span>
                  </td>
                  <td>
                    <span className={`adm-score ${tone(geo.score)}`}>{geo.score}</span>
                  </td>
                  <td className="adm-actions">
                    <div className="adm-actions-col">
                    <Link href={`/admin/posts/${post.id}/`} className="adm-icon-btn" aria-label={`Editar ${post.title}`} title="Editar">
                      <Pencil size={18} />
                    </Link>
                    {post.status === 'published' && (
                      <a href={`/${post.slug}/`} target="_blank" rel="noopener noreferrer" className="adm-icon-btn" aria-label={`Ver ${post.title} en el sitio`} title="Ver en el sitio">
                        <ExternalLink size={18} />
                      </a>
                    )}
                    <DeleteButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="adm-empty">
                    No hay artículos con ese filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
