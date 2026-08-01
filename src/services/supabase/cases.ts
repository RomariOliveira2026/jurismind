import { requireSupabase, handleSupabaseError } from '../../lib/supabase'
import { mapCase } from './mappers'
import type { Case } from '../../types/entities'
import type { CaseFilters } from '../caseService'

export async function listCasesDb(orgId: string, filters?: CaseFilters): Promise<Case[]> {
  const sb = requireSupabase()
  let query = sb.from('cases').select('*, clients(name)').eq('organization_id', orgId)

  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.court) query = query.eq('court', filters.court)
  if (filters?.phase) query = query.eq('phase', filters.phase)
  if (filters?.practiceArea) query = query.eq('practice_area', filters.practiceArea)
  if (filters?.responsibleUserId) query = query.eq('responsible_user_id', filters.responsibleUserId)
  if (filters?.search) {
    const q = `%${filters.search}%`
    query = query.or(`case_number.ilike.${q},title.ilike.${q}`)
  }

  const { data, error } = await query.order('updated_at', { ascending: false })
  if (error) await handleSupabaseError(error)

  return (data || []).map((r) => {
    const row = r as Record<string, unknown>
    const clients = row.clients as { name: string } | null
    return mapCase(row, clients?.name)
  })
}

export async function getCaseDb(id: string): Promise<Case | null> {
  const sb = requireSupabase()
  const { data, error } = await sb.from('cases').select('*, clients(name)').eq('id', id).maybeSingle()
  if (error) await handleSupabaseError(error)
  if (!data) return null
  const row = data as Record<string, unknown>
  const clients = row.clients as { name: string } | null
  return mapCase(row, clients?.name)
}

export async function createCaseDb(
  orgId: string,
  data: Omit<Case, 'id' | 'organizationId' | 'createdAt' | 'updatedAt' | 'clientName'>,
): Promise<Case> {
  const sb = requireSupabase()
  const { data: row, error } = await sb
    .from('cases')
    .insert({
      organization_id: orgId,
      client_id: data.clientId || null,
      case_number: data.caseNumber,
      title: data.title,
      court: data.court,
      jurisdiction: data.jurisdiction,
      district: data.district,
      practice_area: data.practiceArea,
      case_type: data.caseType,
      opposing_party: data.opposingParty,
      responsible_user_id: data.responsibleUserId,
      status: data.status,
      phase: data.phase,
      estimated_value: data.estimatedValue,
      notes: data.notes,
    })
    .select('*, clients(name)')
    .single()
  if (error) await handleSupabaseError(error)
  if (!row) throw new Error('Processo não encontrado')
  const r = row as Record<string, unknown>
  return mapCase(r, (r.clients as { name: string } | null)?.name)
}

export async function updateCaseDb(id: string, data: Partial<Case>): Promise<Case> {
  const sb = requireSupabase()
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (data.clientId !== undefined) payload.client_id = data.clientId
  if (data.caseNumber !== undefined) payload.case_number = data.caseNumber
  if (data.title !== undefined) payload.title = data.title
  if (data.court !== undefined) payload.court = data.court
  if (data.jurisdiction !== undefined) payload.jurisdiction = data.jurisdiction
  if (data.district !== undefined) payload.district = data.district
  if (data.practiceArea !== undefined) payload.practice_area = data.practiceArea
  if (data.caseType !== undefined) payload.case_type = data.caseType
  if (data.opposingParty !== undefined) payload.opposing_party = data.opposingParty
  if (data.responsibleUserId !== undefined) payload.responsible_user_id = data.responsibleUserId
  if (data.status !== undefined) payload.status = data.status
  if (data.phase !== undefined) payload.phase = data.phase
  if (data.notes !== undefined) payload.notes = data.notes

  const { data: row, error } = await sb.from('cases').update(payload).eq('id', id).select('*, clients(name)').single()
  if (error) await handleSupabaseError(error)
  if (!row) throw new Error('Processo não encontrado')
  const r = row as Record<string, unknown>
  return mapCase(r, (r.clients as { name: string } | null)?.name)
}
