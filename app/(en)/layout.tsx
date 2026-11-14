import { HtmlShell, rootMetadata, rootViewport } from '@/components/html-shell'
import { SiteFrame } from '@/components/site-frame'
import { setLang } from '@/lib/lang'

export const metadata = rootMetadata
export const viewport = rootViewport

/** Layout raíz del sitio en inglés (todo bajo /en/). */
export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  setLang('en')
  return (
    <HtmlShell lang="en">
      <SiteFrame lang="en">{children}</SiteFrame>
    </HtmlShell>
  )
}
