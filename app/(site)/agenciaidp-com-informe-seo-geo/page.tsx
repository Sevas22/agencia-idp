import type { Metadata } from 'next'
import { PaidReport } from '@/components/seo-tools'
import { buildMetadata, getSeo } from '@/lib/content'

export const metadata: Metadata = buildMetadata(getSeo('agenciaidp-com-informe-seo-geo'), '/agenciaidp-com-informe-seo-geo/', { noindex: true })

// Copia histórica de /informe-seo-geo/: Stripe podría seguir retornando aquí.
export default function LegacyReportPage() {
  return (
    <section className="nx-toolpage" data-theme="light">
      <div className="wrap-tool">
        <PaidReport />
      </div>
    </section>
  )
}
