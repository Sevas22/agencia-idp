import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { ReactNode } from 'react'
import { ArrowRight, ArrowUpRight, Check, Play } from 'lucide-react'
import type { Img, Page } from '@/lib/content'
import { getClients, getProjects } from '@/lib/showcase'
import { pathOf } from '@/lib/i18n'
import { getLang, t } from '@/lib/lang'
import { site } from '@/lib/site'
import { Btn, ContactEmbed, FaqList, Html, Label, LightHead, NumberedList, Pic, StepLine, WorkTile } from './nx'
import { KineticBand } from './kinetic-band'
import { MvpGuide } from './mvp-guide'
import { CaseGallery, type CaseItem } from './case-gallery'
import { Nearshore } from './nx-pages'
import { BigCta, CtaButtons, FeatureGrid, HeroStats, MetricsBand, ProcessSteps, StackCards, strip } from './nx-svc'
import { RecentProjects, ServiceHero } from './nx-service'
import { ProjectRail } from './project-rail'
import { RevealText } from './reveal-text'
import { RotatingWord } from './rotating-word'
import { SmartLink } from './smart-link'

// Los bloques vienen del importador; cada página los ubica según su composición.
/* eslint-disable @typescript-eslint/no-explicit-any */
type B = any
const blocksOf = (page: Page) => page.sections.map((s) => s.blocks) as B[][]
const only = (list: B[], t: string) => list.filter((b) => b.t === t)
const extra = (): Record<string, Img> => JSON.parse(readFileSync(path.join(process.cwd(), 'content', 'extra-media.json'), 'utf8'))

const Checks = ({ items }: { items: string[] }) => (
  <ul className="nx-checks">
    {items.map((item) => (
      <li key={item}>
        <Check size={16} aria-hidden /> {item}
      </li>
    ))}
  </ul>
)

const Chips = ({ items }: { items: string[] }) => (
  <ul className="nx-chips">
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
)

/** Texto alternativo de un logo: el nombre del cliente si se conoce. */
const logoAlt = (image: Img) => {
  const name = image.alt || getClients().find((client) => client.src === image.src)?.alt
  return name && name !== 'Cliente de Agencia IDP' ? t(`Logo de ${name}`, `${name} logo`) : t('Logo de cliente de Agencia IDP', 'Agencia IDP client logo')
}

const Logos = ({ images, seven }: { images: Img[]; seven?: boolean }) => (
  <div className={`nx-logos ${seven ? 'is-seven' : ''}`}>
    {images.map((image) => (
      <span key={image.src}>
        <Pic image={image} alt={logoAlt(image)} />
      </span>
    ))}
  </div>
)

function ContactBand({ title, intro, rows, side, button }: { title: string; intro?: string; rows: [string, string][]; side: ReactNode; button: ReactNode }) {
  return (
    <section className="nx-section nx-grey" data-theme="light">
      <div className="nx-wrap nx-split">
        <div>
          <h2 className="nx-h3">{title}</h2>
          {intro && <Html html={intro} />}
          <dl className="nx-pairs">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="nx-band-side">
          {side}
          {button}
        </div>
      </div>
    </section>
  )
}

const FaqSection = ({ items, title }: { items: B[]; title?: string }) => (
  <section className="nx-section nx-center" data-theme="light">
    <div className="nx-wrap">
      <h2 className="nx-h2">{title ?? t("FAQ's", 'FAQ')}</h2>
      <FaqList items={items} />
    </div>
  </section>
)

