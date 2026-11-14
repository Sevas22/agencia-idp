'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { Img } from '@/lib/content'
import { useT } from './lang-context'

export type Project = { tag: string; name: string; text: string; chips: string[]; href: string; image: Img }

const domain = (href: string) => href.replace(/^https?:\/\//, '').replace(/\/$/, '')

/** Captura completa del sitio dentro de una ventana de navegador. */
function BrowserShot({ project, eager }: { project: Project; eager?: boolean }) {
  const t = useT()
  return (
    <span className="nx-showcase-frame">
      <span className="nx-showcase-bar" aria-hidden>
        <i />
        <i />
        <i />
        <span>{domain(project.href)}</span>
      </span>
      <img src={project.image.src} alt={`${t('Sitio de', 'Website of')} ${project.name}`} width={project.image.width} height={project.image.height} loading={eager ? 'eager' : 'lazy'} />
    </span>
  )
}

/**
 * Vitrina de proyectos: lista a la izquierda y vista previa grande a la derecha que cambia
 * al pasar el cursor o enfocar cada proyecto. En pantallas pequeñas se muestran como tarjetas apiladas.
 */
export function ProjectRail({ projects }: { projects: Project[] }) {
  const t = useT()
  const [active, setActive] = useState(0)
  const current = projects[active]

  return (
    <div className="nx-showcase">
      <ol className="nx-showcase-list">
        {projects.map((project, i) => (
          <li key={project.name} className={active === i ? 'is-active' : undefined} onMouseEnter={() => setActive(i)}>
            <a href={project.href} target="_blank" rel="noopener noreferrer" onFocus={() => setActive(i)}>
              <span className="nx-showcase-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="nx-showcase-info">
                <span className="nx-showcase-name">
                  <strong>{project.name}</strong>
                  <small>{project.tag}</small>
                </span>
                <span className="nx-showcase-text">{project.text}</span>
                <span className="nx-showcase-chips">
                  {project.chips.map((chip) => (
                    <small key={chip}>{chip}</small>
                  ))}
                </span>
                <span className="nx-showcase-mobile">
                  <BrowserShot project={project} />
                </span>
              </span>
              <ArrowUpRight className="nx-showcase-arrow" size={26} aria-hidden />
            </a>
          </li>
        ))}
      </ol>

      <div className="nx-showcase-preview" aria-hidden>
        {projects.map((project, i) => (
          <div key={project.name} className={`nx-showcase-slide ${active === i ? 'is-active' : ''}`}>
            <BrowserShot project={project} eager={i === 0} />
          </div>
        ))}
        <a className="nx-showcase-visit" href={current.href} target="_blank" rel="noopener noreferrer" tabIndex={-1}>
          {t('Visitar', 'Visit')} {current.name} <ArrowUpRight size={15} />
        </a>
      </div>
    </div>
  )
}
