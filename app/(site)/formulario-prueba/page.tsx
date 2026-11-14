import type { Metadata } from 'next'
import { FreeDiagnostic } from '@/components/seo-tools'
import { buildMetadata, getSeo } from '@/lib/content'

export const metadata: Metadata = buildMetadata(getSeo('formulario-prueba'), '/formulario-prueba/', { noindex: true })

export default function FreeDiagnosticPage() {
  return (
    <section className="nx-toolpage" data-theme="light">
      <div className="wrap-tool">
        <FreeDiagnostic />
      </div>
    </section>
  )
}
