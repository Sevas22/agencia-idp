import { getFaqGroups, plainAnswer } from '@/lib/faqs'
import type { Seo } from '@/lib/content'
import { pathOf, type Lang } from '@/lib/i18n'
import { getLang, t } from '@/lib/lang'
import { site } from '@/lib/site'
import { DarkHero, FaqList, Label } from './nx'
import { BigCta, CtaButtons } from './nx-svc'

/** Título y descripción de la página en cada idioma. */
export const faqSeo = (lang: Lang): Seo =>
  lang === 'en'
    ? { title: 'Agencia IDP FAQ: services, pricing and process', description: 'Straight answers about Agencia IDP: who we are, MVPs, custom software, AI automation, website and SEO pricing, timelines and code ownership.', image: null }
    : { title: 'Preguntas frecuentes sobre Agencia IDP | Precios y servicios', description: 'Respuestas directas sobre Agencia IDP: quiénes somos, MVP, software a la medida, IA, precios de páginas web y SEO, tiempos y propiedad del código.', image: null }

const json = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c')

/** Página de preguntas frecuentes: todas las respuestas sobre Agencia IDP en un solo lugar (GEO). */
export function FaqPage() {
  const lang = getLang()
  const groups = getFaqGroups(lang)
  const url = `${site.url}${pathOf('faq', lang)}`
  const total = groups.reduce((sum, group) => sum + group.items.length, 0)

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        url,
        inLanguage: lang === 'en' ? 'en-US' : 'es-CO',
        about: { '@type': 'Organization', name: site.name, url: site.url },
        mainEntity: groups.flatMap((group) =>
          group.items.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: plainAnswer(item.a) } })),
        ),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('Inicio', 'Home'), item: `${site.url}${pathOf('home', lang)}` },
          { '@type': 'ListItem', position: 2, name: t('Preguntas frecuentes', 'FAQ'), item: url },
        ],
      },
    ],
  }

  return (
    <div className="nx-page nx-faqpage">
      <DarkHero label="Agencia IDP" title={t('Preguntas frecuentes', 'Frequently asked questions')}>
        <p className="nx-lead nx-measure">
          {t(
            `${total} respuestas directas sobre quiénes somos, qué construimos, cuánto cuesta y cómo trabajamos.`,
            `${total} straight answers about who we are, what we build, what it costs and how we work.`,
          )}
        </p>
        <nav className="nx-blogcats nx-faq-index" aria-label={t('Temas', 'Topics')}>
          {groups.map((group) => (
            <a key={group.id} href={`#${group.id}`}>
              {group.title} <small>{group.items.length}</small>
            </a>
          ))}
        </nav>
      </DarkHero>

      {groups.map((group, index) => (
        <section key={group.id} id={group.id} className={`nx-section ${index % 2 ? 'nx-grey' : ''}`} data-theme="light">
          <div className="nx-wrap nx-sticky-grid">
            <div className="nx-sticky">
              <Label>{String(index + 1).padStart(2, '0')}</Label>
              <h2 className="nx-h2">{group.title}</h2>
              <p className="nx-lead">{group.lead}</p>
            </div>
            <FaqList items={group.items} />
          </div>
        </section>
      ))}

      <BigCta
        label={t('¿No encontraste tu respuesta?', "Didn't find your answer?")}
        title={t('Pregúntanos directamente', 'Ask us directly')}
        text={t('Te respondemos por WhatsApp o en una llamada gratuita.', 'We reply on WhatsApp or on a free call.')}
      >
        <CtaButtons href={site.whatsapp} text={t('Escribir por WhatsApp', 'Message on WhatsApp')} />
      </BigCta>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(schema) }} />
    </div>
  )
}
