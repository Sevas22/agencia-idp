import Link from 'next/link'
import { ArrowUpRight, Check, X } from 'lucide-react'
import { pathOf } from '@/lib/i18n'
import { getLang } from '@/lib/lang'
import { site } from '@/lib/site'
import { Btn, FaqList, Label } from './nx'
import { GuideToc } from './guide-toc'

/**
 * Guía SEO/GEO de la página de MVP, en español e inglés. Reemplaza el texto importado, que repetía "impulsa" decenas de veces.
 * Solo usa datos de la marca publicados en el sitio y en la presentación corporativa; nada de cifras inventadas.
 */

const copy = {
  es: {
    toc: [
      { id: 'que-es-un-mvp', title: 'Qué es un MVP' },
      { id: 'mvp-vs-prototipo', title: 'MVP, prototipo y producto completo' },
      { id: 'como-lo-hacemos', title: 'Cómo desarrollamos un MVP' },
      { id: 'costo-y-tiempo', title: 'Costo y tiempo' },
      { id: 'que-medir', title: 'Qué medir tras el lanzamiento' },
      { id: 'errores', title: 'Errores que encarecen un MVP' },
      { id: 'preguntas-mvp', title: 'Preguntas frecuentes' },
    ],
    label: 'Guía · Desarrollo de MVP',
    title: 'Cómo validar tu idea con un MVP antes de invertir en grande',
    answerTag: 'Respuesta corta',
    checks: ['Valida la hipótesis con clientes reales, no con suposiciones.', 'Reduce la inversión inicial al construir solo lo esencial.', 'Genera datos para decidir el siguiente paso.', 'Muestra tracción real frente a socios e inversionistas.'],
    h: ['Qué es un MVP y para qué sirve', 'MVP, prototipo y producto completo: diferencias', 'Cómo desarrollamos un MVP en Agencia IDP', '¿Cuánto cuesta y cuánto tarda un MVP?', 'Qué medir después del lanzamiento', 'Errores que encarecen un MVP', 'Preguntas frecuentes sobre el desarrollo de MVP'],
    tableIntro: 'Confundirlos es uno de los motivos más comunes de sobreinversión. Esta tabla resume en qué se diferencian:',
    tableLabel: 'Comparación entre prototipo, MVP y producto completo',
    cols: ['Aspecto', 'Prototipo', 'MVP', 'Producto completo'],
    comparison: [
      ['Objetivo', 'Explorar y comunicar una idea', 'Validar el negocio con usuarios reales', 'Operar y escalar un negocio probado'],
      ['Usuarios', 'Equipo interno o pruebas guiadas', 'Clientes reales en el mercado', 'Toda la base de clientes'],
      ['Funcionalidad', 'Simulada o parcial', 'Solo lo esencial, pero funcional', 'Completa y optimizada'],
      ['Datos que entrega', 'Opiniones', 'Uso real, conversión y retención', 'Métricas de crecimiento'],
      ['Riesgo de inversión', 'Bajo', 'Controlado', 'Alto si no se validó antes'],
    ],
    phases: [
      { name: 'Idear', text: 'Un sprint basado en Design Sprint para entender el problema, plantear la hipótesis y definir el alcance: funcionalidades indispensables, arquitectura e historias de usuario.' },
      { name: 'Desarrollar', text: 'Planificación, diseño UX/UI, desarrollo, pruebas QA y despliegue. Construimos solo lo esencial, con una arquitectura que permita crecer si el negocio funciona.' },
      { name: 'Probar negocio', text: 'Con nuestro Venture Lab lanzamos el MVP al mercado: validamos, atraemos usuarios reales, gestionamos la operación, medimos y optimizamos.' },
    ],
    from: 'Desde',
    price: '1.000 USD',
    priceNote: 'El valor final depende del alcance, la plataforma (web, app o ambas) y las integraciones. Lo definimos al cerrar la fase de ideación, con el alcance ya priorizado.',
    metricsIntro: 'Un MVP vale por los datos que entrega. Estas son las métricas que revisamos en cada ciclo:',
    metrics: [
      ['Retención', 'Cuántos usuarios vuelven después de la primera semana o el primer mes. Es la señal más clara de que el problema existe.'],
      ['Conversión', 'Qué porcentaje de visitantes se registra, paga o completa la acción clave del producto.'],
      ['CAC', 'Cuánto cuesta adquirir cada cliente. Define si el modelo puede crecer de forma rentable.'],
      ['Adopción de funcionalidades', 'Qué partes del producto se usan de verdad y cuáles sobran para la siguiente versión.'],
    ],
    outcomesIntro: 'Con esos datos definimos una de cuatro direcciones:',
    outcomes: ['Escalar con confianza', 'Ajustar con dirección', 'Pivotear', 'Detener a tiempo'],
    mistakes: [
      ['Construir de más', 'Agregar funcionalidades "por si acaso" alarga el desarrollo y retrasa el aprendizaje.'],
      ['No escribir la hipótesis', 'Sin una pregunta clara que responder, no hay forma de saber si el MVP funcionó.'],
      ['Lanzar sin medir', 'Un MVP sin analítica entrega opiniones, no datos para decidir.'],
      ['Elegir tecnología que no escala', 'Ahorrar hoy con una base frágil obliga a reconstruir todo cuando llega la tracción.'],
    ],
    ctaLabel: '¿Listo para validar?',
    ctaText: 'Cuéntanos tu idea y te proponemos el alcance de tu MVP.',
    ctaBook: 'Agenda una llamada',
    ctaWa: 'Escríbenos por WhatsApp',
    faqs: [
      { q: '¿Qué es un MVP o producto mínimo viable?', a: '<p>Es la versión más simple y funcional de un producto digital que resuelve un problema concreto y se lanza con usuarios reales para validar si el negocio funciona antes de invertir en la versión completa.</p>' },
      { q: '¿Cuánto cuesta desarrollar un MVP en Colombia?', a: '<p>En Agencia IDP desarrollamos MVPs desde 1.000 USD. El valor final depende del alcance, las integraciones y la plataforma (web, app móvil o ambas), y lo definimos después del sprint de ideación.</p>' },
      { q: '¿Cuánto tiempo toma desarrollar un MVP?', a: '<p>Depende del alcance. Al limitar el MVP a las funcionalidades esenciales, el objetivo es salir al mercado en semanas y no en meses. El cronograma exacto se acuerda al terminar la fase de ideación.</p>' },
      { q: '¿Cuál es la diferencia entre un MVP y un prototipo?', a: '<p>El prototipo sirve para explorar o mostrar una idea y suele ser simulado. El MVP es funcional, lo usan clientes reales y entrega datos de uso, conversión y retención para decidir.</p>' },
      { q: '¿Con qué tecnologías desarrollan los MVP?', a: '<p>Elegimos la tecnología según la idea y el presupuesto. Trabajamos con React, Next.js, Node.js, Flutter, MongoDB y AWS, entre otras, siempre pensando en que el producto pueda escalar.</p>' },
      { q: '¿Qué pasa después de lanzar el MVP?', a: '<p>Medimos los resultados y definimos una dirección con datos: escalar con confianza, ajustar el modelo o la audiencia, pivotear la solución o detener la idea antes de gastar más recursos.</p>' },
    ],
  },
  en: {
    toc: [
      { id: 'que-es-un-mvp', title: 'What an MVP is' },
      { id: 'mvp-vs-prototipo', title: 'MVP vs. prototype vs. full product' },
      { id: 'como-lo-hacemos', title: 'How we build an MVP' },
      { id: 'costo-y-tiempo', title: 'Cost and timeline' },
      { id: 'que-medir', title: 'What to measure after launch' },
      { id: 'errores', title: 'Mistakes that make an MVP expensive' },
      { id: 'preguntas-mvp', title: 'FAQ' },
    ],
    label: 'Guide · MVP development',
    title: 'How to validate your idea with an MVP before investing big',
    answerTag: 'Short answer',
    checks: ['Validates the hypothesis with real customers, not assumptions.', 'Lowers the initial investment by building only the essentials.', 'Produces data to decide the next step.', 'Shows real traction to partners and investors.'],
    h: ['What an MVP is and what it is for', 'MVP, prototype and full product: the differences', 'How we build an MVP at Agencia IDP', 'How much does an MVP cost and how long does it take?', 'What to measure after launch', 'Mistakes that make an MVP expensive', 'Frequently asked questions about MVP development'],
    tableIntro: 'Confusing them is one of the most common causes of overinvestment. This table sums up how they differ:',
    tableLabel: 'Comparison of prototype, MVP and full product',
    cols: ['Aspect', 'Prototype', 'MVP', 'Full product'],
    comparison: [
      ['Goal', 'Explore and communicate an idea', 'Validate the business with real users', 'Run and scale a proven business'],
      ['Users', 'Internal team or guided tests', 'Real customers in the market', 'The entire customer base'],
      ['Functionality', 'Simulated or partial', 'Only the essentials, but working', 'Complete and optimized'],
      ['Data it provides', 'Opinions', 'Real usage, conversion and retention', 'Growth metrics'],
      ['Investment risk', 'Low', 'Controlled', 'High if not validated first'],
    ],
    phases: [
      { name: 'Ideate', text: 'A Design Sprint–based sprint to understand the problem, frame the hypothesis and define scope: must-have features, architecture and user stories.' },
      { name: 'Develop', text: 'Planning, UX/UI design, development, QA testing and deployment. We build only the essentials, on an architecture that can grow if the business works.' },
      { name: 'Test the business', text: 'With our Venture Lab we take the MVP to market: we validate, attract real users, run operations, measure and optimize.' },
    ],
    from: 'From',
    price: 'USD 1,000',
    priceNote: 'The final price depends on scope, platform (web, app or both) and integrations. We set it at the end of the ideation phase, once scope is prioritized.',
    metricsIntro: 'An MVP is only as valuable as the data it delivers. These are the metrics we review in every cycle:',
    metrics: [
      ['Retention', 'How many users come back after the first week or month. It is the clearest sign that the problem is real.'],
      ['Conversion', 'What share of visitors sign up, pay or complete the product’s key action.'],
      ['CAC', 'How much it costs to acquire each customer. It tells you whether the model can grow profitably.'],
      ['Feature adoption', 'Which parts of the product are actually used and which can be dropped in the next version.'],
    ],
    outcomesIntro: 'With that data we choose one of four directions:',
    outcomes: ['Scale with confidence', 'Adjust with direction', 'Pivot', 'Stop in time'],
    mistakes: [
      ['Building too much', 'Adding features "just in case" stretches development and delays learning.'],
      ['Not writing down the hypothesis', 'Without a clear question to answer, there is no way to know whether the MVP worked.'],
      ['Launching without measuring', 'An MVP without analytics gives you opinions, not data to decide.'],
      ['Choosing tech that does not scale', 'Saving today on a fragile base forces a full rebuild once traction arrives.'],
    ],
    ctaLabel: 'Ready to validate?',
    ctaText: 'Tell us your idea and we will propose the scope of your MVP.',
    ctaBook: 'Book a call',
    ctaWa: 'Message us on WhatsApp',
    faqs: [
      { q: 'What is an MVP (minimum viable product)?', a: '<p>It is the simplest working version of a digital product that solves a specific problem and is launched with real users to validate whether the business works before investing in the full version.</p>' },
      { q: 'How much does it cost to build an MVP with a Colombian team?', a: '<p>At Agencia IDP we build MVPs starting at USD 1,000. The final price depends on scope, integrations and platform (web, mobile app or both), and we set it after the ideation sprint.</p>' },
      { q: 'How long does it take to build an MVP?', a: '<p>It depends on scope. By limiting the MVP to essential features, the goal is to reach the market in weeks, not months. The exact timeline is agreed at the end of the ideation phase.</p>' },
      { q: 'What is the difference between an MVP and a prototype?', a: '<p>A prototype is used to explore or present an idea and is usually simulated. An MVP works, is used by real customers and delivers usage, conversion and retention data to make decisions.</p>' },
      { q: 'What technologies do you use to build MVPs?', a: '<p>We choose the technology based on the idea and the budget. We work with React, Next.js, Node.js, Flutter, MongoDB and AWS, among others, always making sure the product can scale.</p>' },
      { q: 'What happens after the MVP launches?', a: '<p>We measure the results and set a data-driven direction: scale with confidence, adjust the model or audience, pivot the solution or stop the idea before spending more resources.</p>' },
    ],
  },
}

