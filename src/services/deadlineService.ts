import type { Deadline, DeadlineStatus } from '../types/entities'
import { env } from '../config/env'
import { computeDeadlineStatus, generateId, todayISO } from '../lib/helpers'
import { getDemoStore, persistDemoStore, logActivity } from './demo/demoStore'
import {
  listDeadlinesDb,
  getDeadlineDb,
  createDeadlineDb,
  updateDeadlineDb,
  deleteDeadlineDb,
  getDashboardDeadlineStatsDb,
} from './supabase/deadlines'
import { logActivityDb } from './supabase/auth'

export interface DeadlineFilters {
  status?: string
  priority?: string
  caseId?: string
  clientId?: string
  responsibleUserId?: string
  from?: string
  to?: string
}

function enrichDeadline(d: Deadline): Deadline {
  const status = computeDeadlineStatus(d.deadlineDate, d.status) as DeadlineStatus
  return { ...d, status: status === 'vencido' && d.status !== 'concluido' && d.status !== 'cancelado' ? 'vencido' : d.status }
}

export async function listDeadlines(orgId: string, filters?: DeadlineFilters): Promise<Deadline[]> {
  if (env.demoMode) {
    let items = getDemoStore().deadlines
      .filter((d) => d.organizationId === orgId)
      .map(enrichDeadline)
    if (filters?.status) items = items.filter((d) => d.status === filters.status)
    if (filters?.priority) items = items.filter((d) => d.priority === filters.priority)
    if (filters?.caseId) items = items.filter((d) => d.caseId === filters.caseId)
    if (filters?.clientId) items = items.filter((d) => d.clientId === filters.clientId)
    if (filters?.responsibleUserId) items = items.filter((d) => d.responsibleUserId === filters.responsibleUserId)
    if (filters?.from) items = items.filter((d) => d.deadlineDate >= filters.from!)
    if (filters?.to) items = items.filter((d) => d.deadlineDate <= filters.to!)
    return items.sort((a, b) => a.deadlineDate.localeCompare(b.deadlineDate))
  }
  return listDeadlinesDb(orgId, filters)
}

export async function getDeadline(id: string): Promise<Deadline | null> {
  if (env.demoMode) {
    const d = getDemoStore().deadlines.find((x) => x.id === id)
    return d ? enrichDeadline(d) : null
  }
  return getDeadlineDb(id)
}

export async function createDeadline(
  orgId: string,
  data: Omit<Deadline, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>,
  userId: string,
  userName: string,
): Promise<Deadline> {
  if (env.demoMode) {
    const store = getDemoStore()
    const caseItem = data.caseId ? store.cases.find((c) => c.id === data.caseId) : undefined
    const client = data.clientId ? store.clients.find((c) => c.id === data.clientId) : undefined
    const deadline: Deadline = {
      ...data,
      caseNumber: caseItem?.caseNumber,
      clientName: client?.name ?? caseItem?.clientName,
      id: generateId(),
      organizationId: orgId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    store.deadlines.unshift(deadline)
    logActivity(store, userId, userName, 'criou', 'deadline', deadline.id)
    persistDemoStore(store)
    return enrichDeadline(deadline)
  }
  const deadline = await createDeadlineDb(orgId, data)
  await logActivityDb(orgId, userId, 'criou', 'deadline', deadline.id, { userName })
  return deadline
}

export async function updateDeadline(
  id: string,
  data: Partial<Deadline>,
  userId: string,
  userName: string,
  orgId?: string,
): Promise<Deadline> {
  if (env.demoMode) {
    const store = getDemoStore()
    const idx = store.deadlines.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error('Prazo não encontrado')
    store.deadlines[idx] = { ...store.deadlines[idx], ...data, updatedAt: new Date().toISOString() }
    logActivity(store, userId, userName, 'atualizou', 'deadline', id)
    persistDemoStore(store)
    return enrichDeadline(store.deadlines[idx])
  }
  const deadline = await updateDeadlineDb(id, data)
  if (orgId) await logActivityDb(orgId, userId, 'atualizou', 'deadline', id, { userName })
  return deadline
}

export async function completeDeadline(id: string, userId: string, userName: string, orgId?: string): Promise<Deadline> {
  return updateDeadline(id, { status: 'concluido', completedAt: new Date().toISOString() }, userId, userName, orgId)
}

export async function reopenDeadline(id: string, userId: string, userName: string, orgId?: string): Promise<Deadline> {
  return updateDeadline(id, { status: 'pendente', completedAt: undefined }, userId, userName, orgId)
}

export async function deleteDeadline(id: string, userId: string, userName: string, orgId?: string): Promise<void> {
  if (env.demoMode) {
    const store = getDemoStore()
    store.deadlines = store.deadlines.filter((d) => d.id !== id)
    logActivity(store, userId, userName, 'excluiu', 'deadline', id)
    persistDemoStore(store)
    return
  }
  await deleteDeadlineDb(id)
  if (orgId) await logActivityDb(orgId, userId, 'excluiu', 'deadline', id, { userName })
}

export async function getDashboardDeadlineStats(orgId: string) {
  if (env.demoMode) {
    const deadlines = await listDeadlines(orgId)
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
  return getDashboardDeadlineStatsDb(orgId)
}
