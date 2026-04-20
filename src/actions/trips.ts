'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { StageInput } from '@/types/trip'

export async function createTrip(title: string): Promise<string> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data, error } = await supabase
    .from('trips')
    .insert({ user_id: user.id, title, description: null, status: 'draft', is_public: false })
    .select('id')
    .single()

  if (error) throw error
  revalidatePath('/carnets')
  return data.id
}

export async function updateTrip(
  id: string,
  updates: { title?: string; description?: string; status?: 'draft' | 'active' | 'completed'; is_public?: boolean }
) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('trips').update(updates).eq('id', id)
  if (error) throw error
  revalidatePath('/carnets')
  revalidatePath(`/planifier/${id}`)
}

export async function deleteTrip(id: string) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('trips').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/carnets')
  redirect('/carnets')
}

export async function duplicateTrip(id: string): Promise<string> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data: trip } = await supabase.from('trips').select('*').eq('id', id).single()
  if (!trip) throw new Error('Voyage introuvable')

  const { data: newTrip, error } = await supabase
    .from('trips')
    .insert({
      user_id: user.id,
      title: `${trip.title} (copie)`,
      description: trip.description,
      status: 'draft' as const,
      is_public: false,
    })
    .select('id')
    .single()

  if (error || !newTrip) throw error ?? new Error('Duplication échouée')

  const { data: stages } = await supabase
    .from('stages')
    .select('*')
    .eq('trip_id', id)
    .order('order')

  if (stages?.length) {
    await supabase.from('stages').insert(
      stages.map(s => ({
        trip_id: newTrip.id,
        order: s.order,
        title: s.title,
        distance_km: s.distance_km,
        elevation_m: s.elevation_m,
        gpx_data: s.gpx_data,
      }))
    )
  }

  revalidatePath('/carnets')
  return newTrip.id
}

export async function saveStages(tripId: string, stages: StageInput[]) {
  const supabase = await createSupabaseServerClient()
  await supabase.from('stages').delete().eq('trip_id', tripId)

  if (!stages.length) return

  const { error } = await supabase.from('stages').insert(
    stages.map((s, i) => ({
      trip_id: tripId,
      order: i,
      title: s.title,
      distance_km: s.distance_km,
      elevation_m: s.elevation_m,
      gpx_data: s.gpx_data,
    }))
  )

  if (error) throw error
  revalidatePath(`/planifier/${tripId}`)
  revalidatePath(`/trip/${tripId}`)
}

export async function togglePublic(id: string, isPublic: boolean) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('trips').update({ is_public: isPublic }).eq('id', id)
  if (error) throw error
  revalidatePath('/carnets')
  revalidatePath(`/trip/${id}`)
}
