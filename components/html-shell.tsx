import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Source_Code_Pro } from 'next/font/google'
import type { ReactNode } from 'react'
import type { Lang } from '@/lib/i18n'
import { site } from '@/lib/site'
import '../app/globals.css'
import '../app/redesign.css'
import '../app/blog.css'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-jakarta', display: 'swap' })
const mono = Source_Code_Pro({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-mono', display: 'swap' })

/** Metadatos comunes a todos los layouts raíz (español, inglés y panel). */
export const rootMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Agencia IDP', template: '%s | Agencia IDP' },
  alternates: { types: { 'application/rss+xml': `${site.url}/feed.xml` } },
  // Verificación de propiedad en Google Search Console (método etiqueta HTML).
  verification: { google: '2jmGGBF5Zbq9zTnhiuhWeCfwfqzutveDQAU5shNHTI0' },
}

export const rootViewport: Viewport = { colorScheme: 'light', themeColor: '#f6f6f6' }

/**
 * <html> con el idioma correcto. El sitio tiene un layout raíz por idioma (app/(site) y app/(en))
 * para que cada página declare su lang sin volverse dinámica.
 */
export function HtmlShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={lang} className={`${jakarta.variable} ${mono.variable}`} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  )
}
