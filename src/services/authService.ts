import type { AuthSession, SignUpData } from '../types/auth'
import { env } from '../config/env'
import { getSupabase } from '../lib/supabase'
import {
  createDemoSession,
  DEMO_CREDENTIALS,
  getDemoStore,
  resetDemoStore,
} from './demo/demoStore'
import { generateId } from '../lib/helpers'
import {
  buildAuthSession,
  provisionOrganization,
  logActivityDb,
  clearStoredSession,
} from './supabase/auth'

export type AuthError = { message: string }

export async function initializeAuth(): Promise<AuthSession | null> {
  if (env.demoMode) return getStoredSession()

  const supabase = getSupabase()
  if (!supabase) return null

  const { data: { session: supaSession } } = await supabase.auth.getSession()
  if (!supaSession?.user) {
    clearStoredSession()
    return null
  }

  let session = await buildAuthSession(supaSession.user.id, supaSession.user.email!)
  if (!session) {
    const meta = supaSession.user.user_metadata
    if (meta?.organization_name) {
      const result = await provisionOrganization(supaSession.user.id, signUpFromMetadata(supaSession.user.email!, meta))
      if (!('error' in result)) {
        session = await buildAuthSession(supaSession.user.id, supaSession.user.email!)
      }
    }
  }
  return session
}

export async function signIn(email: string, password: string): Promise<{ session: AuthSession | null; error: AuthError | null }> {
  if (env.demoMode) {
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      const session = createDemoSession()
      localStorage.setItem('jurismind-session', JSON.stringify(session))
      getDemoStore()
      return { session, error: null }
    }
    return { session: null, error: { message: 'E-mail ou senha incorretos. Use demo@jurismind.com.br / demo123' } }
  }

  const supabase = getSupabase()
  if (!supabase) return { session: null, error: { message: 'Supabase não configurado.' } }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { session: null, error: { message: friendlyAuthError(error.message) } }

  let session = await buildAuthSession(data.user.id, data.user.email!)
  if (!session) {
    const meta = data.user.user_metadata
    if (meta?.organization_name) {
      const provision = await provisionOrganization(data.user.id, signUpFromMetadata(data.user.email!, meta))
      if ('error' in provision) return { session: null, error: { message: provision.error } }
      session = await buildAuthSession(data.user.id, data.user.email!)
    }
  }
  if (!session) return { session: null, error: { message: 'Perfil não encontrado. Entre em contato com o suporte.' } }

  await logActivityDb(session.organization.id, data.user.id, 'login', 'auth')
  return { session, error: null }
}

export async function signUp(data: SignUpData): Promise<{ session: AuthSession | null; error: AuthError | null; needsEmailConfirmation?: boolean }> {
  if (!data.acceptTerms) {
    return { session: null, error: { message: 'Você precisa aceitar os Termos de Uso e a Política de Privacidade.' } }
  }

  if (env.demoMode) {
    const session: AuthSession = {
      userId: generateId(),
      email: data.email,
      profile: {
        id: generateId(),
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        oabNumber: data.oabNumber,
        oabState: data.oabState,
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      organization: {
        id: generateId(),
        name: data.organizationName,
        document: data.organizationDocument,
        plan: 'gratuito',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      role: 'admin',
      isDemo: true,
    }
    localStorage.setItem('jurismind-session', JSON.stringify(session))
    resetDemoStore()
    return { session, error: null }
  }

  const supabase = getSupabase()
  if (!supabase) return { session: null, error: { message: 'Supabase não configurado.' } }

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
        phone: data.phone,
        oab_number: data.oabNumber,
        oab_state: data.oabState,
        organization_name: data.organizationName,
        organization_document: data.organizationDocument,
      },
    },
  })
  if (error) return { session: null, error: { message: friendlyAuthError(error.message) } }
  if (!authData.user) return { session: null, error: { message: 'Não foi possível criar a conta.' } }

  if (!authData.session) {
    return { session: null, error: null, needsEmailConfirmation: true }
  }

  const provision = await provisionOrganization(authData.user.id, data)
  if ('error' in provision) {
    await supabase.auth.signOut()
    clearStoredSession()
    return { session: null, error: { message: provision.error } }
  }

  const session = await buildAuthSession(authData.user.id, authData.user.email!)
  if (session) {
    await logActivityDb(session.organization.id, authData.user.id, 'cadastro', 'auth')
  }
  return { session, error: null }
}

export async function signInDemo(): Promise<AuthSession> {
  const session = createDemoSession()
  localStorage.setItem('jurismind-session', JSON.stringify(session))
  getDemoStore()
  return session
}

export async function signOut(session?: AuthSession | null): Promise<void> {
  if (!env.demoMode && session) {
    try {
      await logActivityDb(session.organization.id, session.userId, 'logout', 'auth')
    } catch {
      // não bloquear logout
    }
  }
  clearStoredSession()
  if (!env.demoMode) {
    await getSupabase()?.auth.signOut()
  }
}

export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  if (env.demoMode) {
    return { error: { message: 'No modo demonstração, use demo@jurismind.com.br / demo123' } }
  }
  const supabase = getSupabase()
  if (!supabase) return { error: { message: 'Supabase não configurado.' } }
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/redefinir-senha`,
  })
  return { error: error ? { message: friendlyAuthError(error.message) } : null }
}

export async function updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
  if (env.demoMode) {
    return { error: { message: 'Alteração de senha indisponível no modo demonstração.' } }
  }
  const supabase = getSupabase()
  if (!supabase) return { error: { message: 'Supabase não configurado.' } }
  if (newPassword.length < 6) return { error: { message: 'A senha deve ter pelo menos 6 caracteres.' } }
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  return { error: error ? { message: friendlyAuthError(error.message) } : null }
}

export function getStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem('jurismind-session')
    return raw ? (JSON.parse(raw) as AuthSession) : null
  } catch {
    return null
  }
}

function signUpFromMetadata(email: string, meta: Record<string, unknown>): SignUpData {
  return {
    email,
    password: '',
    fullName: String(meta.full_name || ''),
    phone: meta.phone ? String(meta.phone) : undefined,
    oabNumber: meta.oab_number ? String(meta.oab_number) : undefined,
    oabState: meta.oab_state ? String(meta.oab_state) : undefined,
    organizationName: String(meta.organization_name || 'Meu Escritório'),
    organizationDocument: meta.organization_document ? String(meta.organization_document) : undefined,
    acceptTerms: true,
  }
}

function friendlyAuthError(msg: string): string {
  if (msg.includes('Invalid login')) return 'E-mail ou senha incorretos.'
  if (msg.includes('already registered')) return 'Este e-mail já está cadastrado.'
  if (msg.includes('Password')) return 'A senha deve ter pelo menos 6 caracteres.'
  if (msg.includes('same as the old')) return 'A nova senha deve ser diferente da anterior.'
  return msg
}
