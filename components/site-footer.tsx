import { ArrowRight } from 'lucide-react'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import Link from 'next/link'
import { getLang, t } from '@/lib/lang'
import { footerLinks, footerLinksEn, site, socials } from '@/lib/site'
import { SocialIcon } from './social-icon'

export function SiteFooter() {
  const links = getLang() === 'en' ? footerLinksEn : footerLinks
  const { ecoBadge } = JSON.parse(readFileSync(path.join(process.cwd(), 'content', 'extra-media.json'), 'utf8'))

  return (
    <>
      <section className="nx-schedule" id="agenda" data-theme="light">
        <div className="nx-wrap nx-schedule-grid">
          <div>
            <p className="nx-label">{t('Agenda una llamada', 'Book a call')}</p>
            <p className="nx-h2">{t('¡Hablemos de tu proyecto!', "Let's talk about your project")}</p>
            <p className="nx-lead">{t('Elige el horario que te sirva. En la llamada:', 'Pick a time that works for you. On the call:')}</p>
            <ul className="nx-schedule-checks">
              <li>{t('Revisamos tu idea o el producto que ya tienes.', 'We review your idea or the product you already have.')}</li>
              <li>{t('Te decimos qué construir primero y qué puede esperar.', 'We tell you what to build first and what can wait.')}</li>
              <li>{t('Te orientamos sobre tiempos y presupuesto.', 'We give you guidance on timeline and budget.')}</li>
            </ul>
            <ul className="nx-schedule-list">
              <li>
                <span>WhatsApp</span>
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
                  {site.phone}
                </a>
              </li>
              <li>
                <span>Email</span>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <span>{t('Dirección', 'Address')}</span>
                {site.city}
              </li>
            </ul>
            <a className="nx-btn nx-btn-line" href={site.startProject} target="_blank" rel="noopener noreferrer">
              {t('Prefiero escribir por WhatsApp', 'I prefer to message on WhatsApp')} <ArrowRight size={16} strokeWidth={2.2} className="nx-arrow" aria-hidden />
            </a>
          </div>
          <div className="nx-calendar">
            <iframe src={site.calendarEmbed} title={t('Agenda una llamada con Agencia IDP', 'Book a call with Agencia IDP')} loading="lazy" />
            <a href={site.calendar} target="_blank" rel="noopener noreferrer">
              {t('¿No carga el calendario? Ábrelo en una pestaña nueva', "Calendar not loading? Open it in a new tab")}
            </a>
          </div>
        </div>
      </section>

      <footer className="nx-footer" data-theme="dark">
        <div className="nx-wrap">
          <div className="nx-footer-main">
            <div className="nx-footer-brand">
              <img src="/brand/logo-agencia-idp-blanco.webp" alt="Agencia IDP" width={385} height={241} loading="lazy" />
              <p>{t('Creamos el futuro en cada desarrollo.', 'We build the future in every product.')}</p>
            </div>
            <nav aria-label={t('Más información', 'More information')}>
              <h2>{t('Más información', 'More information')}</h2>
              <ul>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label={t('Redes sociales', 'Social media')}>
              <h2>{t('Redes sociales', 'Social media')}</h2>
              <ul>
                {socials.map((social) => (
                  <li key={social.label}>
                    <a className="nx-footer-social" href={social.href} target="_blank" rel="noopener noreferrer">
                      <SocialIcon name={social.label} />
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="nx-footer-contact">
              <h2>{t('Contacto', 'Contact')}</h2>
              <dl>
                <div>
                  <dt>{t('Dirección', 'Address')}</dt>
                  <dd>{site.city}</dd>
                </div>
                <div>
                  <dt>{t('Teléfono', 'Phone')}</dt>
                  <dd>
                    <a href={site.phoneHref}>{site.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="nx-footer-end">
            <p>Copyright © IDP Agency LLC {new Date().getFullYear()}. All rights reserved.</p>
            <p className="nx-footer-eco">
              <img src={ecoBadge.src} alt={t('Sello de sitio web ecológico', 'Eco-friendly website badge')} width={ecoBadge.width} height={ecoBadge.height} loading="lazy" />
              <span>
                {t('Gracias a este sitio web, estamos', 'Thanks to this website, we are')}{' '}
                <a href="https://capihost.com/" target="_blank" rel="noopener noreferrer">
                  {t('reforestando la amazonía', 'reforesting the Amazon')}
                </a>
                .
              </span>
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
