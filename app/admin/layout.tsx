import type { Metadata } from 'next'
import { HtmlShell, rootMetadata, rootViewport } from '@/components/html-shell'
import './admin.css'

export const metadata: Metadata = {
  ...rootMetadata,
  title: { default: 'Panel de contenidos', template: '%s · Panel Agencia IDP' },
  robots: { index: false, follow: false },
}
export const viewport = rootViewport

/** Layout raíz del panel: no comparte menú ni pie con el sitio público. */
export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <HtmlShell lang="es">
      <div className="adm">{children}</div>
    </HtmlShell>
  )
}
