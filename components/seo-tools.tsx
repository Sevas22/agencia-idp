'use client'

import { type FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowRight, Download, X } from 'lucide-react'
import { SEO_API, site } from '@/lib/site'

type Scores = { promedio_general: number; seo_tecnico: number; geo: number; contenido: number }
type Report = { dominio: string; pdf_url: string; scores?: Scores }

const scoreColor = (n: number) => (n >= 80 ? '#1e8e4e' : n >= 50 ? '#c25a00' : '#c62828')

async function post(endpoint: string, body: unknown) {
  const response = await fetch(`${SEO_API}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  return { ok: response.ok, status: response.status, data }
}

function readLead(form: HTMLFormElement) {
  const fields = new FormData(form)
  const value = (name: string) => String(fields.get(name) ?? '').trim()
  return { nombre: value('nombre'), email: value('email'), dominio: value('dominio'), empresa: value('empresa'), telefono: value('telefono') }
}

function LeadFields() {
  return (
    <>
      <label>
        Nombre *
        <input name="nombre" required autoComplete="name" placeholder="Tu nombre" />
      </label>
      <label>
        Email *
        <input name="email" type="email" required autoComplete="email" placeholder="tu@correo.com" />
      </label>
      <label>
        Dominio de tu sitio *
        <input name="dominio" required placeholder="ejemplo.com" />
      </label>
      <label>
        Empresa
        <input name="empresa" placeholder="(opcional)" />
      </label>
      <label>
        Teléfono
        <input name="telefono" type="tel" placeholder="(opcional)" />
      </label>
    </>
  )
}

/** Envía los datos al backend y redirige al checkout de Stripe que este devuelve. */
export function CheckoutForm({ submitLabel }: { submitLabel: string }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const { ok, data } = await post('/api/crear-sesion-pago', readLead(event.currentTarget))
      if (!ok) throw new Error(data.detail || 'No pudimos conectar con el servidor.')
      const target = new URL(data.checkout_url)
      if (target.protocol !== 'https:') throw new Error('La dirección de pago no es válida.')
      window.location.assign(target.href)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error. Vuelve a intentarlo.')
      setBusy(false)
    }
  }

  return (
    <form className="tool-form" onSubmit={onSubmit}>
      <LeadFields />
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="btn" type="submit" disabled={busy}>
        {busy ? 'Preparando tu pago seguro…' : submitLabel}
      </button>
      <p className="form-note">Pago seguro con Stripe · Si tienes un código de descuento, podrás aplicarlo en la pantalla de pago.</p>
    </form>
  )
}

export function CheckoutDialog({ label }: { label: string }) {
  const dialog = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button type="button" className="btn" onClick={() => dialog.current?.showModal()}>
        {label} <ArrowRight size={16} aria-hidden />
      </button>
      <dialog
        ref={dialog}
        className="tool-dialog"
        aria-labelledby="dialog-title"
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current?.close()
        }}
      >
        <button type="button" className="dialog-close" aria-label="Cerrar" onClick={() => dialog.current?.close()}>
          <X size={20} />
        </button>
        <h2 id="dialog-title">Pide tu diagnóstico</h2>
        <p>Completa los datos y recibirás tu informe apenas termine el análisis.</p>
        <p className="plan-price">
          $9.99 <span>USD</span>
        </p>
        <p className="form-note">Pago único · Informe completo · Sin suscripciones</p>
        <CheckoutForm submitLabel="Analizar mi sitio" />
      </dialog>
    </>
  )
}

function ReportCard({ report }: { report: Report }) {
  const scores = report.scores
  const rows: [string, number | undefined][] = [
    ['SEO técnico', scores?.seo_tecnico],
    ['GEO (IA)', scores?.geo],
    ['Contenido', scores?.contenido],
  ]
  return (
    <div className="tool-card center">
      <h1>¡Tu diagnóstico está listo! ✅</h1>
      <p>Dominio analizado: {report.dominio}</p>
      <p className="score-global" style={{ color: scoreColor(scores?.promedio_general ?? 0) }}>
        {scores?.promedio_general ?? '—'}
      </p>
      <p className="form-note">Puntaje global / 100</p>
      <dl className="stats">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dd style={{ color: scoreColor(value ?? 0) }}>{value ?? '—'}</dd>
            <dt>{label}</dt>
          </div>
        ))}
      </dl>
      <a className="btn" href={`${SEO_API}${report.pdf_url}`}>
        <Download size={16} aria-hidden /> Descargar informe PDF completo
      </a>
      <p className="form-note">También te enviamos una copia a tu correo.</p>
    </div>
  )
}

/** Página de retorno de Stripe: verifica el pago y reintenta mientras llega la confirmación. */
export function PaidReport() {
  const [report, setReport] = useState<Report | null>(null)
  const [message, setMessage] = useState('Confirmando tu pago y analizando tu sitio. Esto toma unos segundos.')
  const [failure, setFailure] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('ref') || params.get('session_id')
    if (!sessionId) {
      setFailure('No encontramos la referencia del pago en la URL.')
      return
    }
    let attempts = 0
    let timer: ReturnType<typeof setTimeout>
    let cancelled = false
    const MAX = 6

    async function verify() {
      attempts += 1
      try {
        const { ok, status, data } = await post('/api/verificar-pago', { session_id: sessionId })
        if (cancelled) return
        if (ok) setReport(data)
        else if (status === 402 && attempts < MAX) {
          setMessage('Confirmando tu pago…')
          timer = setTimeout(verify, 2500)
        } else setFailure(data.detail || 'No pudimos generar el informe. Intenta recargar la página.')
      } catch {
        if (cancelled) return
        if (attempts < MAX) timer = setTimeout(verify, 2500)
        else setFailure('Error de conexión. Recarga la página o contáctanos.')
      }
    }
    verify()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  if (report) return <ReportCard report={report} />
  if (failure) {
    return (
      <div className="tool-card center">
        <h1>Hubo un problema</h1>
        <p>{failure}</p>
        <p>
          Si ya pagaste, <a href={`mailto:${site.email}`}>escríbenos</a> y te enviamos tu informe.
        </p>
      </div>
    )
  }
  return (
    <div className="tool-card center" aria-live="polite">
      <h1>Generando tu informe…</h1>
      <p>{message}</p>
    </div>
  )
}

export function FreeDiagnostic() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [report, setReport] = useState<Report | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const { ok, data } = await post('/api/diagnostico', readLead(event.currentTarget))
      if (!ok) throw new Error(data.detail || 'No se pudo generar el diagnóstico.')
      setReport(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error. Inténtalo de nuevo.')
    } finally {
      setBusy(false)
    }
  }

  if (report) return <ReportCard report={report} />
  return (
    <div className="tool-card">
      <h1>Diagnóstico SEO + GEO gratis</h1>
      <p>Descubre cómo te ven Google y las IAs (ChatGPT, Gemini, Perplexity). Recibe tu informe en segundos.</p>
      <form className="tool-form" onSubmit={onSubmit}>
        <LeadFields />
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="btn" type="submit" disabled={busy}>
          {busy ? 'Analizando tu sitio…' : 'Generar mi diagnóstico'}
        </button>
        <p className="form-note">Gratis · sin tarjeta · tu informe llega también a tu correo.</p>
      </form>
    </div>
  )
}
