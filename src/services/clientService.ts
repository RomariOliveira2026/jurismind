import type { Client } from '../types/entities'
import { env } from '../config/env'
import { generateId } from '../lib/helpers'
import { getDemoStore, persistDemoStore, logActivity, DEMO_ORG_ID } from './demo/demoStore'
import {
  listClientsDb,
  getClientDb,
  createClientDb,
  updateClientDb,
  countClientCasesDb,
} from './supabase/clients'
import { logActivityDb } from './supabase/auth'

export interface ClientFilters {
  search?: string
  status?: string
  sort?: 'name' | 'created'
}

export async function listClients(orgId: string, filters?: ClientFilters): Promise<Client[]> {
  if (env.demoMode) {
    let items = getDemoStore().clients.filter((c) => c.organizationId === orgId)
    if (filters?.status) items = items.filter((c) => c.status === filters.status)
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      items = items.filter(
        (c) => c.name.toLowerCase().includes(q) || c.cpfCnpj.includes(q) || c.email.toLowerCase().includes(q),
      )
    }
    if (filters?.sort === 'created') items.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    else items.sort((a, b) => a.name.localeCompare(b.name))
    return items
  }
  return listClientsDb(orgId, filters)
}

export async function getClient(id: string): Promise<Client | null> {
  if (env.demoMode) return getDemoStore().clients.find((c) => c.id === id) ?? null
  return getClientDb(id)
}

export async function createClient(
  orgId: string,
  data: Omit<Client, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>,
  userId: string,
  userName: string,
): Promise<Client> {
  if (env.demoMode) {
    const store = getDemoStore()
    const client: Client = {
      ...data,
      id: generateId(),
      organizationId: orgId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    store.clients.unshift(client)
    logActivity(store, userId, userName, 'criou', 'client', client.id)
    persistDemoStore(store)
    return client
  }
  const client = await createClientDb(orgId, data)
  await logActivityDb(orgId, userId, 'criou', 'client', client.id, { userName })
  return client
}

export async function updateClient(
  id: string,
  data: Partial<Client>,
  userId: string,
  userName: string,
  orgId?: string,
): Promise<Client> {
  if (env.demoMode) {
    const store = getDemoStore()
    const idx = store.clients.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error('Cliente não encontrado')
    store.clients[idx] = { ...store.clients[idx], ...data, updatedAt: new Date().toISOString() }
    logActivity(store, userId, userName, 'atualizou', 'client', id)
    persistDemoStore(store)
    return store.clients[idx]
  }
  const client = await updateClientDb(id, data)
  if (orgId) await logActivityDb(orgId, userId, 'atualizou', 'client', id, { userName })
  return client
}

export async function archiveClient(id: string, userId: string, userName: string, orgId?: string): Promise<void> {
  await updateClient(id, { status: 'arquivado' }, userId, userName, orgId)
}

export async function restoreClient(id: string, userId: string, userName: string, orgId?: string): Promise<void> {
  await updateClient(id, { status: 'ativo' }, userId, userName, orgId)
}

export async function countClientCases(clientId: string): Promise<number> {
  if (env.demoMode) return getDemoStore().cases.filter((c) => c.clientId === clientId).length
  return countClientCasesDb(clientId)
}

export { DEMO_ORG_ID }
