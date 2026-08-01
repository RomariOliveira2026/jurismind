import { requireSupabase, handleSupabaseError } from '../../lib/supabase'
import { mapClient } from './mappers'
import type { Client } from '../../types/entities'
import type { ClientFilters } from '../clientService'

export async function listClientsDb(orgId: string, filters?: ClientFilters): Promise<Client[]> {
  const sb = requireSupabase()
  let query = sb.from('clients').select('*').eq('organization_id', orgId)

  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.search) {
    const q = `%${filters.search}%`
    query = query.or(`name.ilike.${q},cpf_cnpj.ilike.${q},email.ilike.${q}`)
  }

  const sortCol = filters?.sort === 'created' ? 'created_at' : 'name'
  query = query.order(sortCol, { ascending: filters?.sort !== 'created' })

  const { data, error } = await query
  if (error) await handleSupabaseError(error)
  return (data || []).map((r) => mapClient(r as Record<string, unknown>))
}

export async function getClientDb(id: string): Promise<Client | null> {
  const sb = requireSupabase()
  const { data, error } = await sb.from('clients').select('*').eq('id', id).maybeSingle()
  if (error) await handleSupabaseError(error)
  return data ? mapClient(data as Record<string, unknown>) : null
}

export async function createClientDb(
  orgId: string,
  data: Omit<Client, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>,
): Promise<Client> {
  const sb = requireSupabase()
  const { data: row, error } = await sb
    .from('clients')
    .insert({
      organization_id: orgId,
      name: data.name,
      type: data.type,
      cpf_cnpj: data.cpfCnpj,
      email: data.email,
      phone: data.phone,
      address: data.address,
      notes: data.notes,
      status: data.status,
    })
    .select()
    .single()
  if (error) await handleSupabaseError(error)
  return mapClient(row as Record<string, unknown>)
}

export async function updateClientDb(id: string, data: Partial<Client>): Promise<Client> {
  const sb = requireSupabase()
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (data.name !== undefined) payload.name = data.name
  if (data.type !== undefined) payload.type = data.type
  if (data.cpfCnpj !== undefined) payload.cpf_cnpj = data.cpfCnpj
  if (data.email !== undefined) payload.email = data.email
  if (data.phone !== undefined) payload.phone = data.phone
  if (data.address !== undefined) payload.address = data.address
  if (data.notes !== undefined) payload.notes = data.notes
  if (data.status !== undefined) payload.status = data.status

  const { data: row, error } = await sb.from('clients').update(payload).eq('id', id).select().single()
  if (error) await handleSupabaseError(error)
  return mapClient(row as Record<string, unknown>)
}

export async function countClientCasesDb(clientId: string): Promise<number> {
  const sb = requireSupabase()
  const { count, error } = await sb
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', clientId)
  if (error) await handleSupabaseError(error)
  return count || 0
}
