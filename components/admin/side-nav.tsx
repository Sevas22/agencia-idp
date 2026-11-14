'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink, FilePlus2, LayoutGrid, Newspaper } from 'lucide-react'

const items = [
  { href: '/admin/', label: 'Posts del blog', icon: Newspaper, match: (p: string) => p === '/admin/' || (p.startsWith('/admin/posts/') && !p.startsWith('/admin/posts/new')) },
  { href: '/admin/posts/new/', label: 'Nuevo post', icon: FilePlus2, match: (p: string) => p.startsWith('/admin/posts/new') },
]

export function SideNav() {
  const pathname = usePathname() ?? ''
  return (
    <nav className="adm-nav" aria-label="Panel">
      <p className="adm-nav-title">
        <LayoutGrid size={14} aria-hidden /> Contenido
      </p>
      {items.map(({ href, label, icon: Icon, match }) => (
        <Link key={href} href={href} className={match(pathname) ? 'is-active' : undefined} aria-current={match(pathname) ? 'page' : undefined}>
          <Icon size={19} aria-hidden /> {label}
        </Link>
      ))}
      <a href="/blog/" target="_blank" rel="noopener noreferrer">
        <ExternalLink size={19} aria-hidden /> Ver el blog
      </a>
    </nav>
  )
}
