import type { Metadata } from 'next'
import { HtmlShell } from '@/components/html-shell'

export const metadata: Metadata = { title: 'Página no encontrada | Agencia IDP', robots: { index: false, follow: false } }

/** 404 para URLs que no coinciden con ninguna ruta (el sitio tiene un layout raíz por idioma). */
export default function GlobalNotFound() {
  return (
    <HtmlShell lang="es">
      <main className="nx-page nx-404">
        <section className="nx-section nx-center" data-theme="light">
          <div className="nx-wrap">
            <p className="nx-label">Error 404</p>
            <h1 className="nx-display">Esta página no existe</h1>
            <p className="nx-lead">Page not found.</p>
            <div className="nx-actions is-center">
              <a className="nx-btn" href="/">
                Ir al inicio
              </a>
              <a className="nx-btn nx-btn-line" href="/en/">
                English site
              </a>
            </div>
          </div>
        </section>
      </main>
    </HtmlShell>
  )
}
