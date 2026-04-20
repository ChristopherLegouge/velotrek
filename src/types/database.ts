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
      stages: {
        Row: {
          id: string
          trip_id: string
          order: number
          title: string
          distance_km: number | null
          elevation_m: number | null
          gpx_data: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['stages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['stages']['Insert']>
        Relationships: []
      }
      journal_entries: {
        Row: {
          id: string
          stage_id: string
          content_rich: string | null
          difficulty: number | null
          weather: Record<string, unknown> | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['journal_entries']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['journal_entries']['Insert']>
        Relationships: []
      }
      photos: {
        Row: {
          id: string
          entry_id: string
          storage_path: string
          caption: string | null
          taken_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['photos']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['photos']['Insert']>
        Relationships: []
      }
      expenses: {
        Row: {
          id: string
          trip_id: string
          category: 'accommodation' | 'food' | 'transport' | 'equipment' | 'other'
          amount: number
          currency: string
          description: string | null
          date: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['expenses']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['expenses']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
