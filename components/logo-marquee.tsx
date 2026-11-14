import type { Img } from '@/lib/content'

// Logos con fondo propio (cuadro o círculo): no se pueden volver silueta blanca sin perder el texto.
const boxed = new Set(['Grupo Éxito', 'Cliente de Agencia IDP', 'The Leads Guy', 'Intuix', 'ISA Intercolombia', 'Hospital Sagrado Corazón de Jesús'])

/** Fila de logos que se desplaza sola y se detiene al pasar el mouse. La segunda copia es solo visual. */
export function LogoMarquee({ logos, className }: { logos: Img[]; className?: string }) {
  return (
    <div className={`nx-marquee ${className ?? ''}`}>
      <ul className="nx-marquee-track" aria-label="Clientes que confían en nosotros">
        {[...logos, ...logos].map((logo, i) => (
          <li key={`${logo.src}-${i}`} aria-hidden={i >= logos.length || undefined} className={boxed.has(logo.alt ?? '') ? 'is-boxed' : undefined}>
            <img src={logo.src} alt={i >= logos.length ? '' : (logo.alt ?? '')} width={logo.width} height={logo.height} loading="lazy" />
          </li>
        ))}
      </ul>
    </div>
  )
}
