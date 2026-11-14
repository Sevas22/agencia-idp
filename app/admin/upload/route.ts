import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE, isValidSession } from '@/lib/admin-session'
import { saveMedia } from '@/lib/posts-repo'

const MAX_BYTES = 4 * 1024 * 1024

// Firma real de cada formato: no basta con la extensión ni con el tipo que declara el navegador.
const detect = (b: Uint8Array) => {
  const at = (i: number, ...v: number[]) => v.every((x, j) => b[i + j] === x)
  if (at(0, 0x89, 0x50, 0x4e, 0x47)) return 'image/png'
  if (at(0, 0xff, 0xd8, 0xff)) return 'image/jpeg'
  if (at(0, 0x47, 0x49, 0x46, 0x38)) return 'image/gif'
  if (at(0, 0x52, 0x49, 0x46, 0x46) && at(8, 0x57, 0x45, 0x42, 0x50)) return 'image/webp'
  if (at(4, 0x66, 0x74, 0x79, 0x70) && (at(8, 0x61, 0x76, 0x69, 0x66) || at(8, 0x61, 0x76, 0x69, 0x73))) return 'image/avif'
  return null
}

/** Sube una imagen desde el panel. Solo con sesión y desde el mismo sitio. */
export async function POST(request: NextRequest) {
  const session = (await cookies()).get(ADMIN_COOKIE)?.value
  if (!(await isValidSession(session))) return NextResponse.json({ error: 'Sesión vencida. Vuelve a ingresar.' }, { status: 401 })
  const origin = request.headers.get('origin')
  if (origin && new URL(origin).host !== request.headers.get('host')) return NextResponse.json({ error: 'Origen no permitido.' }, { status: 403 })

  const form = await request.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: 'No llegó ninguna imagen.' }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'La imagen pesa más de 4 MB. Comprímela antes de subirla.' }, { status: 413 })

  const bytes = new Uint8Array(await file.arrayBuffer())
  const mime = detect(bytes)
  if (!mime) return NextResponse.json({ error: 'Formato no admitido. Usa WebP, JPG, PNG, GIF o AVIF.' }, { status: 415 })

  const name = file.name.replace(/[^\w.-]+/g, '-').slice(0, 120) || 'imagen'
  const id = await saveMedia(name, mime, bytes)
  return NextResponse.json({ url: `/uploads/${id}/` })
}
