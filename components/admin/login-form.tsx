'use client'

import { useActionState } from 'react'
import { loginAction, type LoginState } from '@/app/admin/actions'

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {})
  return (
    <form action={action} className="adm-form">
      <label>
        Correo
        <input key={state.email ?? ''} name="email" type="email" autoComplete="username" defaultValue={state.email} required />
      </label>
      <label>
        Contraseña
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {state.error && (
        <p className="adm-error" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className="adm-btn is-primary" disabled={pending}>
        {pending ? 'Ingresando…' : 'Ingresar'}
      </button>
    </form>
  )
}
