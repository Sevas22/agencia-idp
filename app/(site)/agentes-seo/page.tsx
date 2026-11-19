import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import { Label, NumberedList, StepLine } from '@/components/nx'
import { CheckoutDialog } from '@/components/seo-tools'
import { buildMetadata, getSeo } from '@/lib/content'

export const metadata: Metadata = buildMetadata(getSeo('agentes-seo'), '/agentes-seo/')

const steps = [
  ['Cuéntanos tu dominio', 'Tu nombre, tu correo y la dirección de tu sitio. Toma menos de un minuto y no hay que instalar nada.'],
  ['Analizamos tu sitio de verdad', 'Rastreamos tu página como lo hacen Google y los bots de IA: etiquetas, Schema.org, robots.txt, velocidad y contenido.'],
  ['Recibes tu informe', 'Hallazgos priorizados por impacto, recomendaciones concretas y una hoja de ruta por fases. Tuyo para siempre.'],
]

const deliverables = [
  ['Resumen ejecutivo', 'El estado de tu sitio en una página, escrito para quien decide el presupuesto.'],
  ['Diagnóstico técnico', 'Catorce comprobaciones con el hallazgo exacto y la acción recomendada para cada una.'],
  ['Visibilidad en IA', 'Si ChatGPT, Gemini y Perplexity pueden leerte y citarte como fuente en sus respuestas.'],
  ['Análisis de contenido', 'Volumen indexable, temáticas dominantes y si coinciden con lo que buscan tus clientes.'],
  ['Plan de acción priorizado', 'Qué arreglar primero para ganar más con menos trabajo, en tres niveles de prioridad.'],
  ['Hoja de ruta 30/60/90', 'Un plan realista de mejoras, ordenado por meses y estimado por esfuerzo.'],
]

const sample: [string, number][] = [
  ['SEO técnico', 70],
  ['Visibilidad en IA', 88],
  ['Contenido', 100],
]

export default function SeoAgentsPage() {
  return (
    <div className="nx-page">
      <section className="nx-section nx-split-hero nx-grey" data-theme="light">
        <div className="nx-wrap nx-split">
          <div>
            <Label>Diagnóstico automatizado</Label>
            <h1 className="nx-display">Descubre por qué Google y las IA no están recomendando tu sitio</h1>
            <p className="nx-lead">Analizamos tu web con más de 20 comprobaciones técnicas y te entregamos un informe con evidencia real: puntajes de SEO y GEO, hallazgos priorizados y una hoja de ruta a 30, 60 y 90 días.</p>
            <div className="nx-actions">
              <CheckoutDialog label="Analizar mi sitio" />
            </div>
            <ul className="nx-checks">
              {['Resultados en minutos', 'Datos medidos, no opiniones', 'Informe descargable en PDF'].map((item) => (
                <li key={item}>
                  <Check size={16} aria-hidden /> {item}
                </li>
              ))}
            </ul>
          </div>
          <aside className="nx-sample" aria-label="Informe de muestra">
            <p className="nx-label">Informe de muestra</p>
            <p className="nx-sample-score">
              82 <span>/ 100</span>
            </p>
            <p>
              <strong>Score SEO + GEO</strong>
              <br />
              14 comprobaciones · 3 críticas
            </p>
            {sample.map(([label, value]) => (
              <div key={label} className="nx-meter">
                <span>{label}</span>
                <span>{value}</span>
                <i style={{ width: `${value}%` }} />
              </div>
            ))}
            <ul>
              <li>
                <strong>Crítico:</strong> seis etiquetas H1 en la portada
              </li>
              <li>
                <strong>Alto:</strong> falta llms.txt para buscadores con IA
              </li>
              <li>
                <strong>Medio:</strong> 38 imágenes sin texto alternativo
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="nx-section" data-theme="light">
        <div className="nx-wrap nx-sticky-grid">
          <div className="nx-sticky">
            <h2 className="nx-h2">Cómo funciona</h2>
          </div>
          <StepLine items={steps.map(([title, text]) => ({ title, text }))} />
        </div>
      </section>

      <section className="nx-section nx-grey" data-theme="light">
        <div className="nx-wrap nx-sticky-grid">
          <div className="nx-sticky">
            <h2 className="nx-h2">Qué recibes</h2>
            <p className="nx-lead">Un informe de consultoría, no un checklist genérico.</p>
          </div>
          <NumberedList items={deliverables.map(([title, text]) => ({ title, text }))} />
        </div>
      </section>
    </div>
  )
}
