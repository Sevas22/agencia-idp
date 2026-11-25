/**
 * Categorías del blog. El nombre coincide con el campo `category` de cada artículo en la base;
 * el slug forma la URL /blog/<slug>/. Cada categoría alimenta una página de servicio.
 */
export type BlogCategory = {
  slug: string
  name: string
  seoTitle: string
  seoDescription: string
  lead: string
  intro: string
  service: { href: string; label: string; text: string }
  featured: string[]
  faqs: { q: string; a: string }[]
}

export const blogCategories: BlogCategory[] = [
  {
    slug: 'mvp-y-validacion',
    name: 'MVP y validación de negocios',
    seoTitle: 'MVP y validación de negocios: guías | Agencia IDP',
    seoDescription: 'Guías para validar ideas y lanzar un MVP: costos, pasos, pruebas de concepto, pilotos comerciales y modelos de monetización.',
    lead: 'Cómo comprobar que una idea vende antes de invertir de más.',
    intro: 'Un MVP es la versión más simple de un producto que usuarios reales pueden usar para comprobar si una idea de negocio funciona. Aquí reunimos guías sobre cuánto cuesta, cómo lanzarlo, cómo validar la demanda y cómo pasar de un piloto a un negocio.',
    service: { href: '/impulsa-desarrollo-producto-minimo-viable/', label: 'Desarrollo de MVP', text: 'Valida tu idea con un producto real, desde 1.000 USD.' },
    featured: ['que-es-un-mvp-guia-definitiva-startups-colombia', 'cuanto-cuesta-desarrollar-un-mvp-en-colombia', 'validar-idea-de-negocio-mvp-30-dias'],
    faqs: [
      { q: '¿Qué es un MVP?', a: 'Es la versión más simple de un producto que usuarios reales pueden usar para comprobar si una idea de negocio funciona.' },
      { q: '¿Cuánto cuesta un MVP con Agencia IDP?', a: 'Los MVP parten de 1.000 USD. El valor final depende de las funciones, la plataforma y las integraciones.' },
    ],
  },
  {
    slug: 'software-a-la-medida',
    name: 'Software a la medida',
    seoTitle: 'Software a la medida: guías y comparativas | Agencia IDP',
    seoDescription: 'Guías de software a la medida: cuándo construir o comprar, cómo elegir proveedor, seguridad, APIs, metodologías ágiles y equipos nearshore.',
    lead: 'Decisiones técnicas explicadas para quien decide el negocio.',
    intro: 'El software a la medida es un sistema construido para los procesos de una empresa en particular. En esta sección explicamos cuándo conviene, cómo elegir proveedor, qué prácticas de seguridad exigir y cómo trabajar con equipos ágiles y nearshore.',
    service: { href: '/desarrollo-de-software-a-la-medida/', label: 'Desarrollo de software a la medida', text: 'Plataformas web, apps, integraciones e IA con nuestro propio equipo.' },
    featured: ['beneficios-de-contar-con-un-desarrollo-de-software', 'software-a-medida-vs-software-caja-colombia', 'como-elegir-agencia-de-software-en-colombia'],
    faqs: [
      { q: '¿Qué es el software a la medida?', a: 'Es un sistema construido para los procesos y objetivos de una empresa específica, en lugar de una herramienta estándar.' },
      { q: '¿De quién es el código?', a: 'De la empresa que lo contrata. En Agencia IDP el código, los accesos y la documentación quedan a nombre del cliente.' },
    ],
  },
  {
    slug: 'ia-y-automatizacion',
    name: 'IA y automatización',
    seoTitle: 'IA y automatización para empresas: guías | Agencia IDP',
    seoDescription: 'Guías de inteligencia artificial para empresas: agentes de IA, automatización de procesos, servicio al cliente con IA y adopción sin riesgos.',
    lead: 'Inteligencia artificial aplicada a ventas, atención y operación.',
    intro: 'La automatización con IA usa modelos de inteligencia artificial para ejecutar tareas que antes requerían criterio humano. Aquí encuentras guías prácticas para elegir el primer proceso, implementar agentes y medir el ahorro.',
    service: { href: '/automatizaciones-con-ia/', label: 'Automatizaciones con IA', text: 'Automatizamos citas, atención, ventas, cartera y seguimiento.' },
    featured: ['agentes-de-ia-que-son-como-implementar-empresa-2026', 'automatizacion-con-inteligencia-artificial', 'inteligencia-artificial-para-pymes-colombia-casos-de-uso'],
    faqs: [
      { q: '¿Qué es un agente de IA?', a: 'Es un sistema que usa un modelo de lenguaje para decidir y ejecutar pasos hacia un objetivo, conectado a las herramientas de la empresa.' },
      { q: '¿Por dónde empieza una empresa con IA?', a: 'Por un proceso frecuente, con reglas claras y bajo riesgo, medido antes y después de un piloto de 30 días.' },
    ],
  },
  {
    slug: 'transformacion-digital',
    name: 'Innovación y transformación digital',
    seoTitle: 'Innovación y transformación digital: guías | Agencia IDP',
    seoDescription: 'Guías de innovación y transformación digital: por dónde empezar, cómo medir el ROI, la nube, la obsolescencia y la metodología IDP.',
    lead: 'Cómo cambiar la forma de vender y operar, paso a paso.',
    intro: 'La transformación digital es el uso de tecnología para vender más, atender mejor y operar con menos esfuerzo. En esta sección reunimos guías para pymes y empresas medianas, desde el diagnóstico hasta la medición del retorno.',
    service: { href: '/empresa-de-transformacion-digital/', label: 'Transformación digital', text: 'Diagnóstico, priorización y construcción por etapas.' },
    featured: ['agencia-idp-metodologia-innova-desarrollando-producto', 'transformacion-digital-para-pymes-colombianas-por-donde-empezar-en-2026', 'como-medir-roi-inversion-tecnologia-empresas-colombia'],
    faqs: [
      { q: '¿Por dónde empieza la transformación digital?', a: 'Por un diagnóstico sencillo y un problema prioritario, normalmente en ventas, inventario, facturación o cartera.' },
      { q: '¿Cómo se mide el retorno?', a: 'Comparando el beneficio total con la inversión, a partir de una línea base medida antes del proyecto.' },
    ],
  },
  {
    slug: 'apps-moviles',
    name: 'Apps móviles',
    seoTitle: 'Apps móviles: costos, tipos y proceso | Agencia IDP',
    seoDescription: 'Guías de apps móviles: cuánto cuesta una app en Colombia, tipos de apps, requisitos, etapas del desarrollo y React Native vs Flutter.',
    lead: 'Todo lo que debes saber antes de invertir en una app.',
    intro: 'Una app móvil puede ser nativa, multiplataforma, web o PWA, y cada tipo tiene costos y ventajas distintas. Aquí explicamos cómo elegir, cuánto cuesta, qué requisitos preparar y cómo es el proceso de desarrollo.',
    service: { href: '/desarrollo-de-software-a-la-medida/', label: 'Desarrollo de apps', text: 'PWA, apps multiplataforma y plataformas web para tu negocio.' },
    featured: ['desarrollo-de-aplicaciones-moviles-en-colombia-2026', 'desarrollo-de-aplicaciones-moviles', 'react-native-vs-flutter-2026-comparativa'],
    faqs: [
      { q: '¿Cuánto cuesta una app en Colombia?', a: 'Depende de las funciones, la plataforma, las integraciones y el diseño. Un MVP con Agencia IDP parte de 1.000 USD.' },
      { q: '¿Conviene una app o una PWA?', a: 'Para validar una idea, una PWA suele ser más rápida y barata. Para funciones avanzadas del celular, una app.' },
    ],
  },
  {
    slug: 'ecommerce',
    name: 'E-commerce y ventas digitales',
    seoTitle: 'E-commerce y ventas digitales: guías | Agencia IDP',
    seoDescription: 'Guías de e-commerce: precios de páginas web, cómo crear una tienda en Shopify en Colombia, tendencias y errores que hacen perder ventas.',
    lead: 'Tiendas y sitios web pensados para vender.',
    intro: 'El e-commerce es la venta de productos y servicios por internet. En esta sección encuentras precios reales, guías para crear tu tienda en Shopify, tendencias del mercado colombiano y los errores que más ventas cuestan.',
    service: { href: '/shopify-en-colombia/', label: 'Agencia Shopify en Colombia', text: 'Tiendas Shopify con pagos locales, WhatsApp y SEO.' },
    featured: ['cuanto-cuesta-una-pagina-web-en-colombia', 'como-crear-tienda-online-shopify-colombia-2026', 'ecommerce-colombia-2026-tendencias-oportunidades'],
    faqs: [
      { q: '¿Cuánto cuesta una tienda en línea con Agencia IDP?', a: 'Las tiendas en Shopify parten de 710 USD y en WordPress de 650 USD.' },
      { q: '¿Shopify funciona en Colombia?', a: 'Sí, con pasarelas de pago locales como Mercado Pago, Wompi o PayU.' },
    ],
  },
  {
    slug: 'seo-y-geo',
    name: 'SEO y GEO',
    seoTitle: 'SEO y GEO: guías para posicionar tu marca | Agencia IDP',
    seoDescription: 'Guías de SEO y GEO: SEO técnico, cómo aparecer en Google y en las respuestas de IA, y por qué el contenido es un activo de tu empresa.',
    lead: 'Aparece en Google y en las respuestas de la IA.',
    intro: 'El SEO te posiciona en Google y el GEO busca que las IA como ChatGPT o Gemini citen tu marca. Aquí explicamos cómo trabajar ambos, desde la base técnica hasta el contenido que las IA prefieren citar.',
    service: { href: '/agentes-seo/', label: 'Diagnóstico SEO y GEO', text: 'Mide cómo te ven Google y las IA con un informe de tu sitio.' },
    featured: ['geo-vs-seo-posicionamiento-google-inteligencia-artificial-2026', 'seo-tecnico-2026-factores-google-valora', 'el-seo-y-el-geo-son-los-2-activos-mas-valiosos'],
    faqs: [
      { q: '¿Qué es el GEO?', a: 'Es la optimización de contenido para que motores de IA como ChatGPT, Gemini o Perplexity citen tu marca en sus respuestas.' },
      { q: '¿Cuánto tarda el SEO en dar resultados?', a: 'Normalmente entre 3 y 6 meses, según la competencia y la autoridad del sitio.' },
    ],
  },
]

export const categoryByName = (name?: string) => blogCategories.find((c) => c.name === name)
export const categoryBySlug = (slug: string) => blogCategories.find((c) => c.slug === slug)
export const categoryPath = (c: BlogCategory) => `/blog/${c.slug}/`