function Mvp({ page }: { page: Page }) {
  const [, , intro, what, includes, who, whoEnd, tech, closing, numbers, last] = blocksOf(page)
  const statPairs = only(numbers, 'stat').map((stat, i) => ({ value: `${stat.value}${stat.suffix}`, label: stat.label, text: strip(only(numbers, 'rich')[i].html) }))
  return (
    <div className="nx-page">
      <ServiceHero
        label={t('Desarrollo de productos mínimos viables', 'MVP development')}
        title={
          <>
            {getLang() === 'en' ? (
              <>
                Your minimum viable product <RotatingWord words={['validated', 'built', 'tested', 'deployed']} /> with technology and strategy
              </>
            ) : (
              <>
                Tu producto mínimo viable <RotatingWord words={['validado', 'desarrollado', 'testeado', 'desplegado']} /> con tecnología y estrategia
              </>
            )}
          </>
        }
        html={intro[2].html}
        aside={
          <div className="nx-pricecard">
            <p className="nx-label">{intro[3].text}</p>
            <strong>{intro[4].text}</strong>
            <Chips items={getLang() === 'en' ? ['Scalable products', 'Fair price', 'Beautiful', 'UX/UI'] : ['Productos escalables', 'Precio justo', 'Bonitos', 'UX/UI']} />
            <p>{intro[5].text}</p>
            <Btn href={intro[6].href}>{intro[6].text}</Btn>
          </div>
        }
      >
        <div className="nx-actions">
          <Btn href={what[2].href}>{t("Quiero mi MVP", "I want my MVP")}</Btn>
          <Btn href="#agenda" variant="line">
            {t("Agenda una llamada", "Book a call")}
          </Btn>
        </div>
      </ServiceHero>

      <section className="nx-section nx-grey" data-theme="light">
        <div className="nx-wrap">
          <Label>{what[0].text}</Label>
          <RevealText className="nx-statement" text={t('Lanza solo lo esencial, pruébalo con usuarios reales y aprende antes de invertir más.', 'Launch only the essentials, test with real users and learn before investing more.')} />
          <FeatureGrid cols={4} items={(what[3].items as string[]).map((title) => ({ title }))} />
        </div>
      </section>

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap">
          <div className="nx-head-row">
            <div>
              <Label>{t("Nuestro servicio", "Our service")}</Label>
              <h2 className="nx-h2">{includes[1].text}</h2>
              <Html html={includes[2].html} className="nx-lead nx-head-text" />
            </div>
            <Btn href={includes[0].href}>{includes[0].text}</Btn>
          </div>
          <ProcessSteps items={only(includes, 'card').map((c) => ({ title: c.title, html: c.html }))} />
        </div>
      </section>

      <section className="nx-section nx-grey" data-theme="light">
        <div className="nx-wrap">
          <Label>{t("¿Para quién es?", "Who is it for?")}</Label>
          <h2 className="nx-h2">{who[0].text}</h2>
          <ul className="nx-whocards">
            {(who[1].items as string[]).map((item, i) => (
              <li key={item}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="nx-band">
            <h2>{whoEnd[0].text}</h2>
            <Btn href={whoEnd[1].href}>{whoEnd[1].text}</Btn>
          </div>
        </div>
      </section>

      <section className="nx-section nx-pad-bottom-0" data-theme="light">
        <div className="nx-wrap nx-head-row">
          <div>
            <Label>{t("Tecnología", "Technology")}</Label>
            <h2 className="nx-h2 nx-head-text">{tech[0].text}</h2>
          </div>
          <Btn href={tech[1].href}>{tech[1].text}</Btn>
        </div>
        <div className="nx-kinetic-wrap is-tight">
          <KineticBand rows={[tech[2].items.slice(0, 3), tech[2].items.slice(3, 6)]} />
        </div>
      </section>

      <MetricsBand items={statPairs} />

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap nx-split">
          <div>
            <Label>{t("Por qué un MVP", "Why an MVP")}</Label>
            <p className="nx-statement">{t("Menos riesgo, más aprendizaje y un producto listo para crecer.", "Less risk, more learning and a product ready to grow.")}</p>
            <p className="nx-lead">{closing[0].text}</p>
          </div>
          <Pic image={closing[2]} className="nx-split-photo is-short" />
        </div>
      </section>

      <BigCta
        label={t('¿Tienes una idea en mente?', 'Have an idea in mind?')}
        title={t('Validemos tu idea antes de invertir de más.', "Let's validate your idea before you overinvest.")}
        text={t('Cuéntanos qué quieres construir y te proponemos el MVP, la tecnología y el plan para salir al mercado.', 'Tell us what you want to build and we will propose the MVP, the technology and the go-to-market plan.')}
      >
        <CtaButtons href={last[0].href} text={t('Hablemos', "Let's talk")} />
      </BigCta>

      <MvpGuide />
      <RecentProjects />
    </div>
  )
}

function Transformacion({ page }: { page: Page }) {
  const [hero, steps, solutions, web, app, data, team] = blocksOf(page)
  const media = extra()
  const cards = only(solutions, 'card')
  // En el contenido importado los textos de «Diseño UX/UI» e «Ingeniería de software» venían cruzados.
  const solutionCards = cards.map((card, i) => ({ ...card, html: i === 1 ? cards[2].html : i === 2 ? cards[1].html : card.html, image: only(solutions, 'image')[i] }))
  const people = only(team, 'quote').map((quote, i) => ({ ...quote, image: only(team, 'image')[i] }))
  return (
    <div className="nx-page">
      <ServiceHero label={t('Transformación digital', 'Digital transformation')} title={hero[0].text} html={hero[1].html} aside={<Pic image={media.transformHero} alt={t("Equipo trabajando en la transformación digital de una empresa", "Team working on a company digital transformation")} className="nx-svchero-photo" eager />}>
        <div className="nx-actions">
          <Btn href={hero[2].href}>{hero[2].text}</Btn>
        </div>
      </ServiceHero>

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap">
          <Label>{t("Cómo empezamos", "How we start")}</Label>
          <h2 className="nx-h2">{steps[0].text}</h2>
          <ProcessSteps items={only(steps, 'card').map((c) => ({ title: c.title, html: c.html }))} />
        </div>
      </section>

      <section className="nx-section nx-grey" data-theme="light">
        <div className="nx-wrap">
          <Label>{t("Soluciones", "Solutions")}</Label>
          <h2 className="nx-h2">{solutions[0].text}</h2>
          <div className="nx-cards">
            {solutionCards.map((card) => (
              <WorkTile key={card.title} card={card} />
            ))}
          </div>
        </div>
      </section>

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap">
          <Label>{t("Lo que construimos", "What we build")}</Label>
          <h2 className="nx-h2">{t("Web, apps, IA y datos para transformar tu operación", "Web, apps, AI and data to transform your operations")}</h2>
          <StackCards
            items={[web, app, data].map((block, i) => ({
              label: (getLang() === 'en' ? ['Web development', 'Mobile apps', 'Artificial intelligence'] : ['Desarrollo web', 'Aplicaciones móviles', 'Inteligencia artificial'])[i],
              title: block[0].text,
              html: block[1].html,
              extra: block[2].html,
              cta: { href: block[3].href, text: block[3].text },
            }))}
          />
        </div>
      </section>

      <section className="nx-section nx-grey" data-theme="light">
        <div className="nx-wrap">
          <Label>{t("El equipo", "The team")}</Label>
          <h2 className="nx-h2 nx-head-text">{team[0].text}</h2>
          <div className="nx-quotes">
            {people.map((person) => (
              <figure key={person.name}>
                <blockquote>{person.text}</blockquote>
                <figcaption>
                  <Pic image={person.image} alt={person.name} />
                  <span>
                    <strong>{person.name}</strong>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <BigCta
        label={t('Transformación digital', 'Digital transformation')}
        title={t('Convirtamos tus ideas en cambios reales y duraderos.', "Let's turn your ideas into real, lasting change.")}
        text={t('Desde el concepto hasta el lanzamiento, te acompañamos con estrategia, diseño y tecnología.', 'From concept to launch, we support you with strategy, design and technology.')}
      >
        <CtaButtons href={hero[2].href} text={t('Hablemos', "Let's talk")} />
      </BigCta>
      <RecentProjects />
    </div>
  )
}

// Ancla de cada automatización: la del contenido original o una a partir del título.
const autoId = (row: B): string =>
  row.anchor ??
  row.card.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')

function Automatizaciones({ page }: { page: Page }) {
  const [hero, services, details] = blocksOf(page)
  const items = services.slice(2).reduce<B[]>((acc, b, i, all) => {
    if (b.t === 'heading') acc.push({ image: all[i - 1], title: b.text, html: all[i + 1].html, button: all[i + 2] })
    return acc
  }, [])
  const rows = details.reduce<B[]>((acc, b, i) => {
    if (b.t === 'card') acc.push({ card: b, anchor: details[i - 1]?.t === 'anchor' ? details[i - 1].id : undefined })
    return acc
  }, [])
  return (
    <div className="nx-page">
      <ServiceHero
        label={t('Automatizaciones con IA', 'AI automation')}
        title={hero[1].text}
        html={hero[4].html}
        aside={
          <div className="nx-orbit-icons" aria-hidden>
            {[hero[2], hero[3], hero[5], hero[6]].map((image) => (
              <span key={image.src}>
                <Pic image={image} alt={image.alt || t("Ícono de automatización con IA", "AI automation icon")} />
              </span>
            ))}
          </div>
        }
      >
        <div className="nx-actions">
          <Btn href={hero[8].href}>{hero[8].text}</Btn>
          <Btn href={hero[7].href} variant="line">
            {hero[7].text}
          </Btn>
        </div>
      </ServiceHero>

      <section className="nx-section nx-grey" data-theme="light">
        <div className="nx-wrap">
          <Label>{services[0].text}</Label>
          <RevealText className="nx-statement" text={t('Tu negocio responde, agenda y vende 24/7, sin sumar personal.', 'Your business answers, books and sells 24/7 without adding staff.')} />
        </div>
      </section>

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap">
          <h2 className="nx-h2">{t("Automatizamos procesos como", "We automate processes such as")}</h2>
          <div className="nx-auto-grid">
            {items.map((item) => (
              <article key={item.title}>
                <Pic image={item.image} alt={t(`Ilustración: ${item.title}`, `Illustration: ${item.title}`)} />
                <h3>{item.title}</h3>
                <Html html={item.html} />
                <SmartLink href={item.button.href} className="nx-more">
                  {item.button.text} <ArrowRight size={16} strokeWidth={2.2} className="nx-arrow" aria-hidden />
                </SmartLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="nx-section nx-autodetail-head" data-theme="light">
        <div className="nx-wrap">
          <Label>{t("En detalle", "In detail")}</Label>
          <h2 className="nx-h2">{t("Cada automatización, a la medida de tu negocio", "Every automation, tailored to your business")}</h2>
          <nav className="nx-autonav" aria-label={t('Automatizaciones', 'Automations')}>
            {rows.map(({ card }, index) => (
              <a key={card.title} href={`#${autoId(rows[index])}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {card.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {rows.map((row, index) => {
        const { card } = row
        const intro = (card.html.match(/<p>([\s\S]*?)<\/p>/)?.[1] ?? '') as string
        const benefits = [...(card.html as string).matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => {
          const [title, ...rest] = strip(m[1]).split(':')
          return { title: title.trim(), text: rest.join(':').trim() }
        })
        return (
          <section key={card.title} id={autoId(row)} className={`nx-section nx-autoblock ${index % 2 ? 'is-flipped nx-grey' : ''}`} data-theme="light">
            <div className="nx-wrap">
              <div className="nx-autoblock-top">
                <div>
                  <p className="nx-stack-label">
                    <span>{String(index + 1).padStart(2, '0')} / {String(rows.length).padStart(2, '0')}</span> Automatización con IA
                  </p>
                  <h2 className="nx-h2">{card.title}</h2>
                  <p className="nx-lead">{strip(intro)}</p>
                  <div className="nx-actions">
                    <Btn href={card.href ?? pathOf('contact', getLang())}>{card.cta ?? t('Necesito este servicio', 'I need this service')}</Btn>
                    <Btn href="#agenda" variant={index % 2 ? 'white' : 'line'}>
                      {t("Agenda una llamada", "Book a call")}
                    </Btn>
                  </div>
                </div>
                <figure className="nx-autoblock-media">
                  <Pic image={card.image} alt={card.title} />
                  <figcaption>
                    <strong>{benefits.length}</strong> beneficios
                  </figcaption>
                </figure>
              </div>
              <ul className="nx-benefits">
                {benefits.map((benefit) => (
                  <li key={benefit.title}>
                    <i aria-hidden>
                      <Check size={16} />
                    </i>
                    <strong>{benefit.title}</strong>
                    <p>{benefit.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )
      })}

      <BigCta
        label={t('Automatizaciones con IA', 'AI automation')}
        title={t('Deja que la IA atienda, agende y venda por ti.', 'Let AI answer, book and sell for you.')}
        text={t('Diseñamos la automatización que tu negocio necesita y la conectamos con tus canales.', 'We design the automation your business needs and connect it to your channels.')}
      >
        <CtaButtons href={hero[7].href} text={t('Contáctanos', 'Contact us')} />
      </BigCta>
      <RecentProjects />
    </div>
  )
}

function Colombia({ page }: { page: Page }) {
  const [hero, helped, why, services, workHead, work, cta] = blocksOf(page)
  const media = extra()
  const lead = hero[1]
  const pushleads = { kicker: work[3].text, title: work[4].text, html: work[5].html, image: work[2], href: work[6].href, cta: work[6].text }
  return (
    <div className="nx-page">
      <section className="nx-section nx-split-hero nx-grey" data-theme="light">
        <div className="nx-wrap nx-split">
          <div>
            <h1 className="nx-display">{hero[0].text}</h1>
            <Html html={lead.html} className="nx-lead" />
            <div className="nx-actions">
              <Btn href={lead.href}>{lead.cta ?? t('Charlemos por Whatsapp', 'Chat with us on WhatsApp')}</Btn>
            </div>
          </div>
          <div className="nx-photo-pair">
            <Pic image={hero[2].images[0]} eager />
            <Pic image={lead.image} eager />
            {hero[2].images.slice(1).map((image: Img) => (
              <Pic key={image.src} image={image} />
            ))}
          </div>
        </div>
      </section>

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap nx-split">
          <Pic image={media.colombiaPeople} alt={t('Reunión de trabajo en Agencia IDP', 'Team meeting at Agencia IDP')} className="nx-split-photo" />
          <div>
            <Label>{helped[0].title}</Label>
            <h2 className="nx-h2">{helped[1].text}</h2>
            <div className="nx-actions">
              <Btn href={helped[2].href}>{helped[2].text}</Btn>
            </div>
          </div>
        </div>
      </section>

      <section className="nx-section nx-grey" data-theme="light">
        <div className="nx-wrap nx-sticky-grid">
          <div className="nx-sticky">
            <Label>{why[0].title}</Label>
            <h2 className="nx-h2">{why[1].text}</h2>
            <Html html={why[2].html} />
          </div>
          <NumberedList items={why.slice(3).map((c) => ({ title: c.title }))} />
        </div>
      </section>

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap nx-sticky-grid">
          <div className="nx-sticky">
            <Label>{services[4].title}</Label>
            <h2 className="nx-h2">{services[5].text}</h2>
            <Html html={services[6].html} />
          </div>
          <NumberedList items={services.slice(0, 4).map((c) => ({ title: c.title, html: c.html }))} />
        </div>
      </section>

      <section className="nx-section nx-grey" data-theme="light">
        <div className="nx-wrap">
          <h2 className="nx-h2">{workHead[0].text}</h2>
          <Html html={workHead[1].html} className="nx-lead" />
          <div className="nx-cards">
            {[work[0], work[1], pushleads].map((card) => (
              <WorkTile key={card.title} card={card} />
            ))}
          </div>
        </div>
      </section>

      <section className="nx-orange-cta" data-theme="light">
        <div className="nx-wrap nx-split">
          <div>
            <Html html={cta[0].html} />
            <h2 className="nx-h2">{cta[1].text}</h2>
            <Html html={cta[2].html} />
            <SmartLink href={cta[3].href} className="nx-btn nx-btn-dark">
              {cta[3].text} <ArrowRight size={16} strokeWidth={2.2} className="nx-arrow" aria-hidden />
            </SmartLink>
          </div>
          <Pic image={cta[4]} alt={t("Equipo de Agencia IDP en una reunión de trabajo", "Agencia IDP team in a work meeting")} className="nx-split-photo is-short" />
        </div>
      </section>
      <RecentProjects />
    </div>
  )
}

const VideoLink = ({ text }: { text: string }) => (
  <SmartLink href={site.video} className="nx-play">
    <i>
      <Play size={14} fill="currentColor" aria-hidden />
    </i>
    {text}
  </SmartLink>
)

// Valores de la marca con una línea que explica cómo se viven en el trabajo diario.
const valueNotesEn: [string, string][] = [
  ['Responsibility', 'We deliver what we promise, on time and with quality.'],
  ['Optimization', 'We look for the simplest, most efficient way to solve every challenge.'],
  ['Empathy', 'We understand the business and the people before writing code.'],
  ['Passion', 'We love building products people actually use.'],
  ['Kind-hearted', 'Warm, honest relationships with clients and our team.'],
  ['Tech-geek', 'We try new technology to bring the best to every project.'],
]
const valueNotes: Record<string, [string, string]> = {
  RESPONSABILIDAD: ['Responsabilidad', 'Cumplimos lo que prometemos, en tiempos y en calidad.'],
  'OPTIMIZACIÓN': ['Optimización', 'Buscamos la forma más simple y eficiente de resolver cada reto.'],
  'EMPATÍA': ['Empatía', 'Entendemos el negocio y a las personas antes de escribir código.'],
  PASION: ['Pasión', 'Disfrutamos construir productos que la gente usa de verdad.'],
  'KIND-HEARTED': ['Kind-hearted', 'Trato cercano y honesto con clientes y con el equipo.'],
  'TECH-GEEK': ['Tech-geek', 'Probamos tecnología nueva para llevar lo mejor a cada proyecto.'],
}

const aboutStatsOf = () => [
  ['300+', t('Proyectos realizados', 'Projects delivered')],
  ['200+', t('Empresas impactadas', 'Companies served')],
  ['6+', t('Años de experiencia', 'Years of experience')],
  ['1 M+', t('Usuarios impactados', 'Users reached')],
]

function SobreNosotros({ page }: { page: Page }) {
  const [top, logos, projects, , faqs] = blocksOf(page)
  const people = only(top, 'person')
  const story = (top[3].html as string)
    .split('</p>')
    .filter((p) => p.trim())
    .map((p) => p + '</p>')
  const chapters = getLang() === 'en' ? ['The idea', 'The origin', 'The mission'] : ['La idea', 'El origen', 'La misión']
  return (
    <div className="nx-page">
      <section className="nx-abt-hero" data-theme="light">
        <div className="nx-wrap nx-abt-hero-grid">
          <div>
            <Label>{top[0].text}</Label>
            <h1 className="nx-display">{top[1].text}</h1>
            <p className="nx-lead">{t("Diseñamos, desarrollamos y hacemos crecer productos digitales para empresas que quieren ir un paso más allá.", "We design, build and grow digital products for companies that want to go one step further.")}</p>
            <div className="nx-actions">
              <Btn href="#agenda">{t("Agenda una llamada", "Book a call")}</Btn>
              <VideoLink text={t('Ver nuestro video', 'Watch our video')} />
            </div>
          </div>
          <dl className="nx-abt-stats">
            {aboutStatsOf().map(([value, label]) => (
              <div key={label}>
                <dd>{value}</dd>
                <dt>{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="nx-section nx-grey" data-theme="light">
        <div className="nx-wrap">
          <Label>{t("Lo que nos mueve", "What drives us")}</Label>
          <RevealText
            className="nx-statement"
            text={t('Las personas y las empresas están hechas para evolucionar. Nosotros damos el siguiente paso contigo.', 'People and companies are made to evolve. We take the next step with you.')}
          />
        </div>
      </section>

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap nx-sticky-grid">
          <div className="nx-sticky">
            <Label>{top[2].title}</Label>
            <h2 className="nx-h2">{t("Así nació Agencia IDP", "How Agencia IDP began")}</h2>
            <p>{t("De una idea simple a una empresa de innovación, con fábrica de software propia, que ayuda a sus clientes a vender más.", "From a simple idea to an innovation company, with its own software factory, that helps clients sell more.")}</p>
          </div>
          <ol className="nx-abt-story">
            {story.map((html, i) => (
              <li key={i}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{chapters[i] ?? ''}</h3>
                  <Html html={html} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="nx-section nx-grey" data-theme="light">
        <div className="nx-wrap">
          <Label>{top[4].title}</Label>
          <h2 className="nx-h2">{t("Lo que defendemos en cada proyecto", "What we stand for in every project")}</h2>
          <Html html={top[5].html} className="nx-lead nx-head-text" />
          <ul className="nx-abt-values">
            {(top[6].items as string[]).map((item, i) => {
              const [name, note] = (getLang() === 'en' ? valueNotesEn[i] : valueNotes[item]) ?? [item, '']
              return (
                <li key={item}>
                  <span>0{i + 1}</span>
                  <h3>{name}</h3>
                  <p>{note}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap">
          <div className="nx-head-row">
            <div>
              <Label>{t("Nuestro equipo", "Our team")}</Label>
              <h2 className="nx-h2">{t("Las personas detrás de cada proyecto", "The people behind every project")}</h2>
            </div>
            <Btn href={site.whatsapp}>{t("Trabaja con nosotros", "Work with us")}</Btn>
          </div>
          <div className="nx-abt-team">
            {people.map((person) => (
              <figure key={person.name}>
                <div>
                  <Pic image={person.image} alt={person.name} />
                </div>
                <figcaption>
                  <strong>{person.name}</strong>
                  <span>{person.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="nx-section nx-grey" data-theme="light">
        <div className="nx-wrap">
          <div className="nx-head-row">
            <div>
              <Label>{t("Clientes", "Clients")}</Label>
              <h2 className="nx-h2">{logos[0].text}</h2>
            </div>
            <p className="nx-abt-note">{t("Comercio, banca, salud, educación e industria: marcas que confiaron su producto digital a nuestro equipo.", "Retail, banking, healthcare, education and industry: brands that trusted our team with their digital product.")}</p>
          </div>
          <Logos images={only(logos, 'image')} seven />
        </div>
      </section>

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap">
          <div className="nx-head-row">
            <div>
              <Label>{t("Casos de éxito", "Case studies")}</Label>
              <h2 className="nx-h2">{projects[0].text}</h2>
              <Html html={projects[1].html} className="nx-head-text" />
            </div>
            <Btn href={pathOf('cases', getLang())}>{t("Ver todos los casos", "View all case studies")}</Btn>
          </div>
          <ProjectRail projects={getProjects()} />
        </div>
      </section>

      <section className="nx-section nx-abt-cta nx-grey" data-theme="light">
        <div className="nx-wrap">
          <Label>{t("Trabajamos con ambición", "We work with ambition")}</Label>
          <h2 className="nx-display">{t("¿Tienes un proyecto para empezar? Hablemos y creemos algo impresionante.", "Have a project to start? Let's talk and build something impressive.")}</h2>
          <dl className="nx-abt-contact">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </dd>
            </div>
            <div>
              <dt>{t("Teléfono", "Phone")}</dt>
              <dd>{site.phone}</dd>
            </div>
            <div>
              <dt>{t("Dirección", "Address")}</dt>
              <dd>{t("Medellín, Antioquia", "Medellín, Colombia")}</dd>
            </div>
          </dl>
          <div className="nx-actions">
            <Btn href={site.whatsapp}>{t("Inicia un proyecto", "Start a project")}</Btn>
            <Btn href="#agenda" variant="white">
              {t("Agenda una llamada", "Book a call")}
            </Btn>
          </div>
        </div>
      </section>
      <FaqSection items={only(faqs, 'faq')} />
    </div>
  )
}

function Shopify({ page }: { page: Page }) {
  const [top, features, contact, faqs] = blocksOf(page)
  return (
    <div className="nx-page">
      <ServiceHero label={t('Tiendas Shopify', 'Shopify stores')} title={top[0].text} />

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap nx-two">
          <div>
            <h2 className="nx-h3">{top[1].title}</h2>
            <Html html={top[2].html} />
            <Pic image={top[3]} className="nx-inline-photo" />
          </div>
          <div>
            <h2 className="nx-h3">{top[4].title}</h2>
            <Html html={top[5].html} />
            <Chips items={top[6].items} />
            <VideoLink text={top[8].text} />
          </div>
        </div>
        <div className="nx-wrap nx-video">
          <iframe src={top[7].src} title={t('Video de Agencia IDP', 'Agencia IDP video')} loading="lazy" allowFullScreen />
        </div>
      </section>

      <section className="nx-section nx-grey" data-theme="light">
        <div className="nx-wrap">
          <div className="nx-feature-grid">
            {features.map((card) => (
              <article key={card.html}>
                <Check size={20} aria-hidden />
                <h2>{card.title}</h2>
                <Html html={card.html} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContactBand
        title={contact[0].text}
        intro={contact[1].html}
        rows={[
          ['Email', site.email],
          ['Phone', site.phone],
        ]}
        side={
          <p className="nx-side-text">
            <small>Address</small>
            Medellín, Colombia
          </p>
        }
        button={<Btn href={contact[8].href}>{contact[8].text}</Btn>}
      />
      <FaqSection items={only(faqs, 'faq')} />
      <RecentProjects />
    </div>
  )
}

function Dominicana({ page }: { page: Page }) {
  const [top, logos, process, contact, faqs] = blocksOf(page)
  return (
    <div className="nx-page">
      <ServiceHero label="República Dominicana" title={top[0].text} />

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap nx-two">
          <div>
            <h2 className="nx-h3">{top[1].title}</h2>
            <Html html={top[2].html} />
          </div>
          <div>
            <h2 className="nx-h3">{top[4].title}</h2>
            <Html html={top[5].html} />
            <Chips items={top[6].items} />
          </div>
        </div>
        <div className="nx-wrap">
          <Pic image={top[3]} className="nx-wide-photo" />
        </div>
      </section>

      <section className="nx-section nx-center nx-grey" data-theme="light">
        <div className="nx-wrap">
          <h2 className="nx-h2">{logos[0].text}</h2>
          <Logos images={only(logos, 'image')} />
        </div>
      </section>

      <section className="nx-section nx-grey" data-theme="light">
        <div className="nx-wrap nx-sticky-grid">
          <div className="nx-sticky">
            <h2 className="nx-h2">{process[0].text}</h2>
            <Html html={process[1].html} />
            <div className="nx-actions">
              <Btn href={process[2].href}>{process[2].text}</Btn>
            </div>
          </div>
          <div className="nx-stack">
            {only(process, 'card').map((card) => (
              <article key={card.title}>
                <Pic image={card.image} alt={t(`Ilustración: ${card.title}`, `Illustration: ${card.title}`)} />
                <h3>{card.title}</h3>
                <Html html={card.html} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContactBand
        title={contact[0].text}
        rows={[['Email', site.email]]}
        side={
          <p className="nx-side-text">
            <small>Contacto</small>
            {contact[4].text}
          </p>
        }
        button={<Btn href={contact[5].href}>{contact[5].text}</Btn>}
      />
      <FaqSection items={only(faqs, 'faq')} />
      <RecentProjects />
    </div>
  )
}

function Secretaria({ page }: { page: Page }) {
  const [hero, row1, row2, funding, title, form] = blocksOf(page)
  const media = extra()
  const text: string = funding[0].text
  const highlight = '60% del costo'
  return (
    <div className="nx-page">
      <section className="nx-imagehero nx-grey" data-theme="light" style={{ backgroundImage: `linear-gradient(90deg, rgb(255 255 255 / .96), rgb(255 255 255 / .82)), url(${media.asociaciones.src})` }}>
        <div className="nx-wrap">
          <Label>{hero[2].text}</Label>
          <h1 className="nx-display">{hero[3].text}</h1>
          <Html html={hero[4].html} className="nx-lead" />
          <dl className="nx-stats is-left">
            {only(hero, 'stat').map((stat) => (
              <div key={stat.label}>
                <dd>{stat.value.replace(/DE(\d)/, 'DE $1')}</dd>
                <dt>{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap nx-five">
          {[...row1, ...row2].map((card, i) => (
            <article key={card.title} className={i % 2 ? 'is-black' : ''}>
              <h2>{card.title}</h2>
              <Html html={card.html} />
            </article>
          ))}
        </div>
      </section>

      <section className="nx-orange" data-theme="light">
        <p className="nx-wrap nx-orange-text">
          {text.split(highlight)[0]}
          <strong>{highlight}</strong>
          {text.split(highlight)[1]}
        </p>
      </section>

      <section className="nx-section nx-center" data-theme="light">
        <div className="nx-wrap">
          <h2 className="nx-h2">{title[0].text}</h2>
          <ContactEmbed />
          <Html html={form[1].html} className="nx-note" />
        </div>
      </section>
    </div>
  )
}

// Categorías del portafolio en el mismo orden de las secciones del contenido.
const caseCategoriesOf = () => (getLang() === 'en' ? ['Apps', 'WordPress', 'Shopify'] : ['Aplicaciones', 'WordPress', 'Shopify'])
// Correcciones de enlaces del contenido importado.
const caseLinks: Record<string, string> = { Posrank: 'https://posrank.co/' }
// Capturas actuales (2026-11-13) de los proyectos que también están en la vitrina.
const caseShots: Record<string, string> = { Capihost: 'capihost', 'Push Leads': 'pushleads', SEDEFY: 'sedefy' }

function CasosExito({ page }: { page: Page }) {
  const caseCategories = caseCategoriesOf()
  const items: CaseItem[] = blocksOf(page).flatMap((blocks, index) =>
    only(blocks, 'card').map((card) => {
      const text = strip(card.html).replace(new RegExp(`^${card.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i'), '')
      const kicker = (card.kicker as string).toLowerCase().replace(/^./, (c) => c.toUpperCase()).replace('wordpress', 'WordPress')
      const shot = caseShots[card.title]
      const image = shot ? { src: `/media/proyectos/${shot}-2026.webp`, width: 1440, height: 800, alt: card.title } : card.image
      return { title: card.title, text: text.replace(/^./, (c) => c.toUpperCase()), kicker, image, href: caseLinks[card.title] ?? card.href, category: caseCategories[index] ?? t('Otros', 'Other') }
    }),
  )
  return (
    <div className="nx-page">
      <ServiceHero
        label={t('Portafolio · Casos de éxito', 'Portfolio · Case studies')}
        title={t('Productos digitales que diseñamos, construimos y hacemos crecer', 'Digital products we design, build and grow')}
        html={t(
          '<p>Aplicaciones web y móviles, sitios en WordPress y tiendas Shopify para empresas de Colombia, Estados Unidos, México y Latinoamérica. Explora el trabajo y visita cada proyecto en vivo.</p>',
          '<p>Web and mobile apps, WordPress sites and Shopify stores for companies in Colombia, the United States, Mexico and Latin America. Explore our work and visit each project live.</p>',
        )}
        aside={
          <HeroStats
            items={[
              { value: String(items.length), label: t('Casos publicados', 'Published case studies') },
              { value: '300+', label: t('Proyectos realizados', 'Projects delivered') },
              { value: '200+', label: t('Empresas impactadas', 'Companies served') },
            ]}
          />
        }
      >
        <div className="nx-actions">
          <Btn href="#portafolio">{t("Ver portafolio", "View portfolio")}</Btn>
          <Btn href="#agenda" variant="line">
            {t("Agenda una llamada", "Book a call")}
          </Btn>
        </div>
      </ServiceHero>

      <section className="nx-section" id="portafolio" data-theme="light">
        <div className="nx-wrap">
          <div className="nx-head-row">
            <div>
              <Label>{t("Portafolio", "Portfolio")}</Label>
              <h2 className="nx-h2">{t("Explora nuestros proyectos", "Explore our projects")}</h2>
            </div>
            <p className="nx-abt-note">{t("Filtra por tipo de proyecto y abre cualquiera para verlo funcionando.", "Filter by project type and open any of them to see it live.")}</p>
          </div>
          <CaseGallery items={items} categories={caseCategories} />
        </div>
      </section>

      <section className="nx-section nx-grey" data-theme="light">
        <div className="nx-wrap">
          <Label>{t("Cómo los hacemos", "How we build them")}</Label>
          <RevealText className="nx-statement" text={t('Cada caso empezó como una idea. Hoy es un producto que funciona.', 'Every case started as an idea. Today it is a product that works.')} />
        </div>
      </section>

      <BigCta
        label={t('Tu proyecto', 'Your project')}
        title={t('¿Tu idea es nuestro próximo caso de éxito?', 'Is your idea our next success story?')}
        text={t('Cuéntanos qué quieres construir y te proponemos el camino: sitio web, tienda online o aplicación a la medida.', 'Tell us what you want to build and we will propose the path: website, online store or custom app.')}
      >
        <CtaButtons href={site.whatsapp} text={t('Hablemos', "Let's talk")} />
      </BigCta>
    </div>
  )
}

function WorkGrid({ page, linkText, title, label, intro }: { page: Page; linkText: string; title?: string; label: string; intro?: string }) {
  const sections = blocksOf(page)
  return (
    <div className="nx-page">
      <LightHead label={label} title={title ?? sections[0][0].text} text={intro} />
      {sections.map((blocks, index) => (
        <section key={index} className={`nx-section nx-pad-top-0 ${index ? 'nx-pad-top' : ''}`} data-theme="light">
          <div className="nx-wrap">
            {(title || index > 0) && <h2 className="nx-h2">{blocks[0].text}</h2>}
            <div className="nx-cards is-two">
              {only(blocks, 'card').map((card) => (
                <WorkTile key={card.title + card.href} card={card} linkText={linkText} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}

function Prose({ page }: { page: Page }) {
  const html: string = blocksOf(page)[0][0].html
  const match = html.match(/^\s*<h2>([\s\S]*?)<\/h2>/)
  const title = match ? match[1].replace(/<[^>]+>/g, '') : page.title
  return (
    <div className="nx-page">
      <ServiceHero label="Agencia de software" title={title} />
      <section className="nx-section" data-theme="light">
        <Html html={match ? html.slice(match[0].length) : html} className="nx-prose" />
      </section>
      <RecentProjects />
    </div>
  )
}

export const nxPages: Record<string, (props: { page: Page }) => ReactNode> = {
  'software-nearshore-en-colombia': Nearshore,
  'impulsa-desarrollo-producto-minimo-viable': Mvp,
  'empresa-de-transformacion-digital': Transformacion,
  'automatizaciones-con-ia': Automatizaciones,
  'agencia-de-software-en-colombia': Colombia,
  'transforma-agencia-software-colombia': SobreNosotros,
  'shopify-en-colombia': Shopify,
  'empresa-de-desarrollo-de-software-en-republica-dominicana': Dominicana,
  'secretaria-de-desarrollo-agropecurio-y-agencia-idp': Secretaria,
  'crea-paginas-web-profesionales-colombia': CasosExito,
  herramientas: (p) => <WorkGrid {...p} label={t('Herramientas', 'Tools')} linkText={t('Ver herramienta', 'View tool')} />,
  soluciones: (p) => <WorkGrid {...p} label="Productos propios" linkText="Visitar" />,
  'agencia-de-software-en-santa-marta': Prose,
}
