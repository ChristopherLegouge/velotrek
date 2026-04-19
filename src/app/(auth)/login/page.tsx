import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <>
      <h2 className="font-heading text-2xl font-bold text-ink mb-6">Bon retour 👋</h2>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-muted">
        Pas encore de compte ?{' '}
        <Link href="/register" className="text-blue font-medium hover:underline">
          Créer un compte
        </Link>
      </p>
    </>
  )
}
