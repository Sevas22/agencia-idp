'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLang, useT } from './lang-context'

// Metodología IDP tomada de la presentación corporativa de la empresa.
const phasesEs = [
  {
    name: 'Idear',
    sprint: 'Sprint de ideación del MVP',
    text: 'De una idea básica a una estructura clara: hipótesis, funcionalidades, arquitectura e historias de usuario.',
    steps: [
      ['Comprender', 'Definimos el problema, el contexto, las capacidades y el timing.'],
      ['Idear', 'Revisamos soluciones existentes y aportamos ideas sobre el "cómo".'],
      ['Decidir y plasmar', 'Hipótesis, boceto del MVP, arquitectura y prioridades.'],
    ],
  },
  {
    name: 'Desarrollar',
    sprint: 'Sprint de construcción del MVP',
    text: 'Un MVP rápido, ligero, escalable e impecable en UX/UI: plataformas, apps, IA e integraciones.',
    steps: [
      ['Planificación', 'Requisitos y alcance definidos antes de escribir código.'],
      ['Diseño', 'Arquitectura, modelo de datos y diseño UI/UX.'],
      ['Desarrollo', 'Código a la medida siguiendo la arquitectura.'],
      ['Pruebas QA', 'Verificamos cada funcionalidad antes de lanzar.'],
      ['Despliegue', 'El producto sale a producción.'],
    ],
  },
  {
    name: 'Probar negocio',
    sprint: 'Venture Lab',
    text: 'Una célula de venture lanza, opera y valida tu producto en el mercado real. Lo hacemos contigo.',
    steps: [
      ['Definimos', 'Hipótesis, experimentos y estrategias.'],
      ['Atraemos', 'Usuarios reales con estrategias probadas.'],
      ['Gestionamos', 'La operación comercial punta a punta.'],
      ['Medimos', 'Comportamientos clave y resultados de negocio.'],
      ['Optimizamos', 'Iteramos para aprender más rápido.'],
    ],
  },
]

const phasesEn: typeof phasesEs = [
  {
    name: 'Ideate',
    sprint: 'MVP ideation sprint',
    text: 'From a basic idea to a clear structure: hypotheses, features, architecture and user stories.',
    steps: [
      ['Understand', 'We define the problem, context, capabilities and timing.'],
      ['Ideate', 'We review existing solutions and bring ideas on the "how".'],
      ['Decide and map', 'Hypothesis, MVP sketch, architecture and priorities.'],
    ],
  },
  {
    name: 'Develop',
    sprint: 'MVP build sprint',
    text: 'A fast, lean, scalable MVP with flawless UX/UI: platforms, apps, AI and integrations.',
    steps: [
      ['Planning', 'Requirements and scope defined before writing code.'],
      ['Design', 'Architecture, data model and UI/UX design.'],
      ['Development', 'Custom code that follows the architecture.'],
      ['QA testing', 'We verify every feature before launch.'],
      ['Deployment', 'The product goes live in production.'],
    ],
  },
  {
    name: 'Test the business',
    sprint: 'Venture Lab',
    text: 'A venture cell launches, runs and validates your product in the real market. We do it with you.',
    steps: [
      ['Define', 'Hypotheses, experiments and strategies.'],
      ['Attract', 'Real users with proven strategies.'],
      ['Manage', 'End-to-end commercial operations.'],
      ['Measure', 'Key behaviors and business results.'],
      ['Optimize', 'We iterate to learn faster.'],
    ],
  },
]

const STICKY_TOP = 96

/**
 * Las tres fases de la metodología. En escritorio la sección se queda fija y avanza con el scroll:
 * cada fase enciende sus pasos uno a uno. En pantallas pequeñas (o con movimiento reducido) son pestañas.
 */
export function IdpMethod() {
  const lang = useLang()
  const t = useT()
  const phases = lang === 'en' ? phasesEn : phasesEs
  const track = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [pinned, setPinned] = useState(false)
  const [active, setActive] = useState(0)
  const [phaseProgress, setPhaseProgress] = useState(0)

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1121px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)')
    const sync = () => setPinned(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!pinned) return
    let frame = 0
    const update = () => {
      frame = 0
      const el = track.current
      const box = stage.current
      if (!el || !box) return
      const total = el.offsetHeight - box.offsetHeight
      const p = Math.min(0.9999, Math.max(0, (STICKY_TOP - el.getBoundingClientRect().top) / total))
      const value = p * phases.length
      setActive(Math.floor(value))
      setPhaseProgress(value - Math.floor(value))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [pinned])

  const goTo = useCallback(
    (i: number) => {
      const el = track.current
      const box = stage.current
      if (!pinned || !el || !box) return setActive(i)
      const total = el.offsetHeight - box.offsetHeight
      const top = el.getBoundingClientRect().top + window.scrollY - STICKY_TOP
      window.scrollTo({
        top: top + (total * (i + 0.08)) / phases.length,
        behavior: 'smooth',
      })
    },
    [pinned],
  )

  const litCount = (i: number) => {
    if (!pinned || i < active) return phases[i].steps.length
    if (i > active) return 0
    return Math.min(phases[i].steps.length, Math.max(1, Math.ceil(phaseProgress * 1.25 * phases[i].steps.length)))
  }

  return (
    <div className="nx-method">
      <div ref={track} className={`nx-method-track ${pinned ? 'is-pinned' : ''}`} style={pinned ? { height: `${phases.length * 60}vh` } : undefined}>
        <div ref={stage} className="nx-method-stage">
          <div className="nx-method-rail" role="tablist" aria-label={t('Fases de la metodología IDP', 'IDP methodology phases')}>
            {phases.map((phase, i) => (
              <button
                key={phase.name}
                type="button"
                role="tab"
                id={`metodo-tab-${i}`}
                aria-selected={active === i}
                aria-controls={`metodo-panel-${i}`}
                className={`${active === i ? 'is-active' : ''} ${i < active ? 'is-done' : ''}`}
                onClick={() => goTo(i)}
              >
                <span className="nx-method-rail-num">0{i + 1}</span>
                <span className="nx-method-rail-name">{phase.name}</span>
                <i aria-hidden>
                  <b
                    style={{
                      transform: `scaleX(${i < active ? 1 : i === active ? (pinned ? phaseProgress : 1) : 0})`,
                    }}
                  />
                </i>
              </button>
            ))}
          </div>

          {phases.map((phase, i) => {
            const lit = litCount(i)
            return (
              <div key={phase.name} role="tabpanel" id={`metodo-panel-${i}`} aria-labelledby={`metodo-tab-${i}`} hidden={active !== i} className="nx-method-panel">
                <div className="nx-method-copy">
                  <span className="nx-method-big" aria-hidden>
                    0{i + 1}
                  </span>
                  <p className="nx-label">{phase.sprint}</p>
                  <h3>{phase.name}</h3>
                  <p>{phase.text}</p>
                  <p className="nx-method-count">
                    <strong>{String(lit).padStart(2, '0')}</strong> / {String(phase.steps.length).padStart(2, '0')} {t('pasos', 'steps')}
                  </p>
                </div>
                <ol>
                  {phase.steps.map(([title, text], j) => (
                    <li key={title} className={`${j < lit ? 'is-lit' : ''} ${j === lit - 1 && pinned ? 'is-current' : ''}`}>
                      <span>{String(j + 1).padStart(2, '0')}</span>
                      <div>
                        <strong>{title}</strong>
                        <p>{text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )
          })}
          {pinned && <p className="nx-method-hint">{t('Desplázate para recorrer las fases', 'Scroll to move through the phases')}</p>}
        </div>
      </div>
    </div>
  )
}
