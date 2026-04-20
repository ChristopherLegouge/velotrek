'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { RouteSegment } from '@/types/trip'

interface ElevationProfileProps {
  segments: RouteSegment[]
  className?: string
}

type DataPoint = { distance: number; elevation: number }

function buildElevationData(segments: RouteSegment[]): DataPoint[] {
  const points: DataPoint[] = []
  let cumDist = 0

  segments.forEach(seg => {
    const coords = seg.geometry.coordinates
    const distPerPoint = seg.distance_km / Math.max(coords.length - 1, 1)

    coords.forEach((coord, i) => {
      const elevation = (coord[2] as number | undefined) ?? 0
      points.push({ distance: parseFloat((cumDist + i * distPerPoint).toFixed(2)), elevation })
    })
    cumDist += seg.distance_km
  })

  return points
}

export function ElevationProfile({ segments, className = '' }: ElevationProfileProps) {
  const data = buildElevationData(segments)
  const hasElevation = data.some(d => d.elevation !== 0)

  if (!hasElevation || !data.length) {
    return (
      <div className={`flex items-center justify-center text-sm text-muted ${className}`}>
        Données d&apos;altitude non disponibles pour cet itinéraire
      </div>
    )
  }

  return (
    <div className={className}>
      <p className="text-xs text-muted mb-1 px-2">Profil altimétrique</p>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2E86C1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#2E86C1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="distance"
            tickFormatter={v => `${v} km`}
            tick={{ fontSize: 10, fill: '#4A5568' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={v => `${v}m`}
            tick={{ fontSize: 10, fill: '#4A5568' }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            formatter={(v) => [`${v}m`, 'Altitude']}
            labelFormatter={(l) => `${l} km`}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
          />
          <Area
            type="monotone"
            dataKey="elevation"
            stroke="#2E86C1"
            strokeWidth={2}
            fill="url(#elevGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
