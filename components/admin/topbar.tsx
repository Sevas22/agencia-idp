import { LogOut } from 'lucide-react'
import { logoutAction } from '@/app/admin/actions'

/** Barra superior de cada pantalla del panel, con el título y la salida, como en el referente. */
export function Topbar({ title, children }: { title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className="adm-topbar">
      <h1>{title}</h1>
      <div className="adm-topbar-end">
        {children}
        <form action={logoutAction}>
          <button type="submit" className="adm-pill">
            <LogOut size={17} aria-hidden /> Cerrar sesión
          </button>
        </form>
      </div>
    </header>
  )
}
