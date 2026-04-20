'use client'

import dynamic from 'next/dynamic'

const MapBase = dynamic(
  () => import('@/components/map/MapBase').then(m => m.MapBase),
  { ssr: false, loading: () => <div className="h-full w-full bg-night animate-pulse" /> }
)

export function MapClient({ className }: { className?: string }) {
  return <MapBase className={className} />
}
