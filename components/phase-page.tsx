import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { buildMetadata } from '@/lib/content'
import { pathOf, type Lang } from '@/lib/i18n'
import { getLang, t } from '@/lib/lang'
import { site } from '@/lib/site'
import { Btn, FaqList, Label } from './nx'
import { RecentProjects, ServiceHero } from './nx-service'
import { BigCta, CtaButtons, FeatureGrid, ProcessSteps } from './nx-svc'

/**
 * Páginas de las tres fases de la metodología IDP (Idear, Desarrollar, Probar negocio).
 * Contenido basado en la presentación corporativa de Agencia IDP; sin cifras inventadas.
 */
export type PhaseKey = 'ideate' | 'develop' | 'validate'
const order: PhaseKey[] = ['ideate', 'develop', 'validate']

type Copy = {
  seoTitle: string
  seoDescription: string
  label: string
  h1: string
  intro: string
  short: string
  whatTitle: string
  whatText: string
  stepsLabel: string
  stepsTitle: string
  steps: { title: string; text: string }[]
  gridLabel: string
  gridTitle: string
  grid: { title: string; text: string }[]
  extra?: { label: string; title: string; text?: string; items: string[] }
  faqs: { q: string; a: string }[]
  ctaTitle: string
  ctaText: string
}

const phases: Record<PhaseKey, Record<Lang, Copy> & { name: Record<Lang, string>; tag: Record<Lang, string> }> = {
  ideate: {
    name: { es: 'Idear', en: 'Ideate' },
    tag: { es: 'Design Sprint', en: 'Design Sprint' },
    es: {
      seoTitle: 'Design Sprint e Ideación de Producto Digital | Agencia IDP',
      seoDescription: 'Sprint de ideación para pasar de una idea a un MVP definido: problema, hipótesis, funcionalidades, arquitectura e historias de usuario.',
      label: 'Fase 01 · Idear',
      h1: 'Design Sprint: de una idea a un MVP claro y definido',
      intro: '<p>Pasamos de una idea básica a una estructura clara: los parámetros, las hipótesis, las funcionalidades, la arquitectura y las historias de usuario de tu nuevo modelo de negocio digital.</p>',
      short:
        'Idear es la primera fase de la metodología IDP. Es un sprint basado en <strong>Design Sprint</strong> en el que identificamos capacidades, necesidades y el problema real a resolver, y definimos el MVP, la arquitectura y las historias de usuario que se deben construir.',
      whatTitle: '¿Qué es un Design Sprint?',
      whatText:
        'Es una metodología creada en Google Ventures para resolver retos de negocio y validar ideas en poco tiempo, con un equipo enfocado en un solo objetivo. En Agencia IDP la usamos para evitar construir de más: antes de escribir una línea de código, todo el equipo entiende qué problema se resuelve, para quién y cómo se medirá el éxito.',
      stepsLabel: 'Cómo funciona',
      stepsTitle: 'Las tres etapas del sprint de ideación',
      steps: [
        { title: 'Comprender', text: 'Definimos el problema, mapeamos el contexto, entrevistamos expertos y entendemos ventajas, capacidades, obstáculos, entorno, timing y tendencias para elegir un objetivo específico.' },
        { title: 'Idear', text: 'Investigamos soluciones existentes y cada miembro del equipo aporta sus propias ideas, enfocándose en el "cómo".' },
        { title: 'Decidir y plasmar', text: 'Evaluamos los hallazgos, planteamos la hipótesis general, esbozamos el MVP y definimos la arquitectura y los must y nice to have de lo que se construirá.' },
      ],
      gridLabel: 'Lo que obtienes',
      gridTitle: 'Al terminar el sprint tienes',
      grid: [
        { title: 'Problema y objetivo', text: 'Un reto concreto y priorizado, acordado por todo el equipo.' },
        { title: 'Hipótesis de negocio', text: 'Qué creemos que pasará y cómo vamos a comprobarlo.' },
        { title: 'Boceto del MVP', text: 'Las pantallas y flujos esenciales del producto.' },
        { title: 'Arquitectura', text: 'La base técnica propuesta para construir y escalar.' },
        { title: 'Historias de usuario', text: 'Qué debe poder hacer cada usuario, listo para desarrollar.' },
        { title: 'Must y nice to have', text: 'Lo indispensable para lanzar y lo que puede esperar.' },
      ],
      faqs: [
        { q: '¿Qué es un Design Sprint?', a: '<p>Es una metodología creada en Google Ventures para resolver retos y validar ideas en poco tiempo. En Agencia IDP es la base de la fase Idear: definimos el problema, exploramos soluciones y decidimos qué MVP construir.</p>' },
        { q: '¿Necesito tener la idea completamente clara?', a: '<p>No. El sprint está pensado justamente para pasar de una idea básica a una estructura clara, con hipótesis, funcionalidades y arquitectura definidas.</p>' },
        { q: '¿Qué entregables recibo al final?', a: '<p>El problema y objetivo priorizados, la hipótesis de negocio, el boceto del MVP, la arquitectura propuesta, las historias de usuario y la lista de must y nice to have.</p>' },
        { q: '¿Qué pasa después de la fase de ideación?', a: '<p>Con el alcance definido pasamos a la fase Desarrollar, donde construimos el MVP, y luego a Probar negocio, donde lo lanzamos al mercado real con nuestro Venture Lab.</p>' },
      ],
      ctaTitle: '¿Tienes una idea y no sabes por dónde empezar?',
      ctaText: 'Agenda una llamada y te contamos cómo sería el sprint de ideación para tu proyecto.',
    },
    en: {
      seoTitle: 'Design Sprint and Digital Product Ideation | Agencia IDP',
      seoDescription: 'An ideation sprint to go from an idea to a defined MVP: problem, hypothesis, features, architecture and user stories.',
      label: 'Phase 01 · Ideate',
      h1: 'Design Sprint: from an idea to a clear, defined MVP',
      intro: '<p>We take a basic idea to a clear structure: the parameters, hypotheses, features, architecture and user stories of your new digital business model.</p>',
      short:
        'Ideate is the first phase of the IDP methodology. It is a <strong>Design Sprint</strong>–based process where we identify capabilities, needs and the real problem to solve, and define the MVP, the architecture and the user stories to build.',
      whatTitle: 'What is a Design Sprint?',
      whatText:
        'It is a method created at Google Ventures to solve business challenges and validate ideas quickly, with a team focused on a single goal. At Agencia IDP we use it to avoid overbuilding: before writing a line of code, the whole team understands what problem is being solved, for whom, and how success will be measured.',
      stepsLabel: 'How it works',
      stepsTitle: 'The three stages of the ideation sprint',
      steps: [
        { title: 'Understand', text: 'We define the problem, map the context, interview experts and understand strengths, capabilities, obstacles, environment, timing and trends to choose a specific goal.' },
        { title: 'Ideate', text: 'We research existing solutions and every team member brings their own ideas, focusing on the "how".' },
        { title: 'Decide and map', text: 'We evaluate the findings, set the overall hypothesis, sketch the MVP and define the architecture and the must-haves and nice-to-haves.' },
      ],
      gridLabel: 'What you get',
      gridTitle: 'At the end of the sprint you have',
      grid: [
        { title: 'Problem and goal', text: 'A specific, prioritized challenge agreed by the whole team.' },
        { title: 'Business hypothesis', text: 'What we believe will happen and how we will test it.' },
        { title: 'MVP sketch', text: 'The essential screens and flows of the product.' },
        { title: 'Architecture', text: 'The proposed technical foundation to build and scale.' },
        { title: 'User stories', text: 'What each user must be able to do, ready for development.' },
        { title: 'Must and nice to have', text: 'What is essential for launch and what can wait.' },
      ],
      faqs: [
        { q: 'What is a Design Sprint?', a: '<p>It is a method created at Google Ventures to solve challenges and validate ideas quickly. At Agencia IDP it is the basis of the Ideate phase: we define the problem, explore solutions and decide which MVP to build.</p>' },
        { q: 'Do I need a fully defined idea?', a: '<p>No. The sprint is designed precisely to take a basic idea to a clear structure, with defined hypotheses, features and architecture.</p>' },
        { q: 'What deliverables do I get?', a: '<p>The prioritized problem and goal, the business hypothesis, the MVP sketch, the proposed architecture, the user stories and the list of must-haves and nice-to-haves.</p>' },
        { q: 'What happens after ideation?', a: '<p>With the scope defined we move to the Develop phase, where we build the MVP, and then to Test the business, where we launch it in the real market with our Venture Lab.</p>' },
      ],
      ctaTitle: 'Have an idea but not sure where to start?',
      ctaText: 'Book a call and we will walk you through the ideation sprint for your project.',
    },
  },
  develop: {
    name: { es: 'Desarrollar', en: 'Develop' },
    tag: { es: 'Software a la medida', en: 'Custom software' },
    es: {
      seoTitle: 'Desarrollo de Software a la Medida en Colombia | Agencia IDP',
      seoDescription: 'Construimos tu MVP o software a la medida: rápido, escalable y con UX/UI impecable. Plataformas, apps, IA, agentes, RAG, integraciones y PWA.',
      label: 'Fase 02 · Desarrollar',
      h1: 'Desarrollo de software a la medida, rápido y escalable',
      intro: '<p>Construimos el MVP ideal: rápido, económico y sin gastar de más, con las funcionalidades, los proveedores y la arquitectura que permiten escalar si el negocio progresa.</p>',
      short:
        'Desarrollar es la segunda fase de la metodología IDP. Nuestra <strong>fábrica de software in house</strong> construye MVPs rápidos, ligeros, escalables e impecables en UX/UI: plataformas, apps, IA, agentes, RAG, integraciones y PWA.',
      whatTitle: '¿Qué es el desarrollo de software a la medida?',
      whatText:
        'Es construir un producto digital pensado para tu negocio, en lugar de adaptar tu operación a una herramienta genérica. Partimos de lo definido en la fase Idear para construir solo lo esencial, con una base técnica que crece contigo y un diseño que tus usuarios entienden desde el primer uso.',
      stepsLabel: 'Cómo lo construimos',
      stepsTitle: 'Las cinco etapas del sprint de construcción',
      steps: [
        { title: 'Planificación y análisis', text: 'Definimos requisitos, especificaciones técnicas y alcance antes de escribir código.' },
        { title: 'Diseño', text: 'Creamos la arquitectura de software, los diagramas de base de datos y un diseño UI/UX impecable.' },
        { title: 'Desarrollo', text: 'Escribimos el código o usamos vibe coding (desarrollo asistido por IA) siguiendo la arquitectura definida.' },
        { title: 'Pruebas (QA)', text: 'Verificamos cada funcionalidad para encontrar errores y validar que todo funcione.' },
        { title: 'Despliegue', text: 'Lanzamos el software al entorno de producción, listo para usuarios reales.' },
      ],
      gridLabel: 'Qué construimos',
      gridTitle: 'Productos digitales a la medida',
      grid: [
        { title: 'Plataformas web', text: 'Sistemas, marketplaces y plataformas SaaS para tu operación o tus clientes.' },
        { title: 'Apps móviles', text: 'Aplicaciones para iOS y Android con una experiencia simple y rápida.' },
        { title: 'PWA', text: 'Apps web que se instalan en el celular y funcionan como una app nativa.' },
        { title: 'IA y agentes', text: 'Asistentes y agentes de IA que atienden, responden y automatizan tareas.' },
        { title: 'RAG', text: 'IA que responde con la información de tu empresa: documentos, catálogos o bases de datos.' },
        { title: 'Integraciones', text: 'Conexión con pasarelas de pago, CRM, ERP y otros sistemas mediante APIs.' },
      ],
      extra: { label: 'Tecnología', title: 'Elegimos la tecnología que mejor se adapta a tu idea y a tu presupuesto', items: ['React', 'Next.js', 'Node.js', 'Flutter', 'MongoDB', 'AWS'] },
      faqs: [
        { q: '¿Cuánto cuesta desarrollar un MVP?', a: '<p>En Agencia IDP desarrollamos MVPs desde 1.000 USD. El valor final depende del alcance, la plataforma y las integraciones, y se define con el alcance priorizado.</p>' },
        { q: '¿Con qué tecnologías trabajan?', a: '<p>Con tecnologías modernas y escalables como React, Next.js, Node.js, Flutter, MongoDB y AWS, entre otras. Elegimos según la idea y el presupuesto.</p>' },
        { q: '¿Qué es el vibe coding?', a: '<p>Es desarrollo asistido por inteligencia artificial. Lo usamos para acelerar la construcción, siempre siguiendo la arquitectura definida y con revisión y pruebas de nuestro equipo.</p>' },
        { q: '¿El software queda listo para crecer?', a: '<p>Sí. Diseñamos la arquitectura para que el producto pueda escalar si el negocio progresa, sin tener que reconstruirlo desde cero.</p>' },
        { q: '¿Ofrecen soporte después del lanzamiento?', a: '<p>Sí, ofrecemos soporte técnico y mantenimiento continuo, y podemos acompañarte en la fase Probar negocio para validar el producto en el mercado.</p>' },
      ],
      ctaTitle: '¿Listo para construir tu producto?',
      ctaText: 'Cuéntanos qué necesitas y te proponemos el alcance, la tecnología y el plan de desarrollo.',
    },
    en: {
      seoTitle: 'Custom Software Development in Colombia | Agencia IDP',
      seoDescription: 'We build your MVP or custom software: fast, scalable and with flawless UX/UI. Platforms, apps, AI, agents, RAG, integrations and PWAs.',
      label: 'Phase 02 · Develop',
      h1: 'Custom software development, fast and scalable',
      intro: '<p>We build the ideal MVP: fast, affordable and without overspending, with the features, vendors and architecture that let it scale if the business grows.</p>',
      short:
        'Develop is the second phase of the IDP methodology. Our <strong>in-house software factory</strong> builds fast, lean, scalable MVPs with flawless UX/UI: platforms, apps, AI, agents, RAG, integrations and PWAs.',
      whatTitle: 'What is custom software development?',
      whatText:
        'It means building a digital product designed for your business instead of adapting your operations to a generic tool. We start from what was defined in the Ideate phase to build only what is essential, on a technical foundation that grows with you and a design users understand from day one.',
      stepsLabel: 'How we build it',
      stepsTitle: 'The five stages of the build sprint',
      steps: [
        { title: 'Planning and analysis', text: 'We define requirements, technical specifications and scope before writing code.' },
        { title: 'Design', text: 'We create the software architecture, database diagrams and a flawless UI/UX design.' },
        { title: 'Development', text: 'We write the code or use vibe coding (AI-assisted development) following the defined architecture.' },
        { title: 'QA testing', text: 'We verify every feature to catch bugs and confirm everything works.' },
        { title: 'Deployment', text: 'We release the software to production, ready for real users.' },
      ],
      gridLabel: 'What we build',
      gridTitle: 'Custom digital products',
      grid: [
        { title: 'Web platforms', text: 'Systems, marketplaces and SaaS platforms for your operations or your customers.' },
        { title: 'Mobile apps', text: 'iOS and Android apps with a simple, fast experience.' },
        { title: 'PWAs', text: 'Web apps that install on the phone and work like native apps.' },
        { title: 'AI and agents', text: 'AI assistants and agents that answer, respond and automate tasks.' },
        { title: 'RAG', text: 'AI that answers using your company’s information: documents, catalogs or databases.' },
        { title: 'Integrations', text: 'Connections with payment gateways, CRM, ERP and other systems through APIs.' },
      ],
      extra: { label: 'Technology', title: 'We choose the technology that best fits your idea and budget', items: ['React', 'Next.js', 'Node.js', 'Flutter', 'MongoDB', 'AWS'] },
      faqs: [
        { q: 'How much does it cost to build an MVP?', a: '<p>At Agencia IDP we build MVPs starting at USD 1,000. The final price depends on scope, platform and integrations, and is set once the scope is prioritized.</p>' },
        { q: 'What technologies do you use?', a: '<p>Modern, scalable technologies such as React, Next.js, Node.js, Flutter, MongoDB and AWS, among others. We choose based on the idea and the budget.</p>' },
        { q: 'What is vibe coding?', a: '<p>It is AI-assisted development. We use it to speed up the build, always following the defined architecture and with review and testing by our team.</p>' },
        { q: 'Will the software be ready to grow?', a: '<p>Yes. We design the architecture so the product can scale as the business grows, without rebuilding from scratch.</p>' },
        { q: 'Do you offer support after launch?', a: '<p>Yes, we offer ongoing technical support and maintenance, and we can support you in the Test the business phase to validate the product in the market.</p>' },
      ],
      ctaTitle: 'Ready to build your product?',
      ctaText: 'Tell us what you need and we will propose the scope, technology and development plan.',
    },
  },
  validate: {
    name: { es: 'Probar negocio', en: 'Test the business' },
    tag: { es: 'Venture Lab', en: 'Venture Lab' },
    es: {
      seoTitle: 'Venture Lab: Validación de Modelos de Negocio | Agencia IDP',
      seoDescription: 'Lanzamos, operamos y medimos tu MVP en el mercado real con una célula de venture para responder la pregunta clave: ¿este negocio funciona o no?',
      label: 'Fase 03 · Probar negocio',
      h1: 'Venture Lab: probamos tu negocio en el mercado real',
      intro: '<p>Un equipo de emprendimiento listo para lanzar, operar y validar tu negocio en el mercado real. Convertimos tu producto en un experimento de negocio para saber si vende.</p>',
      short:
        'Probar negocio es la tercera fase de la metodología IDP. Con nuestro <strong>Venture Lab</strong>, una célula externa de venture —un "startup team" de expertos listos para ejecutar— lanza tu MVP al mercado real, lo opera y lo mide para responder: <strong>¿este negocio funciona o no?</strong>',
      whatTitle: '¿En qué se diferencia de una consultoría?',
      whatText:
        'La consultoría tradicional te dice qué hacer y te entrega reportes teóricos. En el Venture Lab lo hacemos contigo: diseñamos, lanzamos, atraemos usuarios, operamos y medimos, para que las decisiones salgan de datos reales del mercado y no de supuestos.',
      stepsLabel: 'Cómo funciona',
      stepsTitle: 'Un ciclo constante para aprender más rápido',
      steps: [
        { title: 'Definimos', text: 'Hipótesis, experimentos y estrategias para validar el negocio.' },
        { title: 'Atraemos', text: 'Usuarios reales, no supuestos, con estrategias probadas.' },
        { title: 'Gestionamos', text: 'Toda la operación y la experiencia de punta a punta.' },
        { title: 'Medimos', text: 'Comportamientos clave y resultados de negocio: CAC, conversión y retención.' },
        { title: 'Optimizamos', text: 'Iteramos constantemente para aprender más rápido.' },
      ],
      gridLabel: 'Tu célula de venture',
      gridTitle: 'Un startup team completo trabajando en tu negocio',
      grid: [
        { title: 'Diseño de producto', text: 'Ajustamos el producto según lo que hacen los usuarios.' },
        { title: 'Desarrollo tecnológico', text: 'Nuestra fábrica de software in house implementa los cambios.' },
        { title: 'Marketing de crecimiento', text: 'Campañas y canales para atraer usuarios reales.' },
        { title: 'Operación comercial', text: 'Gestionamos la venta y la operación del día a día.' },
        { title: 'Atención al cliente', text: 'Atendemos a los usuarios y recogemos lo que piden.' },
        { title: 'Mentalidad emprendedora', text: 'Decisiones rápidas, enfocadas en vender y aprender.' },
      ],
      extra: { label: 'Datos convertidos en dirección', title: 'Al final defines el futuro del negocio con datos en mano', items: ['Escalar con confianza', 'Ajustar con dirección', 'Pivotear', 'Detener a tiempo'] },
      faqs: [
        { q: '¿Qué es un Venture Lab?', a: '<p>Es una célula externa de venture: un equipo con diseño de producto, desarrollo, marketing de crecimiento, operación comercial y atención al cliente que lanza y opera tu producto en el mercado real.</p>' },
        { q: '¿En qué se diferencia de una consultoría?', a: '<p>No te decimos qué hacer ni te entregamos reportes teóricos: lo hacemos contigo. Ejecutamos, medimos y optimizamos en un ciclo constante.</p>' },
        { q: '¿Qué métricas se miden?', a: '<p>Comportamientos clave de los usuarios y resultados de negocio como el costo de adquisición (CAC), la conversión y la retención.</p>' },
        { q: '¿Qué pasa al final del Venture Lab?', a: '<p>Defines con datos el siguiente paso: escalar con confianza, ajustar el modelo o la audiencia, pivotear la solución o detener la idea antes de gastar más recursos.</p>' },
      ],
      ctaTitle: '¿Quieres saber si tu negocio funciona?',
      ctaText: 'Agenda una llamada y te contamos cómo llevaríamos tu producto al mercado real.',
    },
    en: {
      seoTitle: 'Venture Lab: Business Model Validation | Agencia IDP',
      seoDescription: 'We launch, run and measure your MVP in the real market with a venture cell to answer the key question: does this business work or not?',
      label: 'Phase 03 · Test the business',
      h1: 'Venture Lab: we test your business in the real market',
      intro: '<p>A venture team ready to launch, run and validate your business in the real market. We turn your product into a business experiment to find out whether it sells.</p>',
      short:
        'Test the business is the third phase of the IDP methodology. With our <strong>Venture Lab</strong>, an external venture cell —a "startup team" of experts ready to execute— launches your MVP in the real market, runs it and measures it to answer: <strong>does this business work or not?</strong>',
      whatTitle: 'How is it different from consulting?',
      whatText:
        'Traditional consulting tells you what to do and hands you theoretical reports. In the Venture Lab we do it with you: we design, launch, attract users, operate and measure, so decisions come from real market data, not assumptions.',
      stepsLabel: 'How it works',
      stepsTitle: 'A constant cycle to learn faster',
      steps: [
        { title: 'Define', text: 'Hypotheses, experiments and strategies to validate the business.' },
        { title: 'Attract', text: 'Real users, not assumptions, with proven strategies.' },
        { title: 'Manage', text: 'The whole operation and the end-to-end experience.' },
        { title: 'Measure', text: 'Key behaviors and business results: CAC, conversion and retention.' },
        { title: 'Optimize', text: 'We iterate constantly to learn faster.' },
      ],
      gridLabel: 'Your venture cell',
      gridTitle: 'A full startup team working on your business',
      grid: [
        { title: 'Product design', text: 'We adjust the product based on what users actually do.' },
        { title: 'Technology development', text: 'Our in-house software factory ships the changes.' },
        { title: 'Growth marketing', text: 'Campaigns and channels to attract real users.' },
        { title: 'Commercial operations', text: 'We run sales and day-to-day operations.' },
        { title: 'Customer service', text: 'We support users and capture what they ask for.' },
        { title: 'Entrepreneurial mindset', text: 'Fast decisions focused on selling and learning.' },
      ],
      extra: { label: 'Data turned into direction', title: 'In the end you decide the future of the business with data', items: ['Scale with confidence', 'Adjust with direction', 'Pivot', 'Stop in time'] },
      faqs: [
        { q: 'What is a Venture Lab?', a: '<p>It is an external venture cell: a team with product design, development, growth marketing, commercial operations and customer service that launches and runs your product in the real market.</p>' },
        { q: 'How is it different from consulting?', a: '<p>We do not tell you what to do or hand you theoretical reports: we do it with you. We execute, measure and optimize in a constant cycle.</p>' },
        { q: 'Which metrics do you measure?', a: '<p>Key user behaviors and business results such as customer acquisition cost (CAC), conversion and retention.</p>' },
        { q: 'What happens at the end of the Venture Lab?', a: '<p>You decide the next step with data: scale with confidence, adjust the model or audience, pivot the solution or stop the idea before spending more.</p>' },
      ],
      ctaTitle: 'Want to know if your business works?',
      ctaText: 'Book a call and we will explain how we would take your product to the real market.',
    },
  },
}

