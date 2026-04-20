import { createSupabaseServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { TripCard } from '@/components/trip/TripCard'

export default async function CarnetsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: trips } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const tripIds = trips?.map(t => t.id) ?? []
  const { data: stages } = tripIds.length
    ? await supabase.from('stages').select('trip_id, distance_km').in('trip_id', tripIds)
    : { data: [] }

  const statsByTrip = (stages ?? []).reduce<Record<string, { count: number; dist: number }>>(
    (acc, s) => {
      if (!acc[s.trip_id]) acc[s.trip_id] = { count: 0, dist: 0 }
      acc[s.trip_id].count++
      acc[s.trip_id].dist += s.distance_km ?? 0
      return acc
    },
    {}
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-ink">Mes voyages</h1>
          <p className="text-muted mt-1">{trips?.length ?? 0} voyage{(trips?.length ?? 0) !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/planifier"><Button>+ Nouveau voyage</Button></Link>
      </div>

      {!trips?.length ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <p className="text-4xl mb-4">🚴</p>
          <p className="font-heading text-xl font-bold text-ink mb-2">Aucun voyage pour l&apos;instant</p>
          <p className="text-muted mb-6">Trace ta première route et pars à l&apos;aventure.</p>
          <Link href="/planifier"><Button>Créer mon premier itinéraire</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map(trip => (
            <TripCard
              key={trip.id}
              id={trip.id}
              title={trip.title}
              status={trip.status}
              stageCount={statsByTrip[trip.id]?.count ?? 0}
              totalDistanceKm={statsByTrip[trip.id]?.dist ?? 0}
              createdAt={trip.created_at}
              isPublic={trip.is_public}
            />
          ))}
        </div>
      )}
    </div>
  )
}
