import { requireSupabase, handleSupabaseError } from '../../lib/supabase'
import { mapDeadline } from './mappers'
import { computeDeadlineStatus, todayISO } from '../../lib/helpers'
import type { Deadline, DeadlineStatus } from '../../types/entities'
import type { DeadlineFilters } from '../deadlineService'

function enrich(d: Deadline): Deadline {
  const status = computeDeadlineStatus(d.deadlineDate, d.status) as DeadlineStatus
  return { ...d, status: status === 'vencido' && d.status !== 'concluido' && d.status !== 'cancelado' ? 'vencido' : d.status }
}

export async function listDeadlinesDb(orgId: string, filters?: DeadlineFilters): Promise<Deadline[]> {
  const sb = requireSupabase()
  let query = sb
    .from('deadlines')
    .select('*, cases(case_number), clients(name)')
    .eq('organization_id', orgId)

  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.priority) query = query.eq('priority', filters.priority)
  if (filters?.caseId) query = query.eq('case_id', filters.caseId)
  if (filters?.clientId) query = query.eq('client_id', filters.clientId)
  if (filters?.responsibleUserId) query = query.eq('responsible_user_id', filters.responsibleUserId)
  if (filters?.from) query = query.gte('deadline_date', filters.from)
  if (filters?.to) query = query.lte('deadline_date', filters.to)

  const { data, error } = await query.order('deadline_date', { ascending: true })
  if (error) await handleSupabaseError(error)

  return (data || []).map((r) => {
    const row = r as Record<string, unknown>
    const cases = row.cases as { case_number: string } | null
    const clients = row.clients as { name: string } | null
    return enrich(
      mapDeadline(row, { caseNumber: cases?.case_number, clientName: clients?.name }),
    )
  })
}

export async function getDeadlineDb(id: string): Promise<Deadline | null> {
  const sb = requireSupabase()
  const { data, error } = await sb
    .from('deadlines')
    .select('*, cases(case_number), clients(name)')
    .eq('id', id)
    .maybeSingle()
  if (error) await handleSupabaseError(error)
  if (!data) return null
  const row = data as Record<string, unknown>
  return enrich(
    mapDeadline(row, {
      caseNumber: (row.cases as { case_number: string } | null)?.case_number,
      clientName: (row.clients as { name: string } | null)?.name,
    }),
  )
}

export async function createDeadlineDb(
  orgId: string,
  data: Omit<Deadline, 'id' | 'organizationId' | 'createdAt' | 'updatedAt' | 'caseNumber' | 'clientName'>,
): Promise<Deadline> {
  const sb = requireSupabase()
  const { data: row, error } = await sb
    .from('deadlines')
    .insert({
      organization_id: orgId,
      case_id: data.caseId || null,
      client_id: data.clientId || null,
      title: data.title,
      description: data.description,
      deadline_date: data.deadlineDate,
      internal_date: data.internalDate || null,
      priority: data.priority,
      status: data.status,
      responsible_user_id: data.responsibleUserId || null,
      source: data.source,
      ai_suggested: data.aiSuggested || false,
    })
    .select('*, cases(case_number), clients(name)')
    .single()
  if (error) await handleSupabaseError(error)
  if (!row) throw new Error('Prazo não encontrado')
  const r = row as Record<string, unknown>
  return enrich(
    mapDeadline(r, {
      caseNumber: (r.cases as { case_number: string } | null)?.case_number,
      clientName: (r.clients as { name: string } | null)?.name,
    }),
  )
}

export async function updateDeadlineDb(id: string, data: Partial<Deadline>): Promise<Deadline> {
  const sb = requireSupabase()
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (data.title !== undefined) payload.title = data.title
  if (data.description !== undefined) payload.description = data.description
  if (data.deadlineDate !== undefined) payload.deadline_date = data.deadlineDate
  if (data.internalDate !== undefined) payload.internal_date = data.internalDate
  if (data.priority !== undefined) payload.priority = data.priority
  if (data.status !== undefined) payload.status = data.status
  if (data.completedAt !== undefined) payload.completed_at = data.completedAt

  const { data: row, error } = await sb
    .from('deadlines')
    .update(payload)
    .eq('id', id)
    .select('*, cases(case_number), clients(name)')
    .single()
  if (error) await handleSupabaseError(error)
  if (!row) throw new Error('Prazo não encontrado')
  const r = row as Record<string, unknown>
  return enrich(
    mapDeadline(r, {
      caseNumber: (r.cases as { case_number: string } | null)?.case_number,
      clientName: (r.clients as { name: string } | null)?.name,
    }),
  )
}

export async function deleteDeadlineDb(id: string): Promise<void> {
  const sb = requireSupabase()
  const { error } = await sb.from('deadlines').delete().eq('id', id)
  if (error) await handleSupabaseError(error)
}

export async function getDashboardDeadlineStatsDb(orgId: string) {
  const deadlines = await listDeadlinesDb(orgId)
  const today = todayISO()
  const weekEnd = new Date()
  weekEnd.setDate(weekEnd.getDate() + 7)
  const weekEndStr = weekEnd.toISOString().split('T')[0]

  return {
    vencidos: deadlines.filter((d) => d.status === 'vencido').length,
    hoje: deadlines.filter((d) => d.deadlineDate === today && d.status !== 'concluido' && d.status !== 'cancelado').length,
    proximos7: deadlines.filter(
      (d) => d.deadlineDate > today && d.deadlineDate <= weekEndStr && d.status !== 'concluido' && d.status !== 'cancelado',
    ).length,
    pendentes: deadlines.filter((d) => d.status === 'pendente' || d.status === 'em_andamento').length,
  }
}
