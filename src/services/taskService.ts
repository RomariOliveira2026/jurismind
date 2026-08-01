import type { Task, Notification, Document, ActivityLog, AgendaEvent, OrganizationSettings } from '../types/entities'
import type { OrganizationMember } from '../types/auth'
import { env } from '../config/env'
import { generateId } from '../lib/helpers'
import { getDemoStore, persistDemoStore, logActivity } from './demo/demoStore'
import {
  listNotificationsDb,
  markNotificationReadDb,
  markAllNotificationsReadDb,
  deleteNotificationDb,
  countUnreadNotificationsDb,
  listActivitiesDb,
  listDocumentsDb,
  uploadDocumentDb,
  deleteDocumentDb,
  getDocumentUrlDb,
  listTasksDb,
  createTaskDb,
  updateTaskDb,
  getAgendaEventsDb,
  getDashboardStatsDb,
  getOrganizationSettingsDb,
  listOrganizationMembersDb,
} from './supabase/notifications'
import { logActivityDb } from './supabase/auth'
import { mapProfile } from './supabase/mappers'
import type { UserRole } from '../types/auth'

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export async function listTasks(orgId: string): Promise<Task[]> {
  if (env.demoMode) return getDemoStore().tasks.filter((t) => t.organizationId === orgId)
  return listTasksDb(orgId)
}

export async function createTask(
  orgId: string,
  data: Omit<Task, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>,
  userId: string,
  userName: string,
): Promise<Task> {
  if (env.demoMode) {
    const store = getDemoStore()
    const task: Task = {
      ...data,
      id: generateId(),
      organizationId: orgId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    store.tasks.unshift(task)
    logActivity(store, userId, userName, 'criou', 'task', task.id)
    persistDemoStore(store)
    return task
  }
  const task = await createTaskDb(orgId, data)
  await logActivityDb(orgId, userId, 'criou', 'task', task.id, { userName })
  return task
}

export async function updateTask(
  id: string,
  data: Partial<Task>,
  userId: string,
  userName: string,
  orgId?: string,
): Promise<Task> {
  if (env.demoMode) {
    const store = getDemoStore()
    const idx = store.tasks.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error('Tarefa não encontrada')
    store.tasks[idx] = { ...store.tasks[idx], ...data, updatedAt: new Date().toISOString() }
    logActivity(store, userId, userName, 'atualizou', 'task', id)
    persistDemoStore(store)
    return store.tasks[idx]
  }
  const task = await updateTaskDb(id, data)
  if (orgId) await logActivityDb(orgId, userId, 'atualizou', 'task', id, { userName })
  return task
}

export async function listNotifications(userId: string): Promise<Notification[]> {
  if (env.demoMode) return getDemoStore().notifications.filter((n) => n.userId === userId)
  return listNotificationsDb(userId)
}

export async function markNotificationRead(id: string): Promise<void> {
  if (env.demoMode) {
    const store = getDemoStore()
    const n = store.notifications.find((x) => x.id === id)
    if (n) {
      n.read = true
      persistDemoStore(store)
    }
    return
  }
  await markNotificationReadDb(id)
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  if (env.demoMode) {
    const store = getDemoStore()
    store.notifications.filter((n) => n.userId === userId).forEach((n) => (n.read = true))
    persistDemoStore(store)
    return
  }
  await markAllNotificationsReadDb(userId)
}

export async function deleteNotification(id: string): Promise<void> {
  if (env.demoMode) {
    const store = getDemoStore()
    store.notifications = store.notifications.filter((n) => n.id !== id)
    persistDemoStore(store)
    return
  }
  await deleteNotificationDb(id)
}

export async function countUnreadNotifications(userId: string): Promise<number> {
  if (env.demoMode) return getDemoStore().notifications.filter((n) => n.userId === userId && !n.read).length
  return countUnreadNotificationsDb(userId)
}

export async function listDocuments(orgId: string): Promise<Document[]> {
  if (env.demoMode) return getDemoStore().documents.filter((d) => d.organizationId === orgId)
  return listDocumentsDb(orgId)
}

export async function uploadDocument(
  orgId: string,
  input: File | Omit<Document, 'id' | 'organizationId' | 'createdAt'>,
  meta?: { userId: string; userName: string },
): Promise<Document> {
  if (env.demoMode) {
    const data = input as Omit<Document, 'id' | 'organizationId' | 'createdAt'>
    const store = getDemoStore()
    const doc: Document = {
      ...data,
      id: generateId(),
      organizationId: orgId,
      createdAt: new Date().toISOString(),
    }
    store.documents.unshift(doc)
    if (meta) logActivity(store, meta.userId, meta.userName, 'upload', 'document', doc.id)
    persistDemoStore(store)
    return doc
  }

  const file = input as File
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error('Formato não permitido.')
  if (file.size > 10 * 1024 * 1024) throw new Error('Arquivo muito grande. Máximo 10 MB.')
  if (!meta) throw new Error('Metadados do usuário são obrigatórios.')

  const doc = await uploadDocumentDb(orgId, file, meta.userId, {})
  await logActivityDb(orgId, meta.userId, 'upload', 'document', doc.id, { userName: meta.userName })
  return { ...doc, uploadedByName: meta.userName }
}

export async function deleteDocument(id: string, orgId?: string, userId?: string, userName?: string): Promise<void> {
  if (env.demoMode) {
    const store = getDemoStore()
    store.documents = store.documents.filter((d) => d.id !== id)
    persistDemoStore(store)
    return
  }
  const docs = await listDocumentsDb(orgId!)
  const doc = docs.find((d) => d.id === id)
  if (!doc) throw new Error('Documento não encontrado')
  await deleteDocumentDb(id, doc.filePath)
  if (orgId && userId) await logActivityDb(orgId, userId, 'excluiu', 'document', id, { userName })
}

export async function getDocumentDownloadUrl(filePath: string): Promise<string> {
  if (env.demoMode) return '#'
  return getDocumentUrlDb(filePath)
}

export async function listActivities(orgId: string, limit = 10): Promise<ActivityLog[]> {
  if (env.demoMode) return getDemoStore().activities.filter((a) => a.organizationId === orgId).slice(0, limit)
  return listActivitiesDb(orgId, limit)
}

export async function getAgendaEvents(orgId: string): Promise<AgendaEvent[]> {
  if (env.demoMode) {
    const store = getDemoStore()
    const events: AgendaEvent[] = []

    store.deadlines
      .filter((d) => d.organizationId === orgId && d.status !== 'cancelado')
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
          responsibleUserName: d.responsibleUserName,
          referenceId: d.id,
        })
      })

    store.tasks
      .filter((t) => t.organizationId === orgId && t.dueDate)
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
  return getAgendaEventsDb(orgId)
}

