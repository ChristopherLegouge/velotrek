import { createSupabaseServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: trips } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(6)

  const name = user?.user_metadata?.name ?? 'Cycliste'

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-ink">Bonjour, {name} 👋</h1>
          <p className="text-muted mt-1">Où vas-tu cette fois ?</p>
        </div>
        <Link href="/planifier"><Button>Nouveau voyage →</Button></Link>
      </div>

      {trips && trips.length > 0 ? (
        <section>
          <h2 className="font-heading text-xl font-bold text-ink mb-4">Mes voyages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map(trip => (
              <Card key={trip.id}>
                <p className="font-heading font-bold text-ink">{trip.title}</p>
                <p className="text-sm text-muted mt-1">
                  {new Date(trip.created_at).toLocaleDateString('fr-FR')}
                </p>
              </Card>
            ))}
          </div>
        </section>
      ) : (
        <Card className="text-center py-16">
          <p className="text-4xl mb-4">🚴</p>
          <p className="font-heading text-xl font-bold text-ink mb-2">
            Tu n'as pas encore de voyage
          </p>
          <p className="text-muted mb-6">Où veux-tu aller ?</p>
          <Link href="/planifier"><Button>Créer mon premier itinéraire</Button></Link>
        </Card>
      )}
    </div>
  )
}
