'use client'

import { useReducer, useCallback, useRef } from 'react'
import type { Waypoint, RouteSegment, TripEditorState } from '@/types/trip'
import { getCyclingRoute } from '@/lib/mapbox/directions'

type Action =
  | { type: 'ADD_WAYPOINT'; waypoint: Waypoint }
  | { type: 'REMOVE_WAYPOINT'; id: string }
  | { type: 'UPDATE_WAYPOINT'; id: string; name: string }
  | { type: 'SET_SEGMENT'; index: number; segment: RouteSegment }
  | { type: 'SET_ROUTING'; value: boolean }
  | { type: 'SET_SAVING'; value: boolean }
  | { type: 'SET_TITLE'; title: string }
  | { type: 'SET_TRIP_ID'; id: string }
  | { type: 'LOAD_WAYPOINTS'; waypoints: Waypoint[]; segments: RouteSegment[] }

function reducer(state: TripEditorState, action: Action): TripEditorState {
  switch (action.type) {
    case 'ADD_WAYPOINT':
      return { ...state, waypoints: [...state.waypoints, action.waypoint] }
    case 'REMOVE_WAYPOINT': {
      const idx = state.waypoints.findIndex(w => w.id === action.id)
      const waypoints = state.waypoints.filter(w => w.id !== action.id)
      const segments = state.segments.filter((_, i) => i !== idx && i !== idx - 1)
      return { ...state, waypoints, segments }
    }
    case 'UPDATE_WAYPOINT':
      return {
        ...state,
        waypoints: state.waypoints.map(w =>
          w.id === action.id ? { ...w, name: action.name } : w
        ),
      }
    case 'SET_SEGMENT': {
      const segments = [...state.segments]
      segments[action.index] = action.segment
      return { ...state, segments }
    }
    case 'SET_ROUTING':   return { ...state, isRouting: action.value }
    case 'SET_SAVING':    return { ...state, isSaving: action.value }
    case 'SET_TITLE':     return { ...state, title: action.title }
    case 'SET_TRIP_ID':   return { ...state, tripId: action.id }
    case 'LOAD_WAYPOINTS':
      return { ...state, waypoints: action.waypoints, segments: action.segments }
    default: return state
  }
}

const INITIAL: TripEditorState = {
  tripId: null,
  title: 'Mon nouveau voyage',
  waypoints: [],
  segments: [],
  isRouting: false,
  isSaving: false,
}

export function useTrip(initial?: Partial<TripEditorState>) {
  const [state, dispatch] = useReducer(reducer, { ...INITIAL, ...initial })
  // Updated synchronously so addWaypoint always sees latest waypoints even within a single event loop
  const waypointsRef = useRef<Waypoint[]>(initial?.waypoints ?? [])
  waypointsRef.current = state.waypoints

  const totalDistance  = state.segments.reduce((s, seg) => s + seg.distance_km, 0)
  const totalElevation = state.segments.reduce((s, seg) => s + seg.elevation_gain_m, 0)
  const totalDuration  = state.segments.reduce((s, seg) => s + seg.duration_min, 0)

  const addWaypoint = useCallback(async (coordinates: [number, number]) => {
    const prev = waypointsRef.current[waypointsRef.current.length - 1]
    const id = crypto.randomUUID()
    const name = `Point ${waypointsRef.current.length + 1}`
    const waypoint: Waypoint = { id, coordinates, name }

    // Update the ref synchronously so the next call sees the new waypoint immediately
    waypointsRef.current = [...waypointsRef.current, waypoint]
    dispatch({ type: 'ADD_WAYPOINT', waypoint })

    if (!prev) return

    const segmentIndex = waypointsRef.current.length - 2
    dispatch({ type: 'SET_ROUTING', value: true })
    const route = await getCyclingRoute(prev.coordinates, coordinates)
    dispatch({ type: 'SET_ROUTING', value: false })

    if (route) {
      dispatch({
        type: 'SET_SEGMENT',
        index: segmentIndex,
        segment: {
          geometry: route.geometry,
          distance_km: route.distance / 1000,
          elevation_gain_m: 0,
          duration_min: route.duration / 60,
        },
      })
    }
  }, [])

  return { state, dispatch, totalDistance, totalElevation, totalDuration, addWaypoint }
}
