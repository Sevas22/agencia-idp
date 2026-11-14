import { ArrowRight, CalendarDays, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { ContactEmbed, Label } from '@/components/nx'
import { SocialIcon } from '@/components/social-icon'
import { pick } from '@/lib/i18n'
import { getLang, t } from '@/lib/lang'
import { site, socials } from '@/lib/site'

const channelsOf = () =>
  [
    { icon: 'whatsapp', title: 'WhatsApp', text: t('La forma más rápida de hablar con el equipo.', 'The fastest way to reach our team.'), cta: t('Escribir ahora', 'Message us'), href: site.whatsapp, external: true },
    { icon: 'calendar', title: t('Agenda una llamada', 'Book a call'), text: t('Elige el horario que te sirva en nuestro calendario.', 'Pick a time that works for you on our calendar.'), cta: t('Ver horarios', 'See times'), href: '#agenda', external: false },
    { icon: 'mail', title: t('Correo', 'Email'), text: site.email, cta: t('Enviar correo', 'Send an email'), href: `mailto:${site.email}`, external: false },
  ] as const

const nextStepsOf = () => [
  [t('Revisamos tu mensaje', 'We review your message'), t('Entendemos qué quieres construir y en qué etapa está tu idea.', 'We understand what you want to build and what stage your idea is at.')],
  [t('Llamada de diagnóstico', 'Discovery call'), t('Conversamos sobre objetivos, alcance y presupuesto.', 'We talk about goals, scope and budget.')],
  [t('Propuesta', 'Proposal'), t('Te enviamos el camino recomendado: alcance, tiempos y valor.', 'We send you the recommended path: scope, timeline and price.')],
]

// Presencia según la presentación corporativa de Agencia IDP.
const offices = { es: ['Colombia', 'Florida, EE. UU.'], en: ['Colombia', 'Florida, USA'] }
const hubs = {
  es: ['México', 'República Dominicana', 'Costa Rica', 'Miami', 'Nueva York', 'España', 'Brasil'],
  en: ['Mexico', 'Dominican Republic', 'Costa Rica', 'Miami', 'New York', 'Spain', 'Brazil'],
}

function ChannelIcon({ name }: { name: ReturnType<typeof channelsOf>[number]['icon'] }) {
  if (name === 'whatsapp') return <SocialIcon name="WhatsApp" size={22} />
  if (name === 'calendar') return <CalendarDays size={22} aria-hidden />
  return <Mail size={22} aria-hidden />
}

export function ContactPage() {
  const lang = getLang()
  const channels = channelsOf()
  const nextSteps = nextStepsOf()
  return (
    <div className="nx-page nx-contact2">
      <section className="nx-svchero" data-theme="light">
        <div className="nx-wrap">
          <Label>{t('Contacto', 'Contact')}</Label>
          <h1 className="nx-display">{t('Empecemos a construir tu idea', "Let's start building your idea")}</h1>
          <p className="nx-lead nx-contact2-lead">{t('Cuéntanos tu idea y te proponemos el mejor camino para llevarla al mercado.', 'Tell us about your idea and we will propose the best way to take it to market.')}</p>
          <ul className="nx-channels">
            {channels.map((channel) => (
              <li key={channel.title}>
                <a href={channel.href} {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  <span className="nx-channels-icon">
                    <ChannelIcon name={channel.icon} />
                  </span>
                  <strong>{channel.title}</strong>
                  <span className="nx-channels-text">{channel.text}</span>
                  <span className="nx-channels-cta">
                    {channel.cta} <ArrowRight size={16} className="nx-arrow" aria-hidden />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="nx-section nx-grey" data-theme="light">
        <div className="nx-wrap nx-contact2-grid">
          <div className="nx-contact2-form">
            <Label>{t('Formulario', 'Form')}</Label>
            <h2 className="nx-h2">{t('Envíanos un mensaje', 'Send us a message')}</h2>
            <p>{t('Déjanos tus datos y un asesor te contactará.', 'Leave your details and an advisor will contact you.')}</p>
            <ContactEmbed />
          </div>

          <aside className="nx-contact2-card" data-theme="dark">
            <p className="nx-label">{t('Datos de contacto', 'Contact details')}</p>
            <ul className="nx-contact2-list">
              <li>
                <Mail size={18} aria-hidden />
                <div>
                  <small>{t('Correo', 'Email')}</small>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </div>
              </li>
              <li>
                <Phone size={18} aria-hidden />
                <div>
                  <small>{t('Teléfono', 'Phone')}</small>
                  <a href={site.phoneHref}>{site.phone}</a>
                </div>
              </li>
              <li>
                <MapPin size={18} aria-hidden />
                <div>
                  <small>{t('Oficina', 'Office')}</small>
                  <span>{t('Medellín, Antioquia', 'Medellín, Colombia')}</span>
                </div>
              </li>
              <li>
                <Clock size={18} aria-hidden />
                <div>
                  <small>{t('Horario', 'Hours')}</small>
                  <span>{t('Lunes a domingo, 9:00 a 17:00', 'Monday to Sunday, 9:00 a.m. to 5:00 p.m. (COT)')}</span>
                </div>
              </li>
            </ul>

            <p className="nx-label">{t('¿Qué pasa después?', 'What happens next?')}</p>
            <ol className="nx-contact2-steps">
              {nextSteps.map(([title, text], i) => (
                <li key={title}>
                  <span>0{i + 1}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="nx-contact2-social">
              {socials.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                  <SocialIcon name={social.label} size={18} />
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="nx-section" data-theme="dark">
        <div className="nx-wrap nx-presence">
          <div>
            <Label>{t('Dónde estamos', 'Where we are')}</Label>
            <h2 className="nx-h2">{t('Escala global, operación conectada', 'Global scale, connected operations')}</h2>
          </div>
          <div className="nx-presence-groups">
            <div>
              <p>{t('Sedes principales', 'Main offices')}</p>
              <ul>
                {pick(lang, offices.es, offices.en).map((place) => (
                  <li key={place} className="is-main">
                    <MapPin size={15} aria-hidden /> {place}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p>{t('Talento remoto', 'Remote talent')}</p>
              <ul>
                {pick(lang, hubs.es, hubs.en).map((place) => (
                  <li key={place}>{place}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
