import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import { CheckoutForm } from '@/components/seo-tools'
import { buildMetadata, getSeo } from '@/lib/content'

export const metadata: Metadata = buildMetadata(getSeo('pagina-posicionamiento-seo'), '/pagina-posicionamiento-seo/')

const includes = [
  'Análisis técnico SEO + GEO con puntajes',
  'Problemas críticos, quick wins y plan de acción',
  'Keywords, competencia y roadmap 30/60/90 días',
  'Informe PDF profesional descargable',
]

export default function SeoCheckoutPage() {
  return (
    <section className="nx-toolpage" data-theme="light">
      <div className="wrap-tool tool-card">
        <h1>Diagnóstico SEO + GEO profesional</h1>
        <p>Informe completo de tu visibilidad en Google y en las IAs (ChatGPT, Gemini, Perplexity).</p>
        <p className="plan-price">
          $9.99 <span>USD</span>
        </p>
        <p className="form-note">Pago único · informe completo</p>
        <ul className="check-list">
          {includes.map((item) => (
            <li key={item}>
              <Check size={18} aria-hidden /> {item}
            </li>
          ))}
        </ul>
        <CheckoutForm submitLabel="Pagar $9.99 y generar mi informe" />
      </div>
    </section>
  )
}
