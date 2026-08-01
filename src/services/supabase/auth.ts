import { requireSupabase, handleSupabaseError } from '../../lib/supabase'
import { mapProfile, mapOrganization } from './mappers'
import type { AuthSession, SignUpData } from '../../types/auth'
import type { UserRole } from '../../types/auth'

const SESSION_KEY = 'jurismind-session'

export async function buildAuthSession(userId: string, email: string): Promise<AuthSession | null> {
  const sb = requireSupabase()

  const { data: profileRow, error: profileError } = await sb
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (profileError) await handleSupabaseError(profileError)
  if (!profileRow) return null

  const { data: memberRow, error: memberError } = await sb
    .from('organization_members')
    .select('role, organization_id, organizations(*)')
    .eq('user_id', userId)
    .maybeSingle()

  if (memberError) await handleSupabaseError(memberError)
  if (!memberRow) return null

  const member = memberRow as Record<string, unknown>
  const orgRaw = member.organizations
  if (!orgRaw) return null

  const org = Array.isArray(orgRaw) ? orgRaw[0] : orgRaw

  const session: AuthSession = {
    userId,
    email,
    profile: mapProfile(profileRow as Record<string, unknown>),
    organization: mapOrganization(org as Record<string, unknown>),
    role: (member.role as UserRole) || (profileRow.role as UserRole),
    isDemo: false,
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export async function provisionOrganization(
  userId: string,
  data: SignUpData,
): Promise<{ organizationId: string } | { error: string }> {
  const sb = requireSupabase()

  const { data: org, error: orgError } = await sb
    .from('organizations')
    .insert({
      name: data.organizationName,
      document: data.organizationDocument || null,
      plan: 'gratuito',
    })
    .select('id')
    .single()

  if (orgError || !org) {
    return { error: 'Não foi possível criar o escritório. Tente novamente.' }
  }

  const orgId = org.id as string

  const { error: profileError } = await sb.from('profiles').upsert({
    id: userId,
    email: data.email,
    full_name: data.fullName,
    phone: data.phone || null,
    oab_number: data.oabNumber || null,
    oab_state: data.oabState || null,
    role: 'admin',
    updated_at: new Date().toISOString(),
  })

  if (profileError) {
    await sb.from('organizations').delete().eq('id', orgId)
    return { error: 'Não foi possível criar seu perfil. Tente novamente.' }
  }

  const { error: memberError } = await sb.from('organization_members').insert({
    organization_id: orgId,
    user_id: userId,
    role: 'admin',
  })

  if (memberError) {
    await sb.from('organizations').delete().eq('id', orgId)
    return { error: 'Não foi possível vincular você ao escritório.' }
  }

  await sb.from('organization_settings').insert({ organization_id: orgId })

  return { organizationId: orgId }
}

export async function logActivityDb(
  organizationId: string,
  userId: string,
  action: string,
  entityType: string,
  entityId?: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const sb = requireSupabase()
  await sb.from('activity_logs').insert({
    organization_id: organizationId,
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId || null,
    metadata: metadata || {},
  })
}

export function clearStoredSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

export { SESSION_KEY }
