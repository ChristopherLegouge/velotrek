import { RegisterForm } from '@/components/auth/RegisterForm'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <>
      <h2 className="font-heading text-2xl font-bold text-ink mb-2">Commence l'aventure 🚴</h2>
      <p className="text-muted text-sm mb-6">3 champs et c'est parti</p>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-muted">
        Déjà un compte ?{' '}
        <Link href="/login" className="text-blue font-medium hover:underline">
          Se connecter
        </Link>
      </p>
    </>
  )
}
