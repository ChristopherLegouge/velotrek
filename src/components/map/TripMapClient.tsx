'use client'

import dynamic from 'next/dynamic'
import type { Waypoint, RouteSegment } from '@/types/trip'

const TripMap = dynamic(
  () => import('@/components/map/TripMap').then(m => m.TripMap),
  { ssr: false, loading: () => <div className="h-full w-full bg-night animate-pulse" /> }
)

interface TripMapClientProps {
  waypoints: Waypoint[]
  segments: RouteSegment[]
  onMapClick: (coordinates: [number, number]) => void
  isRouting?: boolean
  className?: string
}

export function TripMapClient(props: TripMapClientProps) {
  return <TripMap {...props} />
}
