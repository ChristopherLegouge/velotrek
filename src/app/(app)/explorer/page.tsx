import { createSupabaseServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'

export default async function ExplorerPage() {
  const supabase = await createSupabaseServerClient()

  const { data: trips } = await supabase
    .from('trips')
    .select('id, title, description, user_id, created_at, status')
    .eq('is_public', true)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(24)

  const tripIds = trips?.map(t => t.id) ?? []
  const { data: stages } = tripIds.length
    ? await supabase.from('stages').select('trip_id, distance_km').in('trip_id', tripIds)
    : { data: [] }

  const distByTrip = (stages ?? []).reduce<Record<string, number>>((acc, s) => {
    acc[s.trip_id] = (acc[s.trip_id] ?? 0) + (s.distance_km ?? 0)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-ink">Explorer les itinéraires</h1>
        <p className="text-muted mt-1">Découvre les voyages partagés par la communauté</p>
      </div>

      {!trips?.length ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <p className="text-4xl mb-4">🗺️</p>
          <p className="font-heading text-xl font-bold text-ink mb-2">Aucun itinéraire public pour l&apos;instant</p>
          <p className="text-muted">Sois le premier à partager ton voyage !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map(trip => (
            <Link
              key={trip.id}
              href={`/trip/${trip.id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-3 hover:shadow-md transition-shadow block"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-heading font-bold text-ink">{trip.title}</h2>
                <Badge variant="success">Terminé</Badge>
              </div>
              {trip.description && (
                <p className="text-sm text-muted line-clamp-2">{trip.description}</p>
              )}
              <div className="flex items-center gap-3 text-sm text-muted">
                {distByTrip[trip.id] > 0 && <span>{distByTrip[trip.id].toFixed(0)} km</span>}
                <span>{new Date(trip.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
