// tests/lib/supabase-client.test.ts
import { createBrowserClient } from '@/lib/supabase/client'

vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')

describe('createBrowserClient', () => {
  it('returns a supabase client with auth methods', () => {
    const client = createBrowserClient()
    expect(client).toHaveProperty('auth')
    expect(client.auth).toHaveProperty('signInWithPassword')
    expect(client.auth).toHaveProperty('signOut')
  })

  it('returns the same instance on multiple calls (singleton)', () => {
    const a = createBrowserClient()
    const b = createBrowserClient()
    expect(a).toBe(b)
  })
})
