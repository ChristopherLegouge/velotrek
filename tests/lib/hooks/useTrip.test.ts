import { renderHook, act } from '@testing-library/react'
import { useTrip } from '@/lib/hooks/useTrip'

vi.mock('@/lib/mapbox/directions', () => ({
  getCyclingRoute: vi.fn().mockResolvedValue({
    geometry: { type: 'LineString', coordinates: [[2.3488, 48.8534], [1.9087, 47.9029]] },
    distance: 120000,
    duration: 14400,
  }),
}))

describe('useTrip', () => {
  it('starts with empty state', () => {
    const { result } = renderHook(() => useTrip())
    expect(result.current.state.waypoints).toHaveLength(0)
    expect(result.current.state.title).toBe('Mon nouveau voyage')
  })

  it('addWaypoint adds a waypoint', async () => {
    const { result } = renderHook(() => useTrip())
    await act(async () => {
      await result.current.addWaypoint([2.3488, 48.8534])
    })
    expect(result.current.state.waypoints).toHaveLength(1)
  })

  it('addWaypoint creates a segment when second waypoint added', async () => {
    const { result } = renderHook(() => useTrip())
    await act(async () => {
      await result.current.addWaypoint([2.3488, 48.8534])
      await result.current.addWaypoint([1.9087, 47.9029])
    })
    expect(result.current.state.segments).toHaveLength(1)
    expect(result.current.totalDistance).toBeCloseTo(120, 0)
  })

  it('SET_TITLE updates title', () => {
    const { result } = renderHook(() => useTrip())
    act(() => result.current.dispatch({ type: 'SET_TITLE', title: 'Vélo des Châteaux' }))
    expect(result.current.state.title).toBe('Vélo des Châteaux')
  })
})
