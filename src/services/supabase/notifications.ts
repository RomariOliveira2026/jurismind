import { requireSupabase, handleSupabaseError } from '../../lib/supabase'
import { mapNotification, mapActivityLog, mapDocument, mapTask, mapOrganizationSettings } from './mappers'
import type { Notification, ActivityLog, Document, Task, OrganizationSettings, AgendaEvent } from '../../types/entities'
import { listDeadlinesDb } from './deadlines'

export async function listNotificationsDb(userId: string): Promise<Notification[]> {
  const sb = requireSupabase()
  const { data, error } = await sb
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) await handleSupabaseError(error)
  return (data || []).map((r) => mapNotification(r as Record<string, unknown>))
}

export async function markNotificationReadDb(id: string): Promise<void> {
  const sb = requireSupabase()
  const { error } = await sb.from('notifications').update({ read: true }).eq('id', id)
  if (error) await handleSupabaseError(error)
}

export async function markAllNotificationsReadDb(userId: string): Promise<void> {
  const sb = requireSupabase()
  const { error } = await sb.from('notifications').update({ read: true }).eq('user_id', userId)
  if (error) await handleSupabaseError(error)
}

export async function deleteNotificationDb(id: string): Promise<void> {
  const sb = requireSupabase()
  const { error } = await sb.from('notifications').delete().eq('id', id)
  if (error) await handleSupabaseError(error)
}

export async function countUnreadNotificationsDb(userId: string): Promise<number> {
  const sb = requireSupabase()
  const { count, error } = await sb
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false)
  if (error) await handleSupabaseError(error)
  return count || 0
}

export async function createNotificationDb(
  orgId: string,
  userId: string,
  type: string,
  title: string,
  message: string,
  referenceType?: string,
  referenceId?: string,
): Promise<void> {
  const sb = requireSupabase()
  await sb.from('notifications').insert({
    organization_id: orgId,
    user_id: userId,
    type,
    title,
    message,
    reference_type: referenceType,
    reference_id: referenceId,
  })
}

export async function listActivitiesDb(orgId: string, limit = 10): Promise<ActivityLog[]> {
  const sb = requireSupabase()
  const { data, error } = await sb
    .from('activity_logs')
    .select('*, profiles(full_name)')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) await handleSupabaseError(error)
  return (data || []).map((r) => {
    const row = r as Record<string, unknown>
    const profile = row.profiles as { full_name: string } | null
    return mapActivityLog(row, profile?.full_name)
  })
}

export async function listDocumentsDb(orgId: string): Promise<Document[]> {
  const sb = requireSupabase()
  const { data, error } = await sb
    .from('documents')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })
  if (error) await handleSupabaseError(error)
  return (data || []).map((r) => mapDocument(r as Record<string, unknown>))
}

export async function uploadDocumentDb(
  orgId: string,
  file: File,
  userId: string,
  meta: { caseId?: string; clientId?: string },
): Promise<Document> {
  const sb = requireSupabase()
  const path = `${orgId}/${Date.now()}-${file.name}`
  const { error: uploadError } = await sb.storage.from('documents').upload(path, file)
  if (uploadError) await handleSupabaseError(uploadError)

  const { data: row, error } = await sb
    .from('documents')
    .insert({
      organization_id: orgId,
      case_id: meta.caseId || null,
      client_id: meta.clientId || null,
      file_name: file.name,
      file_path: path,
      file_type: file.type,
      file_size: file.size,
      uploaded_by: userId,
    })
    .select()
    .single()
  if (error) await handleSupabaseError(error)
  return mapDocument(row as Record<string, unknown>)
}

export async function deleteDocumentDb(id: string, filePath: string): Promise<void> {
  const sb = requireSupabase()
  await sb.storage.from('documents').remove([filePath])
  const { error } = await sb.from('documents').delete().eq('id', id)
  if (error) await handleSupabaseError(error)
}

export async function getDocumentUrlDb(filePath: string): Promise<string> {
  const sb = requireSupabase()
  const { data, error } = await sb.storage.from('documents').createSignedUrl(filePath, 3600)
  if (error) await handleSupabaseError(error)
  if (!data?.signedUrl) throw new Error('URL do documento indisponível.')
  return data.signedUrl
}