/** Preguntas de la guía en español (se reutilizan en otros lugares). */
export const mvpFaqs = copy.es.faqs

export function MvpGuide() {
  const lang = getLang()
  const c = copy[lang]
  const faqJson = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang === 'en' ? 'en' : 'es-CO',
    mainEntity: c.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') } })),
  }

  return (
    <section className="nx-section nx-guide" data-theme="light" aria-labelledby="guia-mvp">
      <div className="nx-wrap">
        <div className="nx-guide-head">
          <Label>{c.label}</Label>
          <h2 className="nx-h2" id="guia-mvp">
            {c.title}
          </h2>
          <div className="nx-answer">
            <p className="nx-answer-tag">{c.answerTag}</p>
            {lang === 'en' ? (
              <p>
                An <strong>MVP (minimum viable product)</strong> is the simplest working version of your digital product, launched with real users to prove whether the business works. At Agencia IDP we design it, build it and test it in the market with our{' '}
                <strong>Ideate + Develop + Test the business</strong> methodology, starting at <strong>USD 1,000</strong>.
              </p>
            ) : (
              <p>
                Un <strong>MVP (producto mínimo viable)</strong> es la versión más simple y funcional de tu producto digital, lanzada con usuarios reales para comprobar si el negocio funciona. En Agencia IDP lo diseñamos, lo desarrollamos y lo probamos en el mercado
                con nuestra metodología <strong>Idear + Desarrollar + Probar negocio</strong>, desde <strong>1.000 USD</strong>.
              </p>
            )}
          </div>
        </div>

        <div className="nx-guide-grid">
          <GuideToc items={c.toc} />

          <div className="nx-guide-body">
            <article id="que-es-un-mvp" className="nx-guide-block">
              <p className="nx-guide-num">01</p>
              <h3>{c.h[0]}</h3>
              {lang === 'en' ? (
                <p>
                  The term was popularized by Eric Ries’s <em>Lean Startup</em> method: build the minimum needed to learn from the market as fast as possible. It is not a “cheap” or unfinished version of the product; it is an experiment with one clear question:{' '}
                  <strong>does this business work or not?</strong>
                </p>
              ) : (
                <p>
                  El término se popularizó con el método <em>Lean Startup</em> de Eric Ries: construir lo mínimo necesario para aprender del mercado lo más rápido posible. No es una versión "barata" ni incompleta del producto; es un experimento con
                  una pregunta clara: <strong>¿este negocio funciona o no?</strong>
                </p>
              )}
              <ul className="nx-guide-checks">
                {c.checks.map((item) => (
                  <li key={item}>
                    <Check size={16} aria-hidden /> {item}
                  </li>
                ))}
              </ul>
            </article>

            <article id="mvp-vs-prototipo" className="nx-guide-block">
              <p className="nx-guide-num">02</p>
              <h3>{c.h[1]}</h3>
              <p>{c.tableIntro}</p>
              <div className="nx-guide-table" role="region" aria-label={c.tableLabel} tabIndex={0}>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">{c.cols[0]}</th>
                      <th scope="col">{c.cols[1]}</th>
                      <th scope="col" className="is-hl">
                        {c.cols[2]}
                      </th>
                      <th scope="col">{c.cols[3]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.comparison.map(([aspect, proto, mvp, full]) => (
                      <tr key={aspect}>
                        <th scope="row">{aspect}</th>
                        <td data-label={c.cols[1]}>{proto}</td>
                        <td data-label={c.cols[2]} className="is-hl">
                          {mvp}
                        </td>
                        <td data-label={c.cols[3]}>{full}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article id="como-lo-hacemos" className="nx-guide-block">
              <p className="nx-guide-num">03</p>
              <h3>{c.h[2]}</h3>
              {lang === 'en' ? (
                <p>
                  We work with the <Link href="/en/#metodologia">IDP methodology (Innovate by Developing Product)</Link>: three phases that take an idea from concept to code to market.
                </p>
              ) : (
                <p>
                  Trabajamos con la <Link href="/#metodologia">metodología IDP (Innova Desarrollando Producto)</Link>: tres fases que llevan la idea del concepto al código y al mercado.
                </p>
              )}
              <ol className="nx-guide-phases">
                {c.phases.map((phase, i) => (
                  <li key={phase.name}>
                    <span>0{i + 1}</span>
                    <strong>{phase.name}</strong>
                    <p>{phase.text}</p>
                  </li>
                ))}
              </ol>
            </article>

            <article id="costo-y-tiempo" className="nx-guide-block">
              <p className="nx-guide-num">04</p>
              <h3>{c.h[3]}</h3>
              <div className="nx-guide-price">
                <div>
                  <small>{c.from}</small>
                  <strong>{c.price}</strong>
                </div>
                <p>{c.priceNote}</p>
              </div>
              {lang === 'en' ? (
                <p>
                  On timing, the rule is simple: <strong>fewer features, faster learning</strong>. By limiting the MVP to the essentials, the goal is to reach the market in weeks, not months. If you need a dedicated team to keep going afterwards, we set it up through our{' '}
                  <Link href={pathOf('nearshore', 'en')}>nearshore software development in Colombia</Link> model.
                </p>
              ) : (
                <p>
                  En tiempo, la regla es simple: <strong>menos funcionalidades, más rápido el aprendizaje</strong>. Al limitar el MVP a lo esencial, el objetivo es salir al mercado en semanas y no en meses. Si necesitas un equipo dedicado para continuar
                  después, lo armamos con nuestro modelo de <Link href={pathOf('nearshore', 'es')}>software nearshore en Colombia</Link>.
                </p>
              )}
            </article>

            <article id="que-medir" className="nx-guide-block">
              <p className="nx-guide-num">05</p>
              <h3>{c.h[4]}</h3>
              <p>{c.metricsIntro}</p>
              <dl className="nx-guide-metrics">
                {c.metrics.map(([title, text]) => (
                  <div key={title}>
                    <dt>{title}</dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
              <p>{c.outcomesIntro}</p>
              <ul className="nx-guide-outcomes">
                {c.outcomes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article id="errores" className="nx-guide-block">
              <p className="nx-guide-num">06</p>
              <h3>{c.h[5]}</h3>
              <ul className="nx-guide-mistakes">
                {c.mistakes.map(([title, text]) => (
                  <li key={title}>
                    <i aria-hidden>
                      <X size={14} />
                    </i>
                    <div>
                      <strong>{title}</strong>
                      <p>{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>

            <article id="preguntas-mvp" className="nx-guide-block">
              <p className="nx-guide-num">07</p>
              <h3>{c.h[6]}</h3>
              <FaqList items={c.faqs} />
            </article>

            <aside className="nx-guide-cta">
              <div>
                <p className="nx-label">{c.ctaLabel}</p>
                <p>{c.ctaText}</p>
              </div>
              <div className="nx-actions">
                <Btn href="#agenda">{c.ctaBook}</Btn>
                <a className="nx-guide-link" href={site.whatsapp} target="_blank" rel="noopener noreferrer">
                  {c.ctaWa} <ArrowUpRight size={15} aria-hidden />
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson).replace(/</g, '\\u003c') }} />
    </section>
  )
}
