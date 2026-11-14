import Link from 'next/link'
import { SideNav } from '@/components/admin/side-nav'
import { requireAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return (
    <div className="adm-shell">
      <aside className="adm-side">
        <Link href="/admin/" className="adm-brand">
          <img src="/brand/logo-agencia-idp.webp" alt="Agencia IDP" width={110} height={69} />
          <span>Panel de contenidos</span>
        </Link>
        <SideNav />
      </aside>
      <div className="adm-main">{children}</div>
    </div>
  )
}
