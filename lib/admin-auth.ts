import 'server-only'
import { timingSafeEqual, createHash } from 'node:crypto'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE, SESSION_HOURS, createSessionToken, isValidSession } from './admin-session'

/** Corta cualquier acción del panel si no hay sesión válida (el proxy no basta para server actions). */
export async function requireAdmin() {
  const store = await cookies()
  if (!(await isValidSession(store.get(ADMIN_COOKIE)?.value))) redirect('/admin/login/')
}

const digest = (value: string) => createHash('sha256').update(value).digest()
const same = (a: string, b: string) => timingSafeEqual(digest(a), digest(b))

// Freno simple contra intentos repetidos: 5 fallos por IP en 15 minutos bloquean el ingreso.
const failures = new Map<string, { count: number; until: number }>()
const WINDOW = 15 * 60 * 1000

export async function checkCredentials(email: string, password: string) {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  const entry = failures.get(ip)
  if (entry && entry.count >= 5 && entry.until > Date.now()) return { ok: false as const, error: 'Demasiados intentos. Espera 15 minutos.' }

  const expectedEmail = process.env.ADMIN_EMAIL ?? ''
  const expectedPassword = process.env.ADMIN_PASSWORD ?? ''
  if (!expectedEmail || expectedPassword.length < 12) return { ok: false as const, error: 'El panel no está configurado: revisa ADMIN_EMAIL y ADMIN_PASSWORD.' }

  const valid = same(email.trim().toLowerCase(), expectedEmail.toLowerCase()) && same(password, expectedPassword)
  if (!valid) {
    const fresh = !entry || entry.until < Date.now()
    failures.set(ip, { count: fresh ? 1 : entry.count + 1, until: Date.now() + WINDOW })
    return { ok: false as const, error: 'Correo o contraseña incorrectos.' }
  }
  failures.delete(ip)
  return { ok: true as const }
}

export async function startSession() {
  const store = await cookies()
  store.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_HOURS * 3600,
  })
}

export async function endSession() {
  const store = await cookies()
  store.delete(ADMIN_COOKIE)
}
