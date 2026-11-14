'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AlignCenter, AlignLeft, AlignRight, Bold, Code, Code2, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered, MessageSquareQuote, Quote, Redo2, Table, Undo2, Upload } from 'lucide-react'

type Props = { html: string; onChange: (html: string) => void; onUpload: (file: File) => Promise<string | null> }

/** Quita lo peligroso de lo que se pega desde otras páginas: scripts, eventos, estilos y enlaces javascript:. */
function cleanPasted(html: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.querySelectorAll('script, style, iframe, object, embed, link, meta, form, input, button, svg').forEach((el) => el.remove())
  doc.body.querySelectorAll('*').forEach((el) => {
    for (const attr of [...el.attributes]) {
      const name = attr.name.toLowerCase()
      const keep = ['href', 'src', 'alt', 'colspan', 'rowspan'].includes(name)
      if (!keep || /^\s*javascript:/i.test(attr.value)) el.removeAttribute(attr.name)
    }
  })
  doc.body.querySelectorAll('span, font').forEach((el) => el.replaceWith(...el.childNodes))
  return doc.body.innerHTML
}

const blocks = { answer: '<p class="answer"><strong>Escribe aquí la respuesta directa en una o dos frases.</strong></p><p></p>', table: '<table><thead><tr><th>Opción</th><th>Ventaja</th><th>Costo</th></tr></thead><tbody><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table><p></p>' }

