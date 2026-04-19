'use client'

import { useEffect, useRef } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import { MAPBOX_TOKEN, MAPBOX_STYLE, DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/mapbox/config'

interface MapBaseProps {
  className?: string
  onMapReady?: (map: MapboxMap) => void
}

export function MapBase({ className = 'h-full w-full', onMapReady }: MapBaseProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<MapboxMap | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    let map: MapboxMap

    async function initMap() {
      const mapboxgl = (await import('mapbox-gl')).default
      await import('mapbox-gl/dist/mapbox-gl.css')

      mapboxgl.accessToken = MAPBOX_TOKEN

      map = new mapboxgl.Map({
        container: containerRef.current!,
        style:     MAPBOX_STYLE,
        center:    DEFAULT_CENTER,
        zoom:      DEFAULT_ZOOM,
      })

      map.addControl(new mapboxgl.NavigationControl(), 'top-right')
      map.addControl(
        new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true } }),
        'top-right',
      )

      mapRef.current = map
      map.on('load', () => onMapReady?.(map))
    }

    initMap()

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [onMapReady])

  return <div ref={containerRef} className={className} />
}
