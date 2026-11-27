import Script from 'next/script'
import { ArrowUpRight } from 'lucide-react'
import { Btn, FaqList, Label, NumberedList, Pic } from '@/components/nx'
import { ProjectRail } from '@/components/project-rail'
import { getPage, read, readLocal, type Img } from '@/lib/content'
import { pathOf } from '@/lib/i18n'
import { getLang, t } from '@/lib/lang'
import { site } from '@/lib/site'
import { getClients, getProjects } from '@/lib/showcase'
import { LogoMarquee } from '@/components/logo-marquee'
import { RevealText } from '@/components/reveal-text'
import { IdpMethod } from '@/components/idp-method'

type HomeCopy = {
  intro: string
  about: string
  techIntro: string[]
  focus: string[]
  focusEnd: string
  techs: { title: string; pct: number; text: string; stack: string }[]
  services: { title: string; paragraphs: string[] }[]
  work: string
  testimonials: string[]
}
type HomeMedia = Record<'founder' | 'testimonios' | 'pintuco' | 'corpaul' | 'comfama' | 'humano' | 'starco' | 'logoCliente' | 't1' | 't2' | 't3', Img> & { brochure: string }

const testimonialPeople = [
  { name: 'Andrea Restrepo', role: 'CEO Mai.Techno', date: 'June, 19 2020', key: 't1' },
  { name: 'Cesar Muños', role: 'Head Of Marketing Blucorp', date: 'August, 14 2021', key: 't2' },
  { name: 'Laura Hernández', role: 'Brand Manager', date: 'January, 14 2022', key: 't3' },
] as const

