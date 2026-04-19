import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-night border-b border-marine/30 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <Logo className="text-white" />
          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: '/explorer',    label: 'Explorer' },
              { href: '/planifier',   label: 'Planifier' },
              { href: '/carnets',     label: 'Carnets' },
              { href: '/partenaires', label: 'Partenaires' },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                className="text-sm text-gray-300 hover:text-white transition-colors font-body">
                {label}
              </Link>
            ))}
          </nav>
          <Link href="/profil" className="text-sm text-gray-300 hover:text-white font-body">
            Mon profil
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  )
}
