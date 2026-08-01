import { requireSupabase, handleSupabaseError } from '../../lib/supabase'
import { mapPublication, mapPublicationAnalysis } from './mappers'
import type { Publication, PublicationAnalysis } from '../../types/entities'

export async function listPublicationsDb(orgId: string): Promise<Publication[]> {
  const sb = requireSupabase()
  const { data, error } = await sb
    .from('publications')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })
  if (error) await handleSupabaseError(error)
  return (data || []).map((r) => mapPublication(r as Record<string, unknown>))
}

export async function getPublicationDb(id: string): Promise<Publication | null> {
  const sb = requireSupabase()
  const { data, error } = await sb.from('publications').select('*').eq('id', id).maybeSingle()
  if (error) await handleSupabaseError(error)
  return data ? mapPublication(data as Record<string, unknown>) : null
}

export async function createPublicationDb(
  orgId: string,
  data: Omit<Publication, 'id' | 'organizationId' | 'createdAt' | 'updatedAt' | 'status'>,
): Promise<Publication> {
  const sb = requireSupabase()
  const { data: row, error } = await sb
    .from('publications')
    .insert({
      organization_id: orgId,
      case_id: data.caseId || null,
      client_id: data.clientId || null,
      publication_date: data.publicationDate,
      source: data.source,
      court: data.court,
      raw_text: data.rawText,
      status: 'aguardando',
    })
    .select()
    .single()
  if (error) await handleSupabaseError(error)
  return mapPublication(row as Record<string, unknown>)
}

export async function updatePublicationDb(id: string, data: Partial<Publication>): Promise<Publication> {
  const sb = requireSupabase()
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (data.status !== undefined) payload.status = data.status

  const { data: row, error } = await sb.from('publications').update(payload).eq('id', id).select().single()
  if (error) await handleSupabaseError(error)
  return mapPublication(row as Record<string, unknown>)
}

export async function getPublicationAnalysisDb(publicationId: string): Promise<PublicationAnalysis | null> {
  const sb = requireSupabase()
  const { data, error } = await sb
    .from('publication_analyses')
    .select('*')
    .eq('publication_id', publicationId)
    .maybeSingle()
  if (error) await handleSupabaseError(error)
  return data ? mapPublicationAnalysis(data as Record<string, unknown>) : null
}

export async function savePublicationAnalysisDb(
  analysis: Omit<PublicationAnalysis, 'id' | 'createdAt'> & { id?: string },
): Promise<PublicationAnalysis> {
  const sb = requireSupabase()
  const { data: row, error } = await sb
    .from('publication_analyses')
    .upsert({
      publication_id: analysis.publicationId,
      summary: analysis.summary,
      detected_parties: analysis.detectedParties,
      suggested_deadline: analysis.suggestedDeadline,
      suggested_action: analysis.suggestedAction,
      risk_level: analysis.riskLevel,
      confidence: analysis.confidence,
      warnings: analysis.warnings,
      reviewed_by: analysis.reviewedBy,
      reviewed_at: analysis.reviewedAt,
    })
    .select()
    .single()
  if (error) await handleSupabaseError(error)
  return mapPublicationAnalysis(row as Record<string, unknown>)
}

export async function countUnreviewedPublicationsDb(orgId: string): Promise<number> {
  const sb = requireSupabase()
  const { count, error } = await sb
    .from('publications')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', orgId)
    .in('status', ['aguardando', 'analisada'])
  if (error) await handleSupabaseError(error)
  return count || 0
}
