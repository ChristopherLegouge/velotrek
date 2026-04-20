import { createSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { TripEditor } from '@/components/trip/TripEditor'

export default async function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const { data: trip } = await supabase.from('trips').select('id, title').eq('id', id).single()
  if (!trip) notFound()

  return <TripEditor tripId={trip.id} initialTitle={trip.title} />
}
