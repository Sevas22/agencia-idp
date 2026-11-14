import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="nx-toolpage" data-theme="light">
      <div className="nx-wrap nx-center">
        <h1 className="nx-h2">This page doesn&apos;t exist</h1>
        <p className="nx-lead">The address may have changed. Go back to the home page or see our case studies.</p>
        <div className="nx-actions is-center">
          <Link className="nx-btn" href="/en/">
            Go to home
          </Link>
          <Link className="nx-btn nx-btn-line" href="/en/case-studies/">
            See case studies
          </Link>
        </div>
      </div>
    </section>
  )
}
