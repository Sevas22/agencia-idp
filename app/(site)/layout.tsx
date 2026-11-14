import { HtmlShell, rootMetadata, rootViewport } from '@/components/html-shell'
import { SiteFrame } from '@/components/site-frame'
import { setLang } from '@/lib/lang'

export const metadata = rootMetadata
export const viewport = rootViewport

/** Layout raíz del sitio en español (URLs sin prefijo, como en WordPress). */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  setLang('es')
  return (
    <HtmlShell lang="es">
      <SiteFrame lang="es">{children}</SiteFrame>
    </HtmlShell>
  )
}
