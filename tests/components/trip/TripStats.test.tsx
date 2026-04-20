import { render, screen } from '@testing-library/react'
import { TripStats } from '@/components/trip/TripStats'

describe('TripStats', () => {
  it('displays formatted distance', () => {
    render(<TripStats distanceKm={120.5} elevationM={1200} durationMin={480} />)
    expect(screen.getByText('120.5 km')).toBeInTheDocument()
  })

  it('displays elevation', () => {
    render(<TripStats distanceKm={0} elevationM={500} durationMin={0} />)
    expect(screen.getByText('+500 m')).toBeInTheDocument()
  })

  it('displays hours for long durations', () => {
    render(<TripStats distanceKm={0} elevationM={0} durationMin={120} />)
    expect(screen.getByText('2h')).toBeInTheDocument()
  })

  it('shows dashes when values are zero', () => {
    render(<TripStats distanceKm={0} elevationM={0} durationMin={0} />)
    expect(screen.getAllByText('—')).toHaveLength(3)
  })
})
