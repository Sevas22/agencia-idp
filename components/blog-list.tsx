import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPosts, POSTS_PER_PAGE } from '@/lib/content'
import { LightHead, PostTile } from './nx'

export async function BlogList({ page }: { page: number }) {
  const posts = await getPosts()
  const total = Math.ceil(posts.length / POSTS_PER_PAGE)
  if (page > Math.max(total, 1)) notFound()
  const visible = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)

  return (
    <div className="nx-page">
      <LightHead label="Agencia IDP" title="Blog" />
      <section className="nx-section nx-pad-top-0" data-theme="light">
        <div className="nx-wrap">
          <div className="nx-posts">
            {visible.map((post) => (
              <PostTile key={post.slug} post={post} />
            ))}
          </div>
          <nav className="nx-pagination" aria-label="Páginas del blog">
            {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
              <Link key={n} href={n === 1 ? '/blog/' : `/blog/page/${n}/`} aria-current={n === page ? 'page' : undefined}>
                {n}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </div>
  )
}