export async function getDashboardStats(orgId: string) {
  if (env.demoMode) {
    const store = getDemoStore()
    const { getDashboardDeadlineStats } = await import('./deadlineService')
    const { countUnreviewedPublications } = await import('./publicationService')
    const deadlineStats = await getDashboardDeadlineStats(orgId)
    return {
      ...deadlineStats,
      processosAtivos: store.cases.filter((c) => c.status === 'ativo').length,
      publicacoesNaoRevisadas: await countUnreviewedPublications(orgId),
      tarefasPendentes: store.tasks.filter((t) => t.status === 'pendente' || t.status === 'em_andamento').length,
    }
  }
  return getDashboardStatsDb(orgId)
}

export async function getOrganizationSettings(orgId: string): Promise<OrganizationSettings> {
  if (env.demoMode) return getDemoStore().settings
  const settings = await getOrganizationSettingsDb(orgId)
  if (!settings) {
    return {
      id: '',
      organizationId: orgId,
      deadlineAlertDays: 3,
      emailAlerts: true,
      whatsappAlerts: false,
      dailySummary: true,
      weeklySummary: true,
    }
  }
  return settings
}

export async function getOrganizationMembers(orgId: string): Promise<OrganizationMember[]> {
  if (env.demoMode) return getDemoStore().members

  const rows = await listOrganizationMembersDb(orgId)
  return rows.map((row) => {
    const r = row as Record<string, unknown>
    const profile = r.profiles as Record<string, unknown> | null
    return {
      id: String(r.id),
      organizationId: String(r.organization_id),
      userId: String(r.user_id),
      role: r.role as UserRole,
      joinedAt: String(r.joined_at),
      profile: profile ? mapProfile(profile) : undefined,
    }
  })
}