export function phaseMetadata(key: PhaseKey, lang: Lang): Metadata {
  const c = phases[key][lang]
  return buildMetadata({ title: c.seoTitle, description: c.seoDescription, image: null }, pathOf(key, lang))
}

/** Tarjeta lateral del héroe: las tres fases con la actual resaltada (también sirve de enlazado interno). */
function PhaseNav({ current, lang }: { current: PhaseKey; lang: Lang }) {
  return (
    <nav className="nx-phasenav" aria-label={t('Fases de la metodología IDP', 'IDP methodology phases')}>
      <p className="nx-label">{t('Metodología IDP', 'IDP methodology')}</p>
      <ol>
        {order.map((key, i) => (
          <li key={key} className={key === current ? 'is-current' : undefined}>
            <Link href={pathOf(key, lang)} aria-current={key === current ? 'page' : undefined}>
              <span>0{i + 1}</span>
              <strong>{phases[key].name[lang]}</strong>
              <small>{phases[key].tag[lang]}</small>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function PhasePage({ phase }: { phase: PhaseKey }) {
  const lang = getLang()
  const c = phases[phase][lang]
  const index = order.indexOf(phase)
  const next = order[index + 1]
  const url = `${site.url}${pathOf(phase, lang)}`

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: c.h1,
      serviceType: phases[phase].tag[lang],
      description: c.seoDescription,
      url,
      provider: { '@id': `${site.url}/#organization` },
      areaServed: ['CO', 'US', 'MX', 'DO', 'CR', 'ES', 'BR'],
      inLanguage: lang === 'en' ? 'en' : 'es-CO',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: lang === 'en' ? 'en' : 'es-CO',
      mainEntity: c.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') } })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t('Inicio', 'Home'), item: `${site.url}${pathOf('home', lang)}` },
        { '@type': 'ListItem', position: 2, name: t('Metodología IDP', 'IDP methodology'), item: `${site.url}${pathOf('home', lang)}#metodologia` },
        { '@type': 'ListItem', position: 3, name: phases[phase].name[lang], item: url },
      ],
    },
  ]

  return (
    <div className="nx-page">
      <ServiceHero label={c.label} title={c.h1} html={c.intro} aside={<PhaseNav current={phase} lang={lang} />}>
        <div className="nx-actions">
          <Btn href="#agenda">{t('Agenda una llamada', 'Book a call')}</Btn>
          <Btn href={`${pathOf('home', lang)}#metodologia`} variant="line">
            {t('Ver la metodología', 'See the methodology')}
          </Btn>
        </div>
      </ServiceHero>

      <section className="nx-section nx-grey" data-theme="light">
        <div className="nx-wrap nx-phase-intro">
          <div className="nx-answer">
            <p className="nx-answer-tag">{t('En pocas palabras', 'In short')}</p>
            <p dangerouslySetInnerHTML={{ __html: c.short }} />
          </div>
          <div>
            <h2 className="nx-h3">{c.whatTitle}</h2>
            <p>{c.whatText}</p>
          </div>
        </div>
      </section>

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap">
          <Label>{c.stepsLabel}</Label>
          <h2 className="nx-h2">{c.stepsTitle}</h2>
          <ProcessSteps items={c.steps} />
        </div>
      </section>

      <section className="nx-section nx-grey" data-theme="light">
        <div className="nx-wrap">
          <Label>{c.gridLabel}</Label>
          <h2 className="nx-h2">{c.gridTitle}</h2>
          <FeatureGrid items={c.grid} />
          {c.extra && (
            <div className="nx-phase-extra">
              <div>
                <Label>{c.extra.label}</Label>
                <h3>{c.extra.title}</h3>
              </div>
              <ul>
                {c.extra.items.map((item) => (
                  <li key={item}>
                    <Check size={15} aria-hidden /> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap nx-sticky-grid">
          <div className="nx-sticky">
            <Label>{t('Preguntas frecuentes', 'FAQ')}</Label>
            <h2 className="nx-h2">{t(`Sobre la fase ${phases[phase].name.es}`, `About the ${phases[phase].name.en} phase`)}</h2>
            {next && (
              <Link className="nx-phase-next" href={pathOf(next, lang)}>
                <small>{t('Siguiente fase', 'Next phase')}</small>
                <strong>
                  0{index + 2} · {phases[next].name[lang]}
                </strong>
                <ArrowRight size={18} aria-hidden />
              </Link>
            )}
          </div>
          <FaqList items={c.faqs} />
        </div>
      </section>

      <BigCta label={phases[phase].tag[lang]} title={c.ctaTitle} text={c.ctaText}>
        <CtaButtons href={site.whatsapp} text={t('Hablemos', "Let's talk")} />
      </BigCta>
      <RecentProjects />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    </div>
  )
}
