'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { parseGpx, generateGpx } from '@/lib/mapbox/gpx'
import type { Waypoint, RouteSegment } from '@/types/trip'

interface GpxControlsProps {
  tripTitle: string
  waypoints: Waypoint[]
  segments: RouteSegment[]
  onImport: (coordinates: [number, number][]) => void
}

export function GpxControls({ tripTitle, waypoints, segments, onImport }: GpxControlsProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = ev => {
      const coords = parseGpx(ev.target?.result as string)
      if (coords.length < 2) {
        alert('Fichier GPX invalide ou trop peu de points.')
        return
      }
      const step = Math.max(1, Math.floor(coords.length / 20))
      const sampled = coords.filter((_, i) => i % step === 0)
      onImport(sampled)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleExport() {
    const allCoords: [number, number][] = []
    segments.forEach(seg => {
      seg.geometry.coordinates.forEach(c => allCoords.push(c as [number, number]))
    })

    if (!allCoords.length && waypoints.length) {
      waypoints.forEach(wp => allCoords.push(wp.coordinates))
    }

    if (!allCoords.length) {
      alert('Aucun itinéraire à exporter.')
      return
    }

    const gpx = generateGpx(allCoords, tripTitle)
    const blob = new Blob([gpx], { type: 'application/gpx+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${tripTitle.replace(/\s+/g, '-').toLowerCase()}.gpx`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex gap-2">
      <input
        ref={inputRef}
        type="file"
        accept=".gpx"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button variant="ghost" size="sm" onClick={() => inputRef.current?.click()}>
        Importer GPX
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleExport}
        disabled={waypoints.length < 2}
      >
        Exporter GPX
      </Button>
    </div>
  )
}
