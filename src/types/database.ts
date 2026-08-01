export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type GenericTable = {
  Row: Record<string, unknown>
  Insert: Record<string, unknown>
  Update: Record<string, unknown>
  Relationships: []
}

export interface Database {
  public: {
    Tables: {
      profiles: GenericTable
      organizations: GenericTable
      organization_members: GenericTable
      organization_settings: GenericTable
      clients: GenericTable
      cases: GenericTable
      deadlines: GenericTable
      publications: GenericTable
      publication_analyses: GenericTable
      tasks: GenericTable
      documents: GenericTable
      notifications: GenericTable
      activity_logs: GenericTable
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
