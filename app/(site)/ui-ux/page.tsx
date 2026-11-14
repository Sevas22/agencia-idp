import type { Metadata } from 'next'
import { UxFrame } from '@/components/ux-frame'
import { buildMetadata, getSeo } from '@/lib/content'

export const metadata: Metadata = buildMetadata(getSeo('ui-ux'), '/ui-ux/')

export default function UxPage() {
  return (
    <>
      <h1 className="sr-only">Diagnóstico UX/UI Heurístico</h1>
      <UxFrame />
    </>
  )
}
