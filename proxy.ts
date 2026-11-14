import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE, isValidSession } from '@/lib/admin-session'

/** Todo /admin exige sesión, salvo la página de ingreso. El panel nunca se indexa. */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLogin = pathname === '/admin/login' || pathname === '/admin/login/'
  const valid = await isValidSession(request.cookies.get(ADMIN_COOKIE)?.value)

  let response: NextResponse
  if (!isLogin && !valid) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login/'
    url.search = ''
    response = NextResponse.redirect(url)
  } else if (isLogin && valid) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/'
    url.search = ''
    response = NextResponse.redirect(url)
  } else {
    response = NextResponse.next()
  }
  response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  response.headers.set('Cache-Control', 'no-store')
  return response
}

export const config = { matcher: ['/admin', '/admin/:path*'] }
