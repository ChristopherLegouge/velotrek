'use client'

import { useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useTrip } from '@/lib/hooks/useTrip'
import { TripMapClient } from '@/components/map/TripMapClient'
import { WaypointList } from '@/components/trip/WaypointList'
import { TripStats } from '@/components/trip/TripStats'
import { GpxControls } from '@/components/trip/GpxControls'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createTrip, saveStages, updateTrip } from '@/actions/trips'
import type { StageInput } from '@/types/trip'

interface TripEditorProps {
  tripId?: string
  initialTitle?: string
}

export function TripEditor({ tripId, initialTitle }: TripEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { state, dispatch, totalDistance, totalElevation, totalDuration, addWaypoint } = useTrip({
    tripId: tripId ?? null,
    title: initialTitle ?? 'Mon nouveau voyage',
  })

  const handleMapClick = useCallback(
    (coordinates: [number, number]) => { addWaypoint(coordinates) },
    [addWaypoint],
  )

  async function handleGpxImport(coordinates: [number, number][]) {
    dispatch({ type: 'LOAD_WAYPOINTS', waypoints: [], segments: [] })
    for (const coords of coordinates) {
      await addWaypoint(coords)
    }
  }

  async function handleSave() {
    startTransition(async () => {
      dispatch({ type: 'SET_SAVING', value: true })
      try {
        let id = state.tripId
        if (!id) {
          id = await createTrip(state.title)
          dispatch({ type: 'SET_TRIP_ID', id })
        } else {
          await updateTrip(id, { title: state.title })
        }

        const stages: StageInput[] = state.segments.map((seg, i) => ({
          title: `${state.waypoints[i].name} → ${state.waypoints[i + 1].name}`,
          distance_km: seg.distance_km,
          elevation_m: seg.elevation_gain_m,
          gpx_data: JSON.stringify(seg.geometry),
        }))

        await saveStages(id, stages)
        router.push('/carnets')
      } finally {
        dispatch({ type: 'SET_SAVING', value: false })
      }
    })
  }

  return (
    <div className="-mx-4 -mt-8 h-[calc(100vh-64px)] flex">
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-100">
          <Input
            label="Nom du voyage"
            value={state.title}
            onChange={e => dispatch({ type: 'SET_TITLE', title: e.target.value })}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <h2 className="font-heading font-bold text-sm text-ink mb-3 uppercase tracking-wide">
              Étapes ({state.waypoints.length})
            </h2>
            <WaypointList
              waypoints={state.waypoints}
              segments={state.segments}
              onRename={(id, name) => dispatch({ type: 'UPDATE_WAYPOINT', id, name })}
              onRemove={id => dispatch({ type: 'REMOVE_WAYPOINT', id })}
            />
          </div>

          {state.waypoints.length >= 2 && (
            <TripStats
              distanceKm={totalDistance}
              elevationM={totalElevation}
              durationMin={totalDuration}
            />
          )}
        </div>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <GpxControls
            tripTitle={state.title}
            waypoints={state.waypoints}
            segments={state.segments}
            onImport={handleGpxImport}
          />
          <Button
            className="w-full"
            onClick={handleSave}
            loading={state.isSaving || isPending}
            disabled={state.waypoints.length < 2}
          >
            Sauvegarder le voyage
          </Button>
        </div>
      </aside>

      <div className="flex-1 relative">
        <TripMapClient
          waypoints={state.waypoints}
          segments={state.segments}
          onMapClick={handleMapClick}
          isRouting={state.isRouting}
          className="h-full w-full"
        />
      </div>
    </div>
  )
}
