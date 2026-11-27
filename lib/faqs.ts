import { pathOf, pick, type Lang } from './i18n'

/**
 * Preguntas frecuentes de la página /preguntas-frecuentes/ (y /en/faq/).
 * Pensadas para GEO: cada respuesta empieza con la respuesta directa, trae una cifra cuando aplica
 * y enlaza al servicio relacionado. No repiten el texto de las preguntas del inicio ni de los servicios.
 */
export type FaqItem = { q: string; a: string }
export type FaqGroup = { id: string; title: string; lead: string; items: FaqItem[] }

const link = (href: string, text: string) => `<a href="${href}">${text}</a>`

export function getFaqGroups(lang: Lang): FaqGroup[] {
  const p = (es: string, en: string) => pick(lang, es, en)
  const to = (key: Parameters<typeof pathOf>[0]) => pathOf(key, lang)

  return [
    {
      id: 'empresa',
      title: p('Sobre Agencia IDP', 'About Agencia IDP'),
      lead: p('Quiénes somos, dónde estamos y con quién trabajamos.', 'Who we are, where we are and who we work with.'),
      items: [
        {
          q: p('¿Agencia IDP es una agencia de marketing o una empresa de software?', 'Is Agencia IDP a marketing agency or a software company?'),
          a: p(
            `<p>Ninguna de las dos por separado. Agencia IDP es una <strong>empresa de innovación con fábrica de software in house</strong>: diseña, construye y lanza productos digitales, y mide si venden. El equipo de desarrollo es propio, no subcontratado. ${link(to('about'), 'Conoce al equipo')}.</p>`,
            `<p>Neither on its own. Agencia IDP is an <strong>innovation company with an in-house software factory</strong>: it designs, builds and launches digital products, and measures whether they sell. The development team is our own, not outsourced. ${link(to('about'), 'Meet the team')}.</p>`,
          ),
        },
        {
          q: p('¿Dónde está ubicada Agencia IDP?', 'Where is Agencia IDP located?'),
          a: p(
            '<p>La sede está en <strong>Medellín, Colombia</strong>, y la empresa tiene presencia en Florida, Estados Unidos, como IDP Agency LLC. El equipo trabaja de forma remota con clientes de cualquier ciudad y en reuniones presenciales en Medellín cuando el proyecto lo pide.</p>',
            '<p>Headquarters are in <strong>Medellín, Colombia</strong>, and the company has presence in Florida, USA, as IDP Agency LLC. The team works remotely with clients in any city and meets in person in Medellín when the project calls for it.</p>',
          ),
        },
        {
          q: p('¿Con qué empresas ha trabajado Agencia IDP?', 'Which companies has Agencia IDP worked with?'),
          a: p(
            `<p>Con marcas como Pintuco, Comfama, Corpaul, Humano Seguros, Grupo Éxito, ePayco y la Cámara de Comercio de Bogotá, además de startups y pymes. Puedes ver proyectos concretos en ${link(to('cases'), 'casos de éxito')}.</p>`,
            `<p>With brands such as Pintuco, Comfama, Corpaul, Humano Seguros, Grupo Éxito, ePayco and the Bogotá Chamber of Commerce, as well as startups and SMBs. You can see specific projects in our ${link(to('cases'), 'case studies')}.</p>`,
          ),
        },
        {
          q: p('¿Qué significa IDP?', 'What does IDP stand for?'),
          a: p(
            `<p>IDP son las tres fases de nuestra metodología: <strong>Idear, Desarrollar y Probar negocio</strong>. Primero definimos qué construir, luego lo construimos y al final lo lanzamos para medir si el mercado lo compra. Cada fase tiene su página: ${link(to('ideate'), 'Idear')}, ${link(to('develop'), 'Desarrollar')} y ${link(to('validate'), 'Probar negocio')}.</p>`,
            `<p>IDP stands for the three phases of our methodology in Spanish: <strong>Ideate, Develop and Test the business</strong>. First we define what to build, then we build it, and finally we launch it to measure whether the market buys it. Each phase has its own page: ${link(to('ideate'), 'Ideate')}, ${link(to('develop'), 'Develop')} and ${link(to('validate'), 'Test the business')}.</p>`,
          ),
        },
        {
          q: p('¿Atienden en inglés?', 'Do you work in English?'),
          a: p(
            '<p>Sí. Trabajamos en <strong>español e inglés</strong>, con reuniones, documentación y entregables en el idioma del cliente, y en un horario compatible con Estados Unidos.</p>',
            '<p>Yes. We work in <strong>English and Spanish</strong>, with meetings, documentation and deliverables in the client’s language, and in a time zone compatible with the United States.</p>',
          ),
        },
      ],
    },
    {
      id: 'servicios',
      title: p('Servicios', 'Services'),
      lead: p('Qué construimos y en qué casos conviene cada servicio.', 'What we build and when each service makes sense.'),
      items: [
        {
          q: p('¿Qué es un MVP y cuándo lo necesito?', 'What is an MVP and when do I need one?'),
          a: p(
            `<p>Un MVP (producto mínimo viable) es la versión más pequeña de tu producto que ya resuelve el problema principal y que puedes poner frente a clientes reales. Lo necesitas cuando tienes una idea de negocio digital y quieres saber si se vende antes de invertir en la versión completa. ${link(to('mvp'), 'Ver desarrollo de MVP')}.</p>`,
            `<p>An MVP (minimum viable product) is the smallest version of your product that already solves the main problem and that you can put in front of real customers. You need one when you have a digital business idea and want to know whether it sells before investing in the full version. ${link(to('mvp'), 'See MVP development')}.</p>`,
          ),
        },
        {
          q: p('¿Hacen software a la medida para empresas?', 'Do you build custom software for companies?'),
          a: p(
            `<p>Sí. Desarrollamos plataformas web, sistemas internos, portales de clientes e integraciones con ERP, CRM y pasarelas de pago, diseñados para el proceso de cada empresa. ${link(to('develop'), 'Ver software a la medida')}.</p>`,
            `<p>Yes. We build web platforms, internal systems, customer portals and integrations with ERPs, CRMs and payment gateways, designed around each company’s process. ${link(to('develop'), 'See custom software development')}.</p>`,
          ),
        },
        {
          q: p('¿Desarrollan aplicaciones móviles?', 'Do you build mobile apps?'),
          a: p(
            '<p>Sí. Construimos apps para <strong>iOS y Android</strong> con Flutter, a partir de una sola base de código, y las conectamos con el sistema web o el panel administrativo del negocio.</p>',
            '<p>Yes. We build <strong>iOS and Android</strong> apps with Flutter from a single codebase, and connect them to the business’s web system or admin panel.</p>',
          ),
        },
        {
          q: p('¿Qué automatizaciones con IA pueden hacer?', 'What AI automations can you build?'),
          a: p(
            `<p>Agentes que responden clientes por WhatsApp, clasificación y seguimiento de leads, generación de reportes, lectura de documentos y conexión de herramientas como CRM, hojas de cálculo y correo. El objetivo es quitar tareas repetitivas al equipo comercial y de operación. ${link(to('automation'), 'Ver automatizaciones con IA')}.</p>`,
            `<p>Agents that answer customers on WhatsApp, lead scoring and follow-up, report generation, document reading and connecting tools such as CRMs, spreadsheets and email. The goal is to take repetitive work off the sales and operations team. ${link(to('automation'), 'See AI automation')}.</p>`,
          ),
        },
        {
          q: p('¿Qué es el servicio de software nearshore?', 'What is your nearshore software service?'),
          a: p(
            `<p>Es un equipo de desarrollo en Colombia que trabaja para una empresa de Estados Unidos u otro país, en su misma zona horaria aproximada y a un costo menor que contratar localmente. Puede ser un equipo completo o perfiles que se suman al tuyo. ${link(to('nearshore'), 'Ver software nearshore')}.</p>`,
            `<p>It is a development team in Colombia working for a company in the United States or elsewhere, in roughly the same time zone and at a lower cost than hiring locally. It can be a full team or profiles that join yours. ${link(to('nearshore'), 'See nearshore software development')}.</p>`,
          ),
        },
        {
          q: p('¿Hacen tiendas en Shopify?', 'Do you build Shopify stores?'),
          a: p(
            `<p>Sí. Creamos tiendas Shopify con diseño propio, pasarela de pagos, configuración de envíos y analítica. Los planes de Shopify van de 710 a 1.850 USD. ${link(to('shopify'), 'Ver Shopify en Colombia')}.</p>`,
            `<p>Yes. We build Shopify stores with custom design, payment gateway, shipping setup and analytics. Shopify plans range from USD 710 to USD 1,850. ${link(to('shopify'), 'See Shopify development')}.</p>`,
          ),
        },
        {
          q: p('¿Qué es el SEO y el GEO, y los ofrecen?', 'What are SEO and GEO, and do you offer them?'),
          a: p(
            `<p>El SEO posiciona tu sitio en Google; el <strong>GEO</strong> (optimización para motores generativos) hace que asistentes como ChatGPT, Gemini o Perplexity te citen en sus respuestas. Ofrecemos los dos, con planes de SEO desde 330 USD al mes y un ${link('/agentes-seo/', 'diagnóstico SEO y GEO')} de tu sitio.</p>`,
            `<p>SEO ranks your site on Google; <strong>GEO</strong> (generative engine optimization) gets assistants such as ChatGPT, Gemini or Perplexity to cite you in their answers. We offer both, with SEO plans from USD 330 per month and an SEO and GEO audit of your site.</p>`,
          ),
        },
      ],
    },
    {
      id: 'precios',
      title: p('Precios y tiempos', 'Pricing and timelines'),
      lead: p('Cifras de referencia; el valor final depende del alcance.', 'Reference figures; the final price depends on scope.'),
      items: [
        {
          q: p('¿Cuánto cuesta una página web con Agencia IDP?', 'How much does a website with Agencia IDP cost?'),
          a: p(
            `<p>En WordPress, una landing page cuesta <strong>310 USD</strong>, un sitio completo o tienda <strong>650 USD</strong> y un sitio avanzado con CRM y funciones de venta cruzada <strong>1.250 USD</strong>. En Shopify los planes van de 710 a 1.850 USD. ${link(to('pricing'), 'Ver todos los planes')}.</p>`,
            `<p>On WordPress, a landing page costs <strong>USD 310</strong>, a full site or store <strong>USD 650</strong> and an advanced site with CRM and cross-selling features <strong>USD 1,250</strong>. On Shopify, plans range from USD 710 to USD 1,850. ${link(to('pricing'), 'See all plans')}.</p>`,
          ),
        },
        {
          q: p('¿Cuánto cuesta el mantenimiento mensual de un sitio web?', 'How much does monthly website maintenance cost?'),
          a: p(
            `<p>Los planes de webmaster en WordPress cuestan <strong>210, 460,9 o 650 USD al mes</strong>, y en Shopify <strong>208, 300 o 438 USD al mes</strong>. Incluyen actualizaciones, carga de productos y blogs, nuevas secciones y optimización SEO progresiva. ${link(to('pricing'), 'Comparar planes')}.</p>`,
            `<p>WordPress webmaster plans cost <strong>USD 210, 460.9 or 650 per month</strong>, and Shopify plans <strong>USD 208, 300 or 438 per month</strong>. They include updates, product and blog uploads, new sections and progressive SEO optimization. ${link(to('pricing'), 'Compare plans')}.</p>`,
          ),
        },
        {
          q: p('¿Cuánto cuesta el posicionamiento SEO mensual?', 'How much does monthly SEO cost?'),
          a: p(
            '<p>Hay tres planes: <strong>SEO básico a 330 USD</strong>, profesional a 430 USD y avanzado a 650 USD al mes. El avanzado suma estrategia multicanal; todos parten de una estrategia inicial del sitio.</p>',
            '<p>There are three plans: <strong>basic SEO at USD 330</strong>, professional at USD 430 and advanced at USD 650 per month. The advanced plan adds a multichannel strategy; all start from an initial site strategy.</p>',
          ),
        },
        {
          q: p('¿De qué depende el precio de un software a la medida?', 'What drives the price of custom software?'),
          a: p(
            '<p>De cuatro cosas: el número de flujos o módulos, las integraciones con otros sistemas, las plataformas (web, iOS, Android) y el nivel de diseño. Por eso cotizamos después de una llamada de alcance. Los MVP parten de 1.000 USD.</p>',
            '<p>Four things: the number of flows or modules, integrations with other systems, platforms (web, iOS, Android) and the level of design. That is why we quote after a scoping call. MVPs start at USD 1,000.</p>',
          ),
        },
        {
          q: p('¿Cuánto tarda una página web?', 'How long does a website take?'),
          a: p(
            '<p>Una landing page suele estar lista en pocas semanas y un sitio completo o una tienda toma más, según el número de páginas y productos y la rapidez con que lleguen textos e imágenes. El cronograma exacto se acuerda al iniciar.</p>',
            '<p>A landing page is usually ready in a few weeks, and a full site or store takes longer, depending on the number of pages and products and how quickly copy and images arrive. The exact schedule is agreed at kickoff.</p>',
          ),
        },
        {
          q: p('¿Cobran por la primera llamada?', 'Do you charge for the first call?'),
          a: p(
            '<p>No. La primera llamada es gratuita: revisamos tu idea o tu producto actual, te decimos qué construir primero y te orientamos sobre tiempos y presupuesto. Puedes agendarla al final de esta página.</p>',
            '<p>No. The first call is free: we review your idea or current product, tell you what to build first and give you guidance on timeline and budget. You can book it at the bottom of this page.</p>',
          ),
        },
      ],
    },
    {
      id: 'proceso',
      title: p('Cómo trabajamos', 'How we work'),
      lead: p('Qué pasa desde la primera llamada hasta la entrega.', 'What happens from the first call to delivery.'),
      items: [
        {
          q: p('¿Cómo empieza un proyecto con Agencia IDP?', 'How does a project with Agencia IDP start?'),
          a: p(
            `<p>Con una llamada de diagnóstico gratuita. Después enviamos una propuesta con alcance, tiempos y valor; al aprobarla, el proyecto arranca con la fase de ideación o directamente con el desarrollo si el alcance ya está claro. ${link(to('contact'), 'Escríbenos')}.</p>`,
            `<p>With a free discovery call. Then we send a proposal with scope, timeline and price; once approved, the project starts with the ideation phase, or straight with development if the scope is already clear. ${link(to('contact'), 'Contact us')}.</p>`,
          ),
        },
        {
          q: p('¿Puedo ver avances durante el desarrollo?', 'Can I see progress during development?'),
          a: p(
            '<p>Sí. Trabajamos por sprints y entregamos por partes, así que revisas versiones funcionales del producto y das retroalimentación antes de que se termine, no solo al final.</p>',
            '<p>Yes. We work in sprints and deliver in increments, so you review working versions of the product and give feedback before it is finished, not just at the end.</p>',
          ),
        },
        {
          q: p('¿Qué necesito tener listo antes de empezar?', 'What do I need ready before we start?'),
          a: p(
            `<p>Solo la idea y el problema que quieres resolver. No necesitas especificaciones técnicas: la fase ${link(to('ideate'), 'Idear')} existe para convertir una idea general en un alcance claro, con funcionalidades priorizadas.</p>`,
            `<p>Just the idea and the problem you want to solve. You do not need technical specs: the ${link(to('ideate'), 'Ideate')} phase exists to turn a general idea into a clear scope with prioritized features.</p>`,
          ),
        },
        {
          q: p('¿Ayudan a conseguir clientes después del lanzamiento?', 'Do you help get customers after launch?'),
          a: p(
            `<p>Sí, ese es el objetivo de la fase ${link(to('validate'), 'Probar negocio')}. Lanzamos el producto, hacemos campañas, medimos conversión, costo de adquisición y retención, y ajustamos con datos para que el negocio venda.</p>`,
            `<p>Yes, that is the goal of the ${link(to('validate'), 'Test the business')} phase. We launch the product, run campaigns, measure conversion, acquisition cost and retention, and adjust with data so the business sells.</p>`,
          ),
        },
        {
          q: p('¿Pueden mejorar un software que hizo otra empresa?', 'Can you improve software built by another company?'),
          a: p(
            '<p>Sí. Primero hacemos una revisión del código y la arquitectura para saber qué se puede aprovechar, y luego proponemos si conviene mejorarlo por partes o reconstruir solo los módulos que frenan el negocio.</p>',
            '<p>Yes. First we review the code and architecture to see what can be reused, then we recommend whether to improve it in stages or rebuild only the modules that hold the business back.</p>',
          ),
        },
      ],
    },
    {
      id: 'tecnologia',
      title: p('Tecnología e IA', 'Technology and AI'),
      lead: p('Las herramientas que usamos y cómo usamos la inteligencia artificial.', 'The tools we use and how we use artificial intelligence.'),
      items: [
        {
          q: p('¿Qué tecnologías usa Agencia IDP?', 'What technologies does Agencia IDP use?'),
          a: p(
            '<p>Principalmente <strong>React, Next.js y Node.js</strong> para web, <strong>Flutter</strong> para apps móviles, MongoDB y PostgreSQL para datos, y AWS para infraestructura. Para sitios y tiendas usamos WordPress y Shopify. Elegimos según el proyecto, no por costumbre.</p>',
            '<p>Mainly <strong>React, Next.js and Node.js</strong> for web, <strong>Flutter</strong> for mobile apps, MongoDB and PostgreSQL for data, and AWS for infrastructure. For sites and stores we use WordPress and Shopify. We choose per project, not by habit.</p>',
          ),
        },
        {
          q: p('¿Usan inteligencia artificial para desarrollar?', 'Do you use AI to build software?'),
          a: p(
            '<p>Sí, como apoyo del equipo para acelerar la construcción y las pruebas. Todo el código generado con IA pasa por revisión de nuestros desarrolladores y sigue la arquitectura definida en el proyecto.</p>',
            '<p>Yes, as support for the team to speed up building and testing. All AI-generated code is reviewed by our developers and follows the architecture defined for the project.</p>',
          ),
        },
        {
          q: p('¿Pueden integrar ChatGPT u otros modelos de IA en mi negocio?', 'Can you integrate ChatGPT or other AI models into my business?'),
          a: p(
            `<p>Sí. Integramos modelos como los de OpenAI, Anthropic o Google en asistentes, buscadores internos que responden con la información de tu empresa y flujos automáticos. ${link(to('automation'), 'Ver automatizaciones con IA')}.</p>`,
            `<p>Yes. We integrate models from OpenAI, Anthropic or Google into assistants, internal search that answers with your company’s information, and automated workflows. ${link(to('automation'), 'See AI automation')}.</p>`,
          ),
        },
        {
          q: p('¿Mi información está segura?', 'Is my data safe?'),
          a: p(
            '<p>Firmamos acuerdos de confidencialidad cuando el proyecto lo requiere, damos accesos por roles y entregamos las credenciales a nombre de tu empresa. Las integraciones de IA se configuran para no exponer datos sensibles.</p>',
            '<p>We sign NDAs when the project requires it, grant role-based access and hand over credentials in your company’s name. AI integrations are configured not to expose sensitive data.</p>',
          ),
        },
      ],
    },
    {
      id: 'productos',
      title: p('Productos propios', 'Our own products'),
      lead: p('Software que creamos y operamos nosotros mismos.', 'Software we built and run ourselves.'),
      items: [
        {
          q: p('¿Qué es Pushleads?', 'What is Pushleads?'),
          a: p(
            '<p><a href="https://pushleads.co/" target="_blank" rel="noopener">Pushleads</a> es un CRM multicanal con inteligencia artificial creado por Agencia IDP. Reúne en un solo lugar las conversaciones de WhatsApp, correo y SMS y los leads de Meta, Google y TikTok Ads, con agentes de IA que responden y hacen seguimiento.</p>',
            '<p><a href="https://pushleads.co/" target="_blank" rel="noopener">Pushleads</a> is a multichannel AI CRM built by Agencia IDP. It brings WhatsApp, email and SMS conversations and leads from Meta, Google and TikTok Ads into one place, with AI agents that reply and follow up.</p>',
          ),
        },
        {
          q: p('¿Qué es SEDE?', 'What is SEDE?'),
          a: p(
            '<p><a href="https://sedeapp.com/" target="_blank" rel="noopener">SEDE</a> (también llamada SEDEFY) es una plataforma educativa con IA para colegios, creada por Agencia IDP. Gestiona horarios, asignaturas y notas, y tiene un asistente de IA para docentes, estudiantes y directivos.</p>',
            '<p><a href="https://sedeapp.com/" target="_blank" rel="noopener">SEDE</a> (also called SEDEFY) is an AI education platform for schools, built by Agencia IDP. It manages schedules, subjects and grades, and includes an AI assistant for teachers, students and school leaders.</p>',
          ),
        },
        {
          q: p('¿Por qué una empresa de servicios tiene productos propios?', 'Why does a services company have its own products?'),
          a: p(
            '<p>Porque construir y vender nuestros propios productos nos obliga a validar lo que recomendamos. La metodología que usamos con los clientes, de la idea al negocio que vende, es la misma con la que lanzamos Pushleads y SEDE.</p>',
            '<p>Because building and selling our own products forces us to validate what we recommend. The methodology we use with clients, from idea to a business that sells, is the same one we used to launch Pushleads and SEDE.</p>',
          ),
        },
      ],
    },
    {
      id: 'soporte',
      title: p('Soporte y propiedad', 'Support and ownership'),
      lead: p('Qué recibes al final y qué pasa después.', 'What you get at the end and what happens next.'),
      items: [
        {
          q: p('¿Qué entregan al terminar el proyecto?', 'What do you deliver at the end of the project?'),
          a: p(
            '<p>El código fuente, los accesos a servidores y servicios, el dominio y las cuentas a nombre de tu empresa, y la documentación para que cualquier equipo pueda continuar el desarrollo. No quedas atado a nosotros.</p>',
            '<p>The source code, access to servers and services, the domain and accounts in your company’s name, and documentation so any team can continue development. You are not locked in to us.</p>',
          ),
        },
        {
          q: p('¿Ofrecen mantenimiento después de la entrega?', 'Do you offer maintenance after delivery?'),
          a: p(
            `<p>Sí. Hay planes mensuales para sitios web en WordPress y Shopify, y soporte técnico continuo para software a la medida y apps. ${link(to('pricing'), 'Ver planes de mantenimiento')}.</p>`,
            `<p>Yes. There are monthly plans for WordPress and Shopify websites, and ongoing technical support for custom software and apps. ${link(to('pricing'), 'See maintenance plans')}.</p>`,
          ),
        },
        {
          q: p('¿Cómo los contacto?', 'How do I contact you?'),
          a: p(
            `<p>Por WhatsApp al +57 315 988 2094, por correo a afranco@idpagency.co o agendando una llamada gratuita al final de esta página. También puedes escribir desde ${link(to('contact'), 'la página de contacto')}.</p>`,
            `<p>On WhatsApp at +57 315 988 2094, by email at afranco@idpagency.co or by booking a free call at the bottom of this page. You can also write to us from ${link(to('contact'), 'the contact page')}.</p>`,
          ),
        },
      ],
    },
  ]
}

/** Texto plano de una respuesta, para los datos estructurados. */
export const plainAnswer = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
