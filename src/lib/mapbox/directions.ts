import { MAPBOX_TOKEN } from './config'

export type DirectionsResult = {
  geometry: GeoJSON.LineString
  distance: number    // mètres
  duration: number    // secondes
}

export async function getCyclingRoute(
  from: [number, number],
  to: [number, number],
): Promise<DirectionsResult | null> {
  const coords = `${from[0]},${from[1]};${to[0]},${to[1]}`
  const url =
    `https://api.mapbox.com/directions/v5/mapbox/cycling/${coords}` +
    `?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`

  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    if (!data.routes?.length) return null
    const route = data.routes[0]
    return { geometry: route.geometry, distance: route.distance, duration: route.duration }
  } catch {
    return null
  }
}
