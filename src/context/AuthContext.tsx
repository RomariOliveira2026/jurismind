import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AuthSession, SignUpData } from '../types/auth'
import type { UserRole } from '../types/auth'
import { env } from '../config/env'
import { getSupabase } from '../lib/supabase'
import {
  initializeAuth,
  signIn,
  signInDemo,
  signOut,
  signUp,
  resetPassword,
  updatePassword,
} from '../services/authService'
import { buildAuthSession, clearStoredSession } from '../services/supabase/auth'
import { hasPermission, canWrite } from '../lib/permissions'

interface AuthContextValue {
  session: AuthSession | null
  loading: boolean
  isDemo: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (data: SignUpData) => Promise<{ error: string | null; needsEmailConfirmation?: boolean }>
  signInDemo: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<string | null>
  updatePassword: (password: string) => Promise<string | null>
  hasPermission: (permission: Parameters<typeof hasPermission>[1]) => boolean
  canWrite: boolean
  role: UserRole | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const init = async () => {
      const s = await initializeAuth()
      if (mounted) setSession(s)
      if (mounted) setLoading(false)
    }

    init()

    if (env.demoMode) return () => { mounted = false }

    const supabase = getSupabase()
    if (!supabase) return () => { mounted = false }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, supaSession) => {
      if (!mounted) return
      if (event === 'SIGNED_OUT' || !supaSession?.user) {
        clearStoredSession()
        setSession(null)
        return
      }
      if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        const s = await buildAuthSession(supaSession.user.id, supaSession.user.email!)
        if (s) setSession(s)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleSignIn = useCallback(async (email: string, password: string) => {
    const { session: s, error } = await signIn(email, password)
    if (error) return error.message
    setSession(s)
    return null
  }, [])

  const handleSignUp = useCallback(async (data: SignUpData) => {
    const { session: s, error, needsEmailConfirmation } = await signUp(data)
    if (error) return { error: error.message }
    if (s) setSession(s)
    return { error: null, needsEmailConfirmation }
  }, [])

  const handleDemo = useCallback(async () => {
    const s = await signInDemo()
    setSession(s)
  }, [])

  const handleSignOut = useCallback(async () => {
    const current = session
    await signOut(current)
    setSession(null)
  }, [session])

  const handleReset = useCallback(async (email: string) => {
    const { error } = await resetPassword(email)
    return error?.message ?? null
  }, [])

  const handleUpdatePassword = useCallback(async (password: string) => {
    const { error } = await updatePassword(password)
    return error?.message ?? null
  }, [])

  const role = session?.role ?? null

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        isDemo: session?.isDemo ?? false,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signInDemo: handleDemo,
        signOut: handleSignOut,
        resetPassword: handleReset,
        updatePassword: handleUpdatePassword,
        hasPermission: (p) => (role ? hasPermission(role, p) : false),
        canWrite: role ? canWrite(role) : false,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
