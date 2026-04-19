'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface FormState  { email: string; password: string }
interface FormErrors { email?: string; password?: string; general?: string }

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!form.email)    errors.email    = 'Email requis'
  if (!form.password) errors.password = 'Mot de passe requis'
  return errors
}

export function LoginForm() {
  const router = useRouter()
  const [form, setForm]       = useState<FormState>({ email: '', password: '' })
  const [errors, setErrors]   = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    const { error } = await createBrowserClient().auth.signInWithPassword({
      email: form.email, password: form.password,
    })
    setLoading(false)

    if (error) { setErrors({ general: 'Email ou mot de passe incorrect' }); return }
    router.push('/dashboard')
  }

  async function handleGoogleLogin() {
    await createBrowserClient().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input label="Email" type="email" value={form.email} autoComplete="email"
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={errors.email} />
      <Input label="Mot de passe" type="password" value={form.password} autoComplete="current-password"
        onChange={e => setForm(f => ({ ...f, password: e.target.value }))} error={errors.password} />
      {errors.general && <p className="text-sm text-action">{errors.general}</p>}
      <Button type="submit" loading={loading} className="w-full">Se connecter</Button>
      <div className="flex items-center gap-3">
        <hr className="flex-1 border-gray-200" />
        <span className="text-sm text-muted">ou</span>
        <hr className="flex-1 border-gray-200" />
      </div>
      <Button type="button" variant="ghost" className="w-full" onClick={handleGoogleLogin}>
        Continuer avec Google
      </Button>
    </form>
  )
}
