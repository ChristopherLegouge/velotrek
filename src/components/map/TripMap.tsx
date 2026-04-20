'use client'

import { useEffect, useRef } from 'react'
import type { Map as MapboxMap, Marker, GeoJSONSource } from 'mapbox-gl'
import type { Waypoint, RouteSegment } from '@/types/trip'
import { MAPBOX_TOKEN, MAPBOX_STYLE, DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/mapbox/config'

interface TripMapProps {
  waypoints: Waypoint[]
  segments: RouteSegment[]
  onMapClick: (coordinates: [number, number]) => void
  isRouting?: boolean
  className?: string
}

export function TripMap({
  waypoints, segments, onMapClick, isRouting = false, className = 'h-full w-full',
}: TripMapProps) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const mapRef        = useRef<MapboxMap | null>(null)
  const markersRef    = useRef<Marker[]>([])
  const onClickRef    = useRef(onMapClick)
  const mapLoadedRef  = useRef(false)

  useEffect(() => { onClickRef.current = onMapClick }, [onMapClick])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    let cancelled = false

    async function init() {
      const mapboxgl = (await import('mapbox-gl')).default
      await import('mapbox-gl/dist/mapbox-gl.css')
      if (cancelled || !containerRef.current) return

      mapboxgl.accessToken = MAPBOX_TOKEN
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: MAPBOX_STYLE,
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
      })

      map.addControl(new mapboxgl.NavigationControl(), 'top-right')
      map.addControl(
        new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true } }),
        'top-right',
      )

      map.on('load', () => {
        map.addSource('route', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] },
        })
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          paint: { 'line-color': '#2E86C1', 'line-width': 4, 'line-opacity': 0.9 },
        })
        mapLoadedRef.current = true
      })

      map.on('click', (e) => {
        onClickRef.current([e.lngLat.lng, e.lngLat.lat])
      })

      mapRef.current = map
    }

    init()
    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
      mapLoadedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return
    let cancelled = false

    async function updateMarkers() {
      const mapboxgl = (await import('mapbox-gl')).default
      if (cancelled || !mapRef.current) return

      markersRef.current.forEach(m => m.remove())
      markersRef.current = []

      waypoints.forEach((wp, i) => {
        const el = document.createElement('div')
        const isFirst = i === 0
        const isLast  = i === waypoints.length - 1 && waypoints.length > 1
        const bg = isFirst ? '#2E86C1' : isLast ? '#E74C3C' : '#F39C12'

        Object.assign(el.style, {
          width: '32px', height: '32px', borderRadius: '50%',
          backgroundColor: bg, color: 'white', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', fontSize: '13px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)', cursor: 'pointer',
        })
        el.textContent = String(i + 1)

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(wp.coordinates)
          .addTo(mapRef.current!)
        markersRef.current.push(marker)
      })
    }

    updateMarkers()
    return () => { cancelled = true }
  }, [waypoints])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapLoadedRef.current) return

    const features = segments.map(s => ({
      type: 'Feature' as const,
      geometry: s.geometry,
      properties: {},
    }))

    const source = map.getSource('route') as GeoJSONSource | undefined
    source?.setData({ type: 'FeatureCollection', features })
  }, [segments])

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className={className} />
      {isRouting && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-night/80 text-white text-sm px-4 py-2 rounded-full">
          Calcul de l&apos;itinéraire…
        </div>
      )}
    </div>
  )
}
