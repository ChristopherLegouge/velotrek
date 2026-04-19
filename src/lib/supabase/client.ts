// src/lib/supabase/client.ts
import { createBrowserClient as createClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

let instance: ReturnType<typeof createClient<Database>> | null = null

export function createBrowserClient() {
  if (instance) return instance
  instance = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  return instance
}
