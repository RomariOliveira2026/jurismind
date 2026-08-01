import type { Case } from '../types/entities'
import { env } from '../config/env'
import { generateId } from '../lib/helpers'
import { getDemoStore, persistDemoStore, logActivity } from './demo/demoStore'
import { listCasesDb, getCaseDb, createCaseDb, updateCaseDb } from './supabase/cases'
import { logActivityDb } from './supabase/auth'

export interface CaseFilters {
  search?: string
  status?: string
  court?: string
  phase?: string
  practiceArea?: string
  responsibleUserId?: string
}

export async function listCases(orgId: string, filters?: CaseFilters): Promise<Case[]> {
  if (env.demoMode) {
    let items = getDemoStore().cases.filter((c) => c.organizationId === orgId)
    if (filters?.status) items = items.filter((c) => c.status === filters.status)
    if (filters?.court) items = items.filter((c) => c.court === filters.court)
    if (filters?.phase) items = items.filter((c) => c.phase === filters.phase)
    if (filters?.practiceArea) items = items.filter((c) => c.practiceArea === filters.practiceArea)
    if (filters?.responsibleUserId) items = items.filter((c) => c.responsibleUserId === filters.responsibleUserId)
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      items = items.filter(
        (c) =>
          c.caseNumber.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          (c.clientName?.toLowerCase().includes(q) ?? false),
      )
    }
    return items
  }
  return listCasesDb(orgId, filters)
}

export async function getCase(id: string): Promise<Case | null> {
  if (env.demoMode) return getDemoStore().cases.find((c) => c.id === id) ?? null
  return getCaseDb(id)
}

export async function createCase(
  orgId: string,
  data: Omit<Case, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>,
  userId: string,
  userName: string,
): Promise<Case> {
  if (env.demoMode) {
    const store = getDemoStore()
    const client = store.clients.find((c) => c.id === data.clientId)
    const caseItem: Case = {
      ...data,
      clientName: client?.name,
      id: generateId(),
      organizationId: orgId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    store.cases.unshift(caseItem)
    logActivity(store, userId, userName, 'criou', 'case', caseItem.id)
    persistDemoStore(store)
    return caseItem
  }
  const caseItem = await createCaseDb(orgId, data)
  await logActivityDb(orgId, userId, 'criou', 'case', caseItem.id, { userName })
  return caseItem
}

export async function updateCase(
  id: string,
  data: Partial<Case>,
  userId: string,
  userName: string,
  orgId?: string,
): Promise<Case> {
  if (env.demoMode) {
    const store = getDemoStore()
    const idx = store.cases.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error('Processo não encontrado')
    if (data.clientId) {
      const client = store.clients.find((c) => c.id === data.clientId)
      data.clientName = client?.name
    }
    store.cases[idx] = { ...store.cases[idx], ...data, updatedAt: new Date().toISOString() }
    logActivity(store, userId, userName, 'atualizou', 'case', id)
    persistDemoStore(store)
    return store.cases[idx]
  }
  const caseItem = await updateCaseDb(id, data)
  if (orgId) await logActivityDb(orgId, userId, 'atualizou', 'case', id, { userName })
  return caseItem
}

export async function archiveCase(id: string, userId: string, userName: string, orgId?: string): Promise<void> {
  await updateCase(id, { status: 'arquivado' }, userId, userName, orgId)
}
