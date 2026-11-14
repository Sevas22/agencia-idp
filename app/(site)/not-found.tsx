import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="nx-toolpage" data-theme="light">
      <div className="nx-wrap nx-center">
        <h1 className="nx-h2">Esta página no existe</h1>
        <p className="nx-lead">Puede que la dirección haya cambiado. Vuelve al inicio o revisa nuestro blog.</p>
        <div className="nx-actions is-center">
          <Link className="nx-btn" href="/">
            Ir al inicio
          </Link>
          <Link className="nx-btn nx-btn-line" href="/blog/">
            Ver el blog
          </Link>
        </div>
      </div>
    </section>
  )
}
