import type { Page } from '@/lib/content'
import { Btn, FaqList, Html, Label, Pic } from './nx'
import { RecentProjects, ServiceHero } from './nx-service'
import { t } from '@/lib/lang'
import { BigCta, CtaButtons, FeatureGrid, HeroStats, HoverList, ProcessSteps, strip } from './nx-svc'

// Los bloques vienen del importador; cada página los ubica según su composición.
/* eslint-disable @typescript-eslint/no-explicit-any */
type B = any
const blocksOf = (page: Page) => page.sections.map((s) => s.blocks) as B[][]

export function Nearshore({ page }: { page: Page }) {
  const [hero, why, reasons, services, process, cases, stats, faqs, cta] = blocksOf(page)
  const reasonItems = reasons.flatMap((b, i) => (b.t === 'heading' ? [{ title: (b.text as string).replace(/\.$/, ''), text: strip(reasons[i + 1].html).replace(/^./, (c) => c.toUpperCase()) }] : []))
  const steps = process.slice(2).reduce<{ title: string; html: string }[]>((acc, b, i, all) => {
    if (b.t === 'heading' && /^\d$/.test(b.text)) acc.push({ title: all[i + 1].text, html: all[i + 2].html })
    return acc
  }, [])
  const people = cases.flatMap((b, i) => (b.t === 'card' ? [{ ...b, quote: cases[i + 1].html as string }] : []))
  // Los servicios vienen con emojis al inicio; se quitan para la lista grande.
  const serviceItems = (services[3].items as string[]).map((item) => item.replace(/^[^\p{L}]+/u, ''))
  const statItems = stats.map((stat) => ({ value: `${stat.value}${stat.suffix}`, label: stat.label.replace('trabajr', 'trabajar') }))

  return (
    <div className="nx-page">
      <ServiceHero label={why[0].text} title={hero[1].text} html={hero[2].html} aside={<HeroStats items={statItems} />}>
        <div className="nx-actions">
          <Btn href={hero[3].href}>{hero[3].text}</Btn>
          <Btn href="#agenda" variant="line">
            {t('Agenda una llamada', 'Book a call')}
          </Btn>
        </div>
      </ServiceHero>

      <section className="nx-section" data-theme="dark">
        <div className="nx-wrap">
          <Label>{why[0].text}</Label>
          <h2 className="nx-h2">{why[1].text}</h2>
          <Html html={why[2].html} className="nx-lead nx-head-text" />
          <FeatureGrid items={reasonItems} />
        </div>
      </section>

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap nx-sticky-grid">
          <div className="nx-sticky">
            <Label>{services[0].text}</Label>
            <h2 className="nx-h2">{services[1].text}</h2>
            <Html html={services[2].html} />
            <Pic image={services[4]} className="nx-sticky-photo" />
          </div>
          <HoverList items={serviceItems} />
        </div>
      </section>

      <section className="nx-section nx-grey" data-theme="light">
        <div className="nx-wrap">
          <Label>{process[0].text}</Label>
          <h2 className="nx-h2">{process[1].text}</h2>
          <ProcessSteps items={steps} />
        </div>
      </section>

      <section className="nx-section" data-theme="dark">
        <div className="nx-wrap">
          <Label>{cases[0].text}</Label>
          <h2 className="nx-h2">{cases[1].text}</h2>
          <div className="nx-quotes is-dark">
            {people.map((person) => (
              <figure key={person.title}>
                <Html html={person.quote} className="nx-quote-text" />
                <figcaption>
                  <Pic image={person.image} alt="" />
                  <span>
                    <strong>{person.title}</strong>
                    <Html html={person.html} />
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap nx-sticky-grid">
          <div className="nx-sticky">
            <Label>{t('Preguntas frecuentes', 'FAQ')}</Label>
            <h2 className="nx-h2">{faqs[0].text}</h2>
            <Html html={faqs[1].html} className="nx-lead" />
          </div>
          <FaqList items={faqs.filter((b) => b.t === 'faq')} />
        </div>
      </section>

      <BigCta label={t('Software nearshore', 'Nearshore software development')} title={cta[0].text} text={strip(cta[1].html)}>
        <CtaButtons href={cta[2].href} text={cta[2].text} />
      </BigCta>
      <RecentProjects />
    </div>
  )
}
