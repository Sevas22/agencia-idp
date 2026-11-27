export const site = {
  name: 'Agencia IDP',
  legalName: 'Impulsadora digital de proyecto sas',
  url: 'https://agenciaidp.com',
  email: 'afranco@idpagency.co',
  phone: '+57 315 988 2094',
  phoneHref: 'tel:+573159882094',
  city: 'Medellín, Colombia',
  whatsapp: 'https://wa.link/k9m8qz',
  startProject: 'https://wa.link/sehwqr',
  servicesLink: 'https://wa.link/vffq7f',
  planLink: 'https://wa.link/2it4kx',
  calendar: 'https://calendar.app.google/ciKLGNygJKw5JqKeA',
  // Misma agenda de Google en su versión para incrustar en la página.
  calendarEmbed: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ21u9G4wLCgER87BeMPR86SS_flbp9EmjmCLpg6OsxDsYab1J-qSXKS2Ir29JfKD98h6t8fJ1L4?gv=true',
  contactForm: 'https://pushleads.co/f/form_1787838991732_03ram8qt2col',
  map: 'https://maps.google.com/maps?q=Medellin&t=m&z=16&output=embed&iwloc=near',
  video: 'https://www.youtube.com/watch?v=_esKEreSdh8',
}

export const socials = [
  { label: 'TikTok', href: 'https://www.tiktok.com/@agenciaidp' },
  { label: 'WhatsApp', href: site.whatsapp },
  { label: 'LinkedIn', href: 'http://www.linkedin.com/company/idp-agencia/about/' },
  { label: 'YouTube', href: 'https://www.youtube.com/@agenciaidp' },
  { label: 'Facebook', href: 'https://www.facebook.com/AgenIDP' },
]

export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] }

export const nav: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Sobre nosotros', href: '/transforma-agencia-software-colombia/' },
  {
    label: 'Servicios',
    href: '/#servicios',
    children: [
      { label: 'Idear · Design Sprint', href: '/design-sprint-ideacion-de-producto/' },
      { label: 'Desarrollar · Software a la medida', href: '/desarrollo-de-software-a-la-medida/' },
      { label: 'Probar negocio · Venture Lab', href: '/venture-lab-validacion-de-negocios/' },
      { label: 'Desarrollo de productos mínimos viables', href: '/impulsa-desarrollo-producto-minimo-viable/' },
      { label: 'Software nearshore', href: '/software-nearshore-en-colombia/' },
      { label: 'Transformación digital', href: '/empresa-de-transformacion-digital/' },
      { label: 'Automatizaciones a la medida', href: '/automatizaciones-con-ia/' },
    ],
  },
  { label: 'Casos de éxito', href: '/crea-paginas-web-profesionales-colombia/' },
  { label: 'Contacto', href: '/contacto/' },
  { label: 'Herramientas', href: '/herramientas/' },
  { label: 'Blog', href: '/blog/' },
]

export const footerLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Nuestros servicios', href: '/#servicios' },
  { label: 'Sobre nosotros', href: '/transforma-agencia-software-colombia/' },
  { label: 'Planes y precios', href: '/precios/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes/' },
  { label: 'Contáctanos', href: '/contacto/' },
]

// Menú y pie en inglés. El blog sigue en español y se enlaza tal cual.
export const navEn: NavItem[] = [
  { label: 'Home', href: '/en/' },
  { label: 'About us', href: '/en/about-us/' },
  {
    label: 'Services',
    href: '/en/#servicios',
    children: [
      { label: 'Ideate · Design Sprint', href: '/en/design-sprint/' },
      { label: 'Develop · Custom software', href: '/en/custom-software-development/' },
      { label: 'Test the business · Venture Lab', href: '/en/venture-lab/' },
      { label: 'MVP development', href: '/en/mvp-development/' },
      { label: 'Nearshore software', href: '/en/nearshore-software-development/' },
      { label: 'Digital transformation', href: '/en/digital-transformation/' },
      { label: 'AI automation', href: '/en/ai-automation/' },
    ],
  },
  { label: 'Case studies', href: '/en/case-studies/' },
  { label: 'Contact', href: '/en/contact/' },
  { label: 'Tools', href: '/en/tools/' },
  { label: 'Blog (ES)', href: '/blog/' },
]

export const footerLinksEn = [
  { label: 'Home', href: '/en/' },
  { label: 'Our services', href: '/en/#servicios' },
  { label: 'About us', href: '/en/about-us/' },
  { label: 'Plans & pricing', href: '/en/pricing/' },
  { label: 'Shopify development', href: '/en/shopify-development/' },
  { label: 'FAQ', href: '/en/faq/' },
  { label: 'Contact us', href: '/en/contact/' },
]

/** Identificadores públicos que el sitio WordPress ya usaba. */
export const tracking = {
  ga: ['G-Z34P5FHECQ', 'G-W5FPVDF1SS'],
  clarity: 'rfzymcqvo3',
  facebookPixel: '2061681357942220',
  pushleadsAgent: 'agent_1785518966998_07zeqxg',
}

export const SEO_API = process.env.NEXT_PUBLIC_SEO_API ?? 'https://agenteseo.5.161.200.242.sslip.io'
