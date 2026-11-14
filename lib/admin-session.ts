/**
 * Sesión del panel: una cookie con fecha de vencimiento firmada con HMAC-SHA256.
 * Usa Web Crypto para funcionar igual en proxy.ts y en el servidor.
 */
export const ADMIN_COOKIE = 'idp_admin'
export const SESSION_HOURS = 8

const encoder = new TextEncoder()
const toHex = (buffer: ArrayBuffer) => [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('')

async function hmac(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.length < 32) throw new Error('ADMIN_SESSION_SECRET falta o es demasiado corto')
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return toHex(await crypto.subtle.sign('HMAC', key, encoder.encode(value)))
}

/** Comparación en tiempo constante de dos cadenas hexadecimales. */
function sameHex(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function createSessionToken() {
  const expires = Date.now() + SESSION_HOURS * 3600 * 1000
  return `${expires}.${await hmac(`admin:${expires}`)}`
}

export async function isValidSession(token: string | undefined) {
  if (!token) return false
  const [expires, signature] = token.split('.')
  if (!expires || !signature || !/^\d+$/.test(expires) || Number(expires) < Date.now()) return false
  try {
    return sameHex(signature, await hmac(`admin:${expires}`))
  } catch {
    return false
  }
}
