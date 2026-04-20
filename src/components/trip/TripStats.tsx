interface TripStatsProps {
  distanceKm: number
  elevationM: number
  durationMin: number
}

export function TripStats({ distanceKm, elevationM, durationMin }: TripStatsProps) {
  const hours = Math.floor(durationMin / 60)
  const mins  = Math.round(durationMin % 60)
  const durationLabel = hours > 0 ? `${hours}h${mins > 0 ? mins : ''}` : `${mins} min`

  return (
    <div className="grid grid-cols-3 gap-2 text-center">
      {[
        { label: 'Distance', value: distanceKm > 0 ? `${distanceKm.toFixed(1)} km` : '—' },
        { label: 'Dénivelé', value: elevationM > 0 ? `+${elevationM} m` : '—' },
        { label: 'Durée est.', value: durationMin > 0 ? durationLabel : '—' },
      ].map(({ label, value }) => (
        <div key={label} className="bg-surface rounded-lg p-2">
          <div className="font-heading font-bold text-ink text-sm">{value}</div>
          <div className="text-xs text-muted mt-0.5">{label}</div>
        </div>
      ))}
    </div>
  )
}
