// src/types/database.ts
// Manual type definitions — will be replaced by `supabase gen types` after migrations are applied
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          bike_type: string | null
          level: 'beginner' | 'intermediate' | 'expert' | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
        Relationships: []
      }
      trips: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          status: 'draft' | 'active' | 'completed'
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['trips']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['trips']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
