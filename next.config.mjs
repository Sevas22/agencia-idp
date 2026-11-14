const isDev = process.env.NODE_ENV !== 'production'

const SEO_API = process.env.NEXT_PUBLIC_SEO_API ?? 'https://agenteseo.5.161.200.242.sslip.io'

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.clarity.ms https://*.clarity.ms https://pushleads.co https://posrank.co https://connect.facebook.net https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${SEO_API} https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.clarity.ms https://pushleads.co https://www.facebook.com https://vitals.vercel-insights.com`,
  'frame-src https://pushleads.co https://calendar.google.com https://posrank.co https://maps.google.com https://www.google.com https://www.youtube-nocookie.com https://ux-heuristic-diagnostic-2qv6.vercel.app',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
]

// URLs de WordPress sin contenido real: se conservan con 301 para no perder enlaces ni SEO.
const legacyRedirects = [
  ['/carrito', '/'],
  ['/mi-cuenta', '/'],
  ['/tienda', '/'],
  ['/acceder', '/'],
  ['/elementor-978', '/'],
  ['/licitacion-de-servicios-publicos', '/'],
  ['/detalles-de-portafolio', '/crea-paginas-web-profesionales-colombia/'],
  ['/sobre-agencia-idp', '/transforma-agencia-software-colombia/'],
  ['/mvp', '/impulsa-desarrollo-producto-minimo-viable/'],
  ['/servicios', '/#servicios'],
  ['/que-es-el-desarrollo-de-aplicaciones-moviles-guia-completa-y-actualizada-2', '/desarrollo-de-aplicaciones-moviles/'],
  ['/las-51-empresas-lideres-en-inteligencia-artificial-que-estan-marcando-la-pauta-en-colombia-2', '/lasempresas-lideres-en-inteligencia-artificial/'],
  ['/category/:path*', '/blog/'],
  ['/feed', '/feed.xml'],
  ['/validar-idea-negocio-mvp-30-dias-colombia', '/validar-idea-de-negocio-mvp-30-dias/'],
  ['/cloud-computing-pymes-colombia-aws-google-azure-2026', '/cloud-computing-pymes-colombianas-aws-google-cloud-azure/'],
  ['/ux-design-experiencia-usuario-aumenta-ventas', '/ux-design-diseno-experiencia-usuario-aumenta-ventas/'],
  ['/agentes-de-ia-que-son-como-implementar-empresa-2026-2', '/agentes-de-ia-que-son-como-implementar-empresa-2026/'],
  ['/wp-content/uploads/2026/05/Presentacion-Corporativa-Agencia-IDP.pdf', '/docs/presentacion-corporativa-agencia-idp.pdf'],
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Un layout raíz por idioma (app/(site) y app/(en)) y app/global-not-found.tsx para las URLs que no existen.
  experimental: { globalNotFound: true },
  // WordPress publicaba todas las URLs con "/" final; se mantienen idénticas.
  trailingSlash: true,
  images: { unoptimized: true },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({ source, destination, statusCode: 301 }))
  },
}

export default nextConfig
