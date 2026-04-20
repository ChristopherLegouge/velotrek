import { createSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export default async function PublicTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const { data: trip } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .eq('is_public', true)
    .single()

  if (!trip) notFound()

  const { data: stages } = await supabase
    .from('stages')
    .select('*')
    .eq('trip_id', id)
    .order('order')

  const totalDistance  = (stages ?? []).reduce((s, st) => s + (st.distance_km ?? 0), 0)
  const totalElevation = (stages ?? []).reduce((s, st) => s + (st.elevation_m ?? 0), 0)

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-night py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-heading text-2xl font-bold text-white tracking-tight">
            Velo<span className="text-action">Trek</span>
          </Link>
          <Link href="/register">
            <Button size="sm">Créer mon compte</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-3xl font-bold text-ink">{trip.title}</h1>
            <Badge variant={trip.status === 'completed' ? 'success' : 'default'}>
              {trip.status === 'completed' ? 'Terminé' : 'En cours'}
            </Badge>
          </div>
          {trip.description && <p className="text-muted">{trip.description}</p>}
          <p className="text-sm text-muted">
            Partagé le {new Date(trip.created_at).toLocaleDateString('fr-FR')}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Distance', value: totalDistance > 0 ? `${totalDistance.toFixed(1)} km` : '—' },
            { label: 'Dénivelé', value: totalElevation > 0 ? `+${totalElevation} m` : '—' },
            { label: 'Étapes', value: String(stages?.length ?? 0) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="font-heading text-2xl font-bold text-ink">{value}</div>
              <div className="text-sm text-muted">{label}</div>
            </div>
          ))}
        </div>

        {stages && stages.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
            <h2 className="font-heading font-bold text-ink">Étapes</h2>
            <ol className="space-y-2">
              {stages.map((stage, i) => (
                <li key={stage.id} className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-blue text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-ink font-medium flex-1">{stage.title}</span>
                  {stage.distance_km && (
                    <span className="text-muted">{stage.distance_km.toFixed(1)} km</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="bg-night rounded-2xl p-8 text-center text-white">
          <p className="font-heading text-xl font-bold mb-2">Crée ton propre itinéraire</p>
          <p className="text-gray-300 mb-4 text-sm">Rejoins VeloTrek et planifie ta prochaine aventure à vélo.</p>
          <Link href="/register">
            <Button>Commencer gratuitement</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
