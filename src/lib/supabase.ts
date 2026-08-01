import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env, isSupabaseConfigured } from '../config/env'
import type { Database } from '../types/database'

export class SupabaseConnectionError extends Error {
  constructor(message = 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.') {
    super(message)
    this.name = 'SupabaseConnectionError'
  }
}

let client: SupabaseClient<Database> | null = null
let connectionChecked = false
let connectionAvailable = true

export function getSupabase(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) return null
  if (!client) {
    client = createClient<Database>(env.supabaseUrl!, env.supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'jurismind-auth',
      },
    })
  }
  return client
}

export function requireSupabase(): SupabaseClient<Database> {
  const sb = getSupabase()
  if (!sb) {
    throw new SupabaseConnectionError(
      'Supabase não está configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env',
    )
  }
  return sb
}

export async function checkSupabaseConnection(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    connectionAvailable = false
    connectionChecked = true
    return false
  }
  try {
    const sb = requireSupabase()
    const { error } = await sb.from('organizations').select('id').limit(1)
    connectionAvailable = !error || error.code !== 'PGRST301'
    connectionChecked = true
    return connectionAvailable
  } catch {
    connectionAvailable = false
    connectionChecked = true
    return false
  }
}

export function isConnectionAvailable(): boolean {
  return connectionChecked ? connectionAvailable : isSupabaseConfigured()
}

export function getConnectionMessage(): string | null {
  if (env.demoMode) return null
  if (!isSupabaseConfigured()) {
    return 'Configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para usar o modo produção.'
  }
  if (connectionChecked && !connectionAvailable) {
    return 'Servidor temporariamente indisponível. Tente novamente em instantes.'
  }
  return null
}

export async function handleSupabaseError(error: { message?: string; code?: string }): Promise<never> {
  if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
    throw new SupabaseConnectionError('Sessão expirada. Faça login novamente.')
  }
  if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
    throw new SupabaseConnectionError()
  }
  throw new Error(error.message || 'Erro ao processar solicitação.')
}
