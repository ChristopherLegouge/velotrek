import { createTrip, deleteTrip, saveStages } from '@/actions/trips'

const mockInsert = vi.fn()
const mockDelete = vi.fn()
const mockSelect = vi.fn()
const mockUpdate = vi.fn()
const mockGetUser = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: () => ({
    auth: { getUser: mockGetUser },
    from: () => ({
      insert: mockInsert,
      delete: () => ({ eq: mockDelete }),
      select: mockSelect,
      update: () => ({ eq: mockUpdate }),
    }),
  }),
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('next/navigation', () => ({ redirect: vi.fn() }))

describe('trips server actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } })
  })

  it('createTrip inserts trip with user_id and returns id', async () => {
    mockInsert.mockReturnValue({
      select: () => ({ single: () => Promise.resolve({ data: { id: 'trip-abc' }, error: null }) }),
    })
    const id = await createTrip('Tour de France')
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user-123', title: 'Tour de France' })
    )
    expect(id).toBe('trip-abc')
  })

  it('createTrip throws if not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    await expect(createTrip('Test')).rejects.toThrow('Non authentifié')
  })
})
