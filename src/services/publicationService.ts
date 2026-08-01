import type { Publication, PublicationAnalysis } from '../types/entities'
import { env } from '../config/env'
import { generateId } from '../lib/helpers'
import { analyzeLegalText, toPublicationAnalysis } from './ai'
import { getDemoStore, persistDemoStore, logActivity } from './demo/demoStore'
import {
  listPublicationsDb,
  getPublicationDb,
  createPublicationDb,
  updatePublicationDb,
  getPublicationAnalysisDb,
  savePublicationAnalysisDb,
  countUnreviewedPublicationsDb,
} from './supabase/publications'
import { logActivityDb } from './supabase/auth'

export async function listPublications(orgId: string): Promise<Publication[]> {
  if (env.demoMode) return getDemoStore().publications.filter((p) => p.organizationId === orgId)
  return listPublicationsDb(orgId)
}

export async function getPublication(id: string): Promise<Publication | null> {
  if (env.demoMode) return getDemoStore().publications.find((p) => p.id === id) ?? null
  return getPublicationDb(id)
}

export async function getPublicationAnalysis(publicationId: string): Promise<PublicationAnalysis | null> {
  if (env.demoMode)
    return getDemoStore().publicationAnalyses.find((a) => a.publicationId === publicationId) ?? null
  return getPublicationAnalysisDb(publicationId)
}

export async function createPublication(
  orgId: string,
  data: Omit<Publication, 'id' | 'organizationId' | 'createdAt' | 'updatedAt' | 'status'>,
  userId: string,
  userName: string,
): Promise<Publication> {
  if (env.demoMode) {
    const store = getDemoStore()
    const pub: Publication = {
      ...data,
      id: generateId(),
      organizationId: orgId,
      status: 'aguardando',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    store.publications.unshift(pub)
    logActivity(store, userId, userName, 'criou', 'publication', pub.id)
    persistDemoStore(store)
    return pub
  }
  const pub = await createPublicationDb(orgId, data)
  await logActivityDb(orgId, userId, 'criou', 'publication', pub.id, { userName })
  return pub
}

export async function analyzePublication(
  publicationId: string,
  userId: string,
  userName: string,
  orgId?: string,
): Promise<PublicationAnalysis> {
  if (env.demoMode) {
    const store = getDemoStore()
    const pub = store.publications.find((p) => p.id === publicationId)
    if (!pub) throw new Error('Publicação não encontrada')
    pub.status = 'analisando'
    persistDemoStore(store)

    const result = await analyzeLegalText({ text: pub.rawText, type: 'publicacao' })
    const analysis = toPublicationAnalysis(result, publicationId)
    store.publicationAnalyses = store.publicationAnalyses.filter((a) => a.publicationId !== publicationId)
    store.publicationAnalyses.push(analysis)
    pub.status = 'analisada'
    pub.updatedAt = new Date().toISOString()
    logActivity(store, userId, userName, 'analisou', 'publication', publicationId)
    persistDemoStore(store)
    return analysis
  }

  const pub = await getPublicationDb(publicationId)
  if (!pub) throw new Error('Publicação não encontrada')
  await updatePublicationDb(publicationId, { status: 'analisando' })

  const result = await analyzeLegalText({ text: pub.rawText, type: 'publicacao' })
  const analysis = toPublicationAnalysis(result, publicationId)
  const saved = await savePublicationAnalysisDb(analysis)
  await updatePublicationDb(publicationId, { status: 'analisada' })
  if (orgId) await logActivityDb(orgId, userId, 'analisou', 'publication', publicationId, { userName })
  return saved
}

export async function markPublicationReviewed(
  publicationId: string,
  userId: string,
  userName: string,
  orgId?: string,
): Promise<void> {
  if (env.demoMode) {
    const store = getDemoStore()
    const pub = store.publications.find((p) => p.id === publicationId)
    if (pub) {
      pub.status = 'revisada'
      pub.updatedAt = new Date().toISOString()
      const analysis = store.publicationAnalyses.find((a) => a.publicationId === publicationId)
      if (analysis) {
        analysis.reviewedBy = userId
        analysis.reviewedAt = new Date().toISOString()
      }
      logActivity(store, userId, userName, 'revisou', 'publication', publicationId)
      persistDemoStore(store)
    }
    return
  }

  await updatePublicationDb(publicationId, { status: 'revisada' })
  const analysis = await getPublicationAnalysisDb(publicationId)
  if (analysis) {
    await savePublicationAnalysisDb({
      ...analysis,
      reviewedBy: userId,
      reviewedAt: new Date().toISOString(),
    })
  }
  if (orgId) await logActivityDb(orgId, userId, 'revisou', 'publication', publicationId, { userName })
}

export async function countUnreviewedPublications(orgId: string): Promise<number> {
  if (env.demoMode)
    return getDemoStore().publications.filter(
      (p) => p.organizationId === orgId && (p.status === 'analisada' || p.status === 'aguardando'),
    ).length
  return countUnreviewedPublicationsDb(orgId)
}
