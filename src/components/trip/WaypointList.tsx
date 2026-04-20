'use client'

import type { Waypoint, RouteSegment } from '@/types/trip'

interface WaypointListProps {
  waypoints: Waypoint[]
  segments: RouteSegment[]
  onRename: (id: string, name: string) => void
  onRemove: (id: string) => void
}

export function WaypointList({ waypoints, segments, onRename, onRemove }: WaypointListProps) {
  if (!waypoints.length) {
    return (
      <p className="text-sm text-muted text-center py-8">
        Clique sur la carte pour ajouter ton premier point.
      </p>
    )
  }

  return (
    <ol className="space-y-2">
      {waypoints.map((wp, i) => {
        const seg = segments[i - 1]
        return (
          <li key={wp.id} className="flex items-center gap-2 group">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: i === 0 ? '#2E86C1' : i === waypoints.length - 1 && waypoints.length > 1 ? '#E74C3C' : '#F39C12' }}
            >
              {i + 1}
            </span>
            <input
              type="text"
              value={wp.name}
              onChange={e => onRename(wp.id, e.target.value)}
              className="flex-1 text-sm bg-transparent border-b border-transparent focus:border-blue focus:outline-none text-ink"
            />
            {seg && (
              <span className="text-xs text-muted flex-shrink-0">
                {seg.distance_km.toFixed(1)} km
              </span>
            )}
            <button
              onClick={() => onRemove(wp.id)}
              className="opacity-0 group-hover:opacity-100 text-muted hover:text-action text-lg leading-none flex-shrink-0"
              aria-label="Supprimer ce point"
            >
              ×
            </button>
          </li>
        )
      })}
    </ol>
  )
}
