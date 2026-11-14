import type { Metadata } from 'next'
import { LoginForm } from '@/components/admin/login-form'

export const metadata: Metadata = { title: 'Ingresar' }

export default function LoginPage() {
  return (
    <main className="adm-login">
      <div className="adm-login-card">
        <img src="/brand/logo-agencia-idp.webp" alt="Agencia IDP" width={120} height={75} />
        <h1>Panel de contenidos</h1>
        <p>Ingresa para revisar y publicar los artículos del blog.</p>
        <LoginForm />
      </div>
    </main>
  )
}