export async function listTasksDb(orgId: string): Promise<Task[]> {
  const sb = requireSupabase()
  const { data, error } = await sb.from('tasks').select('*').eq('organization_id', orgId)
  if (error) await handleSupabaseError(error)
  return (data || []).map((r) => mapTask(r as Record<string, unknown>))
}

export async function createTaskDb(
  orgId: string,
  data: Omit<Task, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>,
): Promise<Task> {
  const sb = requireSupabase()
  const { data: row, error } = await sb
    .from('tasks')
    .insert({
      organization_id: orgId,
      case_id: data.caseId || null,
      client_id: data.clientId || null,
      title: data.title,
      description: data.description,
      due_date: data.dueDate || null,
      priority: data.priority,
      status: data.status,
      assigned_to: data.assignedTo || null,
    })
    .select()
    .single()
  if (error) await handleSupabaseError(error)
  return mapTask(row as Record<string, unknown>)
}

export async function updateTaskDb(id: string, data: Partial<Task>): Promise<Task> {
  const sb = requireSupabase()
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (data.title !== undefined) payload.title = data.title
  if (data.status !== undefined) payload.status = data.status
  if (data.dueDate !== undefined) payload.due_date = data.dueDate

  const { data: row, error } = await sb.from('tasks').update(payload).eq('id', id).select().single()
  if (error) await handleSupabaseError(error)
  return mapTask(row as Record<string, unknown>)
}

export async function getOrganizationSettingsDb(orgId: string): Promise<OrganizationSettings | null> {
  const sb = requireSupabase()
  const { data, error } = await sb
    .from('organization_settings')
    .select('*')
    .eq('organization_id', orgId)
    .maybeSingle()
  if (error) await handleSupabaseError(error)
  return data ? mapOrganizationSettings(data as Record<string, unknown>) : null
}

export async function listOrganizationMembersDb(orgId: string) {
  const sb = requireSupabase()
  const { data, error } = await sb
    .from('organization_members')
    .select('*, profiles(*)')
    .eq('organization_id', orgId)
  if (error) await handleSupabaseError(error)
  return data || []
}

export async function getAgendaEventsDb(orgId: string): Promise<AgendaEvent[]> {
  const deadlines = await listDeadlinesDb(orgId)
  const tasks = await listTasksDb(orgId)
  const events: AgendaEvent[] = []

  deadlines
    .filter((d) => d.status !== 'cancelado')
    .forEach((d) => {
      events.push({
        id: `deadline-${d.id}`,
        type: 'prazo',
        title: d.title,
        date: d.deadlineDate,
        priority: d.priority,
        status: d.status,
        clientName: d.clientName,
        caseNumber: d.caseNumber,
        referenceId: d.id,
      })
    })

  tasks
    .filter((t) => t.dueDate)
    .forEach((t) => {
      events.push({
        id: `task-${t.id}`,
        type: 'tarefa',
        title: t.title,
        date: t.dueDate!,
        priority: t.priority,
        status: t.status,
        referenceId: t.id,
      })
    })

  return events.sort((a, b) => a.date.localeCompare(b.date))
}

export async function getDashboardStatsDb(orgId: string) {
  const sb = requireSupabase()
  const deadlineStats = await import('./deadlines').then((m) => m.getDashboardDeadlineStatsDb(orgId))

  const { count: processosAtivos } = await sb
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', orgId)
    .eq('status', 'ativo')

  const { count: publicacoesNaoRevisadas } = await sb
    .from('publications')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', orgId)
    .in('status', ['aguardando', 'analisada'])

  const { count: tarefasPendentes } = await sb
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', orgId)
    .in('status', ['pendente', 'em_andamento'])

  return {
    ...deadlineStats,
    processosAtivos: processosAtivos || 0,
    publicacoesNaoRevisadas: publicacoesNaoRevisadas || 0,
    tarefasPendentes: tarefasPendentes || 0,
  }
}
