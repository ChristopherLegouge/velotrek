'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface FormState  { name: string; email: string; password: string }
interface FormErrors { name?: string; email?: string; password?: string; general?: string }

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!form.name)               errors.name     = 'Prénom requis'
  if (!form.email)              errors.email    = 'Email requis'
  if (form.password.length < 8) errors.password = 'Mot de passe de 8 caractères minimum'
  return errors
}

export function RegisterForm() {
  const router = useRouter()
  const [form, setForm]       = useState<FormState>({ name: '', email: '', password: '' })
  const [errors, setErrors]   = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    const { error } = await createBrowserClient().auth.signUp({
      email:    form.email,
      password: form.password,
      options:  { data: { name: form.name } },
    })
    setLoading(false)

    if (error) { setErrors({ general: error.message }); return }
    router.push('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input label="Prénom" type="text" value={form.name} autoComplete="given-name"
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))} error={errors.name} />
      <Input label="Email" type="email" value={form.email} autoComplete="email"
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={errors.email} />
      <Input label="Mot de passe" type="password" value={form.password} autoComplete="new-password"
        onChange={e => setForm(f => ({ ...f, password: e.target.value }))} error={errors.password} />
      {errors.general && <p className="text-sm text-action">{errors.general}</p>}
      <Button type="submit" loading={loading} className="w-full">Créer mon compte</Button>
    </form>
  )
}