export function RichEditor({ html, onChange, onUpload }: Props) {
  const box = useRef<HTMLDivElement>(null)
  const file = useRef<HTMLInputElement>(null)
  const last = useRef('')
  const [source, setSource] = useState(false)
  const [active, setActive] = useState<Record<string, boolean>>({})
  const [uploading, setUploading] = useState(false)

  // Solo se reescribe el contenido cuando el cambio viene de fuera (otra vista, un «Fix»), para no mover el cursor.
  useEffect(() => {
    if (source || !box.current || box.current.innerHTML === html) return
    box.current.innerHTML = html
    last.current = html
  }, [html, source])

  const emit = useCallback(() => {
    if (!box.current) return
    last.current = box.current.innerHTML
    onChange(last.current)
  }, [onChange])

  useEffect(() => {
    const update = () => {
      if (!box.current?.contains(document.getSelection()?.anchorNode ?? null)) return
      const block = String(document.queryCommandValue('formatBlock')).toLowerCase()
      setActive({ bold: document.queryCommandState('bold'), italic: document.queryCommandState('italic'), h2: block === 'h2', h3: block === 'h3', ul: document.queryCommandState('insertUnorderedList'), ol: document.queryCommandState('insertOrderedList'), quote: block === 'blockquote', pre: block === 'pre' })
    }
    document.addEventListener('selectionchange', update)
    return () => document.removeEventListener('selectionchange', update)
  }, [])

  const run = (command: string, value?: string) => {
    box.current?.focus()
    document.execCommand(command, false, value)
    emit()
  }
  const toggleBlock = (tag: string, on: boolean) => run('formatBlock', on ? 'p' : tag)

  const addLink = () => {
    const url = window.prompt('Dirección del enlace (empieza con / para páginas del sitio o con https://)')
    if (!url) return
    if (!/^(https?:\/\/|\/|mailto:|#)/i.test(url.trim())) return window.alert('El enlace debe empezar con /, https:// o mailto:')
    run('createLink', url.trim())
  }

  const insertImage = (src: string) => {
    const alt = window.prompt('Texto alternativo de la imagen (describe qué muestra e incluye la keyword si aplica)') ?? ''
    const safeAlt = alt.replace(/[<>"]/g, '')
    run('insertHTML', `<img src="${src}" alt="${safeAlt}" loading="lazy" />`)
  }

  const imageByUrl = () => {
    const url = window.prompt('Ruta o URL de la imagen (/media/... o https://...)')
    if (!url) return
    if (!/^(https:\/\/|\/)/i.test(url.trim())) return window.alert('La imagen debe ser una ruta del sitio o una URL https://')
    insertImage(url.trim())
  }

  const upload = async (picked: File | undefined) => {
    if (!picked) return
    setUploading(true)
    const url = await onUpload(picked)
    setUploading(false)
    if (url) insertImage(url)
  }

  const Btn = ({ on, title, onClick, children }: { on?: boolean; title: string; onClick: () => void; children: React.ReactNode }) => (
    <button type="button" className={on ? 'is-on' : undefined} title={title} aria-label={title} aria-pressed={on} onMouseDown={(e) => e.preventDefault()} onClick={onClick} disabled={source}>
      {children}
    </button>
  )

  return (
    <div className="adm-rich">
      <div className="adm-rich-bar" role="toolbar" aria-label="Formato del contenido">
        <Btn title="Negrita" on={active.bold} onClick={() => run('bold')}>
          <Bold size={17} />
        </Btn>
        <Btn title="Cursiva" on={active.italic} onClick={() => run('italic')}>
          <Italic size={17} />
        </Btn>
        <Btn title="Subtítulo H2" on={active.h2} onClick={() => toggleBlock('h2', active.h2)}>
          <Heading2 size={17} />
        </Btn>
        <Btn title="Subtítulo H3" on={active.h3} onClick={() => toggleBlock('h3', active.h3)}>
          <Heading3 size={17} />
        </Btn>
        <Btn title="Lista" on={active.ul} onClick={() => run('insertUnorderedList')}>
          <List size={17} />
        </Btn>
        <Btn title="Lista numerada" on={active.ol} onClick={() => run('insertOrderedList')}>
          <ListOrdered size={17} />
        </Btn>
        <Btn title="Cita" on={active.quote} onClick={() => toggleBlock('blockquote', active.quote)}>
          <Quote size={17} />
        </Btn>
        <Btn title="Código" on={active.pre} onClick={() => toggleBlock('pre', active.pre)}>
          <Code size={17} />
        </Btn>
        <Btn title="Enlace" onClick={addLink}>
          <Link2 size={17} />
        </Btn>
        <span className="adm-rich-sep" />
        <Btn title="Alinear a la izquierda" onClick={() => run('justifyLeft')}>
          <AlignLeft size={17} />
        </Btn>
        <Btn title="Centrar" onClick={() => run('justifyCenter')}>
          <AlignCenter size={17} />
        </Btn>
        <Btn title="Alinear a la derecha" onClick={() => run('justifyRight')}>
          <AlignRight size={17} />
        </Btn>
        <span className="adm-rich-sep" />
        <Btn title={uploading ? 'Subiendo imagen…' : 'Subir imagen'} onClick={() => file.current?.click()}>
          <Upload size={17} />
        </Btn>
        <Btn title="Imagen por URL" onClick={imageByUrl}>
          <ImagePlus size={17} />
        </Btn>
        <Btn title="Tabla comparativa" onClick={() => run('insertHTML', blocks.table)}>
          <Table size={17} />
        </Btn>
        <Btn title="Respuesta directa (GEO)" onClick={() => run('insertHTML', blocks.answer)}>
          <MessageSquareQuote size={17} />
        </Btn>
        <span className="adm-rich-grow" />
        <Btn title="Deshacer" onClick={() => run('undo')}>
          <Undo2 size={17} />
        </Btn>
        <Btn title="Rehacer" onClick={() => run('redo')}>
          <Redo2 size={17} />
        </Btn>
        <button type="button" className={`adm-rich-mode ${source ? 'is-on' : ''}`} onClick={() => setSource(!source)} aria-pressed={source} title="Ver y editar el HTML">
          <Code2 size={16} aria-hidden /> HTML
        </button>
      </div>
      <input ref={file} type="file" accept="image/webp,image/jpeg,image/png,image/gif,image/avif" hidden onChange={(e) => { upload(e.target.files?.[0]); e.target.value = '' }} />
      {source ? (
        <textarea className="adm-rich-source" value={html} onChange={(e) => onChange(e.target.value)} spellCheck={false} aria-label="Contenido en HTML" />
      ) : (
        <div
          ref={box}
          id="adm-content-editor"
          className="adm-rich-area nx-prose is-flush"
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Contenido del artículo"
          onInput={emit}
          onBlur={emit}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData('text/html')
            if (!pasted) return
            e.preventDefault()
            document.execCommand('insertHTML', false, cleanPasted(pasted))
            emit()
          }}
        />
      )}
    </div>
  )
}
