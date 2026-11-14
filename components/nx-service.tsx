import type { ReactNode } from 'react'
import { getClients, getProjects } from '@/lib/showcase'
import { pathOf } from '@/lib/i18n'
import { getLang, t } from '@/lib/lang'
import { Btn, Html, Label } from './nx'
import { LogoMarquee } from './logo-marquee'
import { ProjectRail } from './project-rail'

/**
 * Héroe claro de las páginas de servicio, con la estructura del referente:
 * etiqueta, título grande alineado a la izquierda, texto, acciones y la fila de clientes.
 */
export function ServiceHero({ label, title, html, children, aside }: { label: string; title: ReactNode; html?: string; children?: ReactNode; aside?: ReactNode }) {
  const clients = getClients()
  const copy = (
    <>
      <Label>{label}</Label>
      <h1 className="nx-display">{title}</h1>
      {html && <Html html={html} className="nx-lead" />}
      {children ?? (
        <div className="nx-actions">
          <Btn href="#agenda">{t('Agenda una llamada', 'Book a call')}</Btn>
        </div>
      )}
    </>
  )
  return (
    <section className={`nx-svchero ${aside ? 'has-aside' : ''}`} data-theme="light">
      <div className="nx-wrap">
        {aside ? (
          <div className="nx-svchero-grid">
            <div className="nx-svchero-copy">{copy}</div>
            <div className="nx-svchero-aside">{aside}</div>
          </div>
        ) : (
          copy
        )}
        <div className="nx-svchero-trust">
          <p>{t('Confían en nosotros', 'Trusted by')}</p>
          <LogoMarquee logos={clients} className="is-light" />
        </div>
      </div>
    </section>
  )
}

/** Proyectos recientes al cierre de cada servicio, antes de la agenda. */
export function RecentProjects() {
  return (
    <section className="nx-section" data-theme="light">
      <div className="nx-wrap">
        <div className="nx-head-row">
          <div>
            <Label>{t('Casos de éxito', 'Case studies')}</Label>
            <h2 className="nx-h2">{t('Proyectos recientes', 'Recent projects')}</h2>
            <p className="nx-lead nx-head-text">{t('Productos digitales que diseñamos, construimos y seguimos haciendo crecer.', 'Digital products we design, build and keep growing.')}</p>
          </div>
          <Btn href={pathOf('cases', getLang())}>{t('Ver todos los casos', 'View all case studies')}</Btn>
        </div>
        <ProjectRail projects={getProjects()} />
      </div>
    </section>
  )
}
