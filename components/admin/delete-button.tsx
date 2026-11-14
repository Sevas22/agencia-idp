'use client'

import { Trash2 } from 'lucide-react'
import { deletePostAction } from '@/app/admin/actions'

/** Borra un artículo después de confirmarlo. */
export function DeleteButton({ id, title, withLabel }: { id: string; title: string; withLabel?: boolean }) {
  return (
    <form
      action={deletePostAction.bind(null, id)}
      onSubmit={(event) => {
        if (!window.confirm(`¿Eliminar «${title}»? No se puede deshacer.`)) event.preventDefault()
      }}
    >
      <button type="submit" className={withLabel ? 'adm-btn is-danger' : 'adm-icon-btn is-danger'} aria-label={`Eliminar ${title}`} title="Eliminar">
        <Trash2 size={18} aria-hidden />
        {withLabel && ' Eliminar'}
      </button>
    </form>
  )
}
