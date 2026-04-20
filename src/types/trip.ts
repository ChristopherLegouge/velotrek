export type Waypoint = {
  id: string
  coordinates: [number, number]  // [lng, lat]
  name: string
}

export type RouteSegment = {
  geometry: GeoJSON.LineString
  distance_km: number
  elevation_gain_m: number
  duration_min: number
}

export type TripEditorState = {
  tripId: string | null
  title: string
  waypoints: Waypoint[]
  segments: RouteSegment[]    // segments[i] connects waypoints[i] → waypoints[i+1]
  isRouting: boolean
  isSaving: boolean
}

export type StageInput = {
  title: string
  distance_km: number
  elevation_m: number
  gpx_data: string            // JSON.stringify(GeoJSON.LineString)
}