/** Portada; la usan / (español) y /en/ (inglés). */
export async function HomePage() {
  const lang = getLang()
  const copy = readLocal<HomeCopy>('home.json')
  const media = read<HomeMedia>('home-media.json')
  const clients = getClients()
  const casesPath = pathOf('cases', lang)


  const cases = getPage('crea-paginas-web-profesionales-colombia').sections.flatMap((s) => s.blocks)
  // Un solo carrusel con las capturas completas de los proyectos, sin recortes.
  const shots = cases.flatMap((b) => (b.t === 'card' && b.image ? [{ image: b.image, title: b.title as string }] : [])).slice(0, 8)

  // Preguntas frecuentes de la portada: se muestran y se publican como FAQPage para Google y las IA.
  const homeFaqs = [
    { q: t('¿Qué es Agencia IDP?', 'What is Agencia IDP?'), a: t('Agencia IDP es una empresa de innovación con fábrica de software in house, con sede en Medellín, Colombia, y presencia en Florida, Estados Unidos. Su compromiso es que sus clientes vendan más en su negocio y con nuevos modelos de negocio digitales.', 'Agencia IDP is an innovation company with an in-house software factory, based in Medellín, Colombia, with presence in Florida, USA. Its commitment is to help clients sell more in their business and through new digital business models.') },
    { q: t('¿Qué servicios ofrece Agencia IDP?', 'What services does Agencia IDP offer?'), a: t('Desarrollo de MVP, software a la medida, apps móviles, automatizaciones con IA, equipos de software nearshore, tiendas Shopify, sitios web y diagnóstico SEO y GEO.', 'MVP development, custom software, mobile apps, AI automation, nearshore software teams, Shopify stores, websites and SEO and GEO audits.') },
    { q: t('¿Cuánto cuesta un proyecto con Agencia IDP?', 'How much does a project with Agencia IDP cost?'), a: t('Los MVP parten de 1.000 USD y los sitios web desde 310 USD. Los planes web y de SEO están publicados en la página de precios; el valor final depende del alcance.', 'MVPs start at USD 1,000 and websites at USD 310. Web and SEO plans are published on the pricing page; the final price depends on scope.') },
    { q: t('¿Cómo funciona la metodología IDP?', 'How does the IDP methodology work?'), a: t('Tiene tres fases: idear, con un Design Sprint que define la hipótesis y el alcance; desarrollar, con un sprint de construcción del MVP; y probar el negocio, con un Venture Lab que lanza y mide el producto con usuarios reales.', 'It has three phases: ideate, with a Design Sprint that defines the hypothesis and scope; develop, with an MVP build sprint; and test the business, with a Venture Lab that launches and measures the product with real users.') },
    { q: t('¿Cuánto tarda en estar listo un MVP?', 'How long does an MVP take?'), a: t('Depende del alcance y de las integraciones. Un MVP enfocado en un solo flujo se construye en semanas, no en meses, y se entrega por partes para que puedas revisar avances.', 'It depends on scope and integrations. An MVP focused on a single flow is built in weeks, not months, and delivered in increments so you can review progress.') },
    { q: t('¿Trabajan con empresas fuera de Colombia?', 'Do you work with companies outside Colombia?'), a: t('Sí. Trabajamos con empresas de Colombia, Estados Unidos y otros países, en español e inglés y en un horario compatible con Estados Unidos.', 'Yes. We work with companies in Colombia, the United States and other countries, in Spanish and English and in a time zone compatible with the US.') },
    { q: t('¿De quién es el código del proyecto?', 'Who owns the project code?'), a: t('Del cliente. Al terminar entregamos el código, los accesos y la documentación a nombre de tu empresa.', 'The client. At the end we deliver the code, access and documentation in your company name.') },
  ]

  const projects = getProjects()

  const [lowCode, software, marketing] = copy.services

  return (
    <div className="nx-page nx-home">
      <section className="nx-hero" data-theme="light">
        <div className="nx-wrap nx-hero-grid">
          <div className="nx-hero-copy">
            <p className="nx-now">{t('Agencia IDP · Empresa de innovación', 'Agencia IDP · Innovation company')}</p>
            <h1 className="nx-display">{t('Hacemos que tu negocio venda más', 'We help your business sell more')}</h1>
            <p className="nx-lead">
              {t('Somos una ', 'We are an ')}
              <strong>{t('empresa de innovación con fábrica de software in house', 'innovation company with an in-house software factory')}</strong>.
            </p>
            <p>
              {t(
                'Nuestro compromiso es que vendas más en tu negocio actual y con nuevos modelos de negocio digitales.',
                'Our commitment is to help you sell more in your current business and through new digital business models.',
              )}
            </p>
            <ul className="nx-hero-points">
              <li>{t('Innovación', 'Innovation')}</li>
              <li>{t('Fábrica de software in house', 'In-house software factory')}</li>
              <li>{t('Nuevos modelos de negocio digitales', 'New digital business models')}</li>
            </ul>
            <div className="nx-actions">
              <Btn href="#agenda">{t('Agenda una llamada', 'Book a call')}</Btn>
              <Btn href={casesPath} variant="white">
                {t('Ver casos de éxito', 'See case studies')}
              </Btn>
            </div>
          </div>
          <div className="nx-hero-media" aria-hidden>
            <div className="nx-hero-col">
              {[...shots, ...shots].map((shot, i) => (
                <figure key={i} className="nx-hero-shot">
                  <Pic image={shot.image} alt={t(`Proyecto ${shot.title} desarrollado por Agencia IDP`, `${shot.title} project built by Agencia IDP`)} eager={i < 2} />
                  <figcaption>{shot.title}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="nx-trust" data-theme="light">
        <div className="nx-wrap nx-trust-grid">
          <p>{t('Confían en nosotros', 'Trusted by')}</p>
          <LogoMarquee logos={clients} className="is-light" />
        </div>
      </section>

      <section className="nx-section" id="metodologia" data-theme="light">
        <div className="nx-wrap">
          <div className="nx-head-row">
            <div>
              <Label>{t('Metodología IDP · Innova Desarrollando Producto', 'IDP methodology · Innovate by Developing Product')}</Label>
              <h2 className="nx-h2">{t('Del concepto al código y al mercado', 'From concept to code to market')}</h2>
              <p className="nx-lead nx-head-text">
                {t(
                  'Idear + Desarrollar + Probar negocio. Nada de teorías complicadas, solo MVPs que funcionan y se validan con usuarios reales.',
                  'Ideate + Develop + Test the business. No complicated theory, just MVPs that work and are validated with real users.',
                )}
              </p>
            </div>
            <div className="nx-actions">
              <Btn href="#agenda">{t('Hablemos', "Let's talk")}</Btn>
              <Btn href={media.brochure} variant="white">
                {t('Descargar brochure', 'Download brochure')}
              </Btn>
            </div>
          </div>
          <IdpMethod />
        </div>
      </section>

      <section className="nx-section nx-grey" data-theme="light">
        <div className="nx-wrap nx-sticky-grid">
          <div className="nx-sticky">
            <Label>{t('Nuestro stack', 'Our stack')}</Label>
            <h2 className="nx-h2">{t('Tecnologías', 'Technologies')}</h2>
            <p className="nx-strong">{copy.techIntro[0]}</p>
            <p>{copy.techIntro[1]}</p>
          </div>
          <NumberedList items={copy.techs.map((tech) => ({ title: tech.title, meta: `${tech.pct}%`, text: tech.stack ? `${tech.text} ${tech.stack}` : tech.text }))} />
        </div>
        <div className="nx-wrap nx-focus">
          <p className="nx-label">{t('Nuestro enfoque incluye', 'Our approach includes')}</p>
          <ul>
            {copy.focus.map((text) => {
              const [title, ...rest] = text.split(':')
              return (
                <li key={title}>
                  <h3>{title}</h3>
                  <p>{rest.join(':').trim()}</p>
                </li>
              )
            })}
          </ul>
          <p className="nx-strong">{copy.focusEnd}</p>
        </div>
      </section>

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap">
          <div className="nx-head-row">
            <div>
              <Label>{t('Casos de éxito', 'Case studies')}</Label>
              <h2 className="nx-h2">{t('Proyectos realizados', 'Featured projects')}</h2>
            </div>
            <Btn href={casesPath}>{t('Ver todos', 'View all')}</Btn>
          </div>
          <ProjectRail projects={projects} />
        </div>
      </section>

      <section className="nx-section nx-grey" id="servicios" data-theme="light">
        <div className="nx-wrap">
          <Label>{t('Nuestros servicios', 'Our services')}</Label>
          <RevealText
            as="h2"
            className="nx-statement"
            text={t(
              'Nuestro compromiso: que vendas más en tu negocio y con nuevos modelos de negocio digitales.',
              'Our commitment: help you sell more in your business and through new digital business models.',
            )}
          />
          <div className="nx-trio is-row">
            <article>
              <h3>{lowCode.title}</h3>
              {lowCode.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
              <a href={site.servicesLink} target="_blank" rel="noopener noreferrer">
                {t('Más información', 'Learn more')} <ArrowUpRight size={15} aria-hidden />
              </a>
              <div className="nx-trio-shots" aria-hidden>
                {shots.slice(2, 5).map(({ image, title }) => (
                  <Pic key={image.src} image={image} alt={t(`Proyecto ${title} de Agencia IDP`, `${title} project by Agencia IDP`)} />
                ))}
              </div>
            </article>
            <article>
              <h3>{software.title}</h3>
              {software.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
              <a href={site.servicesLink} target="_blank" rel="noopener noreferrer">
                {t('Más información', 'Learn more')} <ArrowUpRight size={15} aria-hidden />
              </a>
              <ul className="nx-trio-tiles" aria-hidden>
                {['React', 'Angular', 'Flutter', 'Node JS', '.NET', 'Python'].map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </article>
            <article>
              <h3>{marketing.title}</h3>
              {marketing.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
              <a href={site.servicesLink} target="_blank" rel="noopener noreferrer">
                {t('Más información', 'Learn more')} <ArrowUpRight size={15} aria-hidden />
              </a>
              <ul className="nx-trio-rows" aria-hidden>
                {(lang === 'en' ? ['SEO', 'SEM', 'Social media', 'Data analytics'] : ['SEO', 'SEM', 'Redes sociales', 'Análisis de datos']).map((name) => (
                  <li key={name}>
                    {name} <ArrowUpRight size={14} />
                  </li>
                ))}
              </ul>
            </article>
          </div>
          <div className="nx-band">
            <div>
              <Label>{t('Contactar', 'Contact')}</Label>
              <h2>{t('Requieres alguno de estos servicios', 'Need any of these services?')}</h2>
            </div>
            <Btn href={site.calendar}>{t('Contactar', 'Contact us')}</Btn>
          </div>
        </div>
      </section>

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap">
          <h2 className="nx-h2">{t('Testimonios', 'Testimonials')}</h2>
          <p className="nx-lead">{t('Más de 200 empresas en todo el mundo han trabajado con nosotros', 'More than 200 companies around the world have worked with us')}</p>
          <div className="nx-ratings is-inline" aria-label={t('Calificaciones de clientes', 'Client ratings')}>
            <p className="nx-label">{t('Lo que dicen nuestros clientes', 'What our clients say')}</p>
            <div className="nx-ratings-widget" data-posrank-ratings="2c5acec9-f541-46d5-b660-a1687ed04f2e" data-template="platforms" data-theme="light" data-lang={lang} />
            <Script src="https://posrank.co/posrank-ratings.js?v=6" strategy="afterInteractive" />
          </div>
          <div className="nx-quotes">
            {testimonialPeople.map((person, index) => (
              <figure key={person.name}>
                <p className="nx-label">{person.date}</p>
                <blockquote>{copy.testimonials[index]}</blockquote>
                <figcaption>
                  <Pic image={media[person.key]} alt={t(`Foto de ${person.name}`, `Photo of ${person.name}`)} />
                  <span>
                    <strong>{person.name}</strong>
                    {person.role}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="nx-section nx-grey" id="preguntas" data-theme="light">
        <div className="nx-wrap nx-sticky-grid">
          <div className="nx-sticky">
            <Label>{t('Preguntas frecuentes', 'FAQ')}</Label>
            <h2 className="nx-h2">{t('Lo que nos preguntan antes de empezar', 'What clients ask before we start')}</h2>
            <p className="nx-lead">{t('Respuestas cortas sobre cómo trabajamos, costos y tiempos.', 'Short answers about how we work, costs and timelines.')}</p>
          </div>
          <FaqList items={homeFaqs.map((f) => ({ q: f.q, a: `<p>${f.a}</p>` }))} />
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: homeFaqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
            }).replace(/</g, '\\u003c'),
          }}
        />
      </section>
    </div>
  )
}
