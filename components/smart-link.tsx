import Link from 'next/link'
import type { ComponentProps } from 'react'

type Props = Omit<ComponentProps<'a'>, 'href'> & { href: string }

/** Enlace interno con next/link; externo en pestaña nueva y sin referrer. */
export function SmartLink({ href, children, ...rest }: Props) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    )
  }
  if (/^(mailto:|tel:|#)/.test(href) || href.endsWith('.pdf')) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  )
}
