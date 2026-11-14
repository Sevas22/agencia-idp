import type { Metadata } from 'next'
import { PaidReport } from '@/components/seo-tools'
import { buildMetadata, getSeo } from '@/lib/content'

export const metadata: Metadata = buildMetadata(getSeo('informe-seo-geo'), '/informe-seo-geo/', { noindex: true })

export default function ReportPage() {
  return (
    <section className="nx-toolpage" data-theme="light">
      <div className="wrap-tool">
        <PaidReport />
      </div>
    </section>
  )
}
