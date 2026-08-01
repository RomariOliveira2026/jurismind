import { listClients } from './clientService'
import { listCases } from './caseService'
import { listDeadlines } from './deadlineService'
import { listPublications } from './publicationService'
import { listTasks, listDocuments, listActivities, getAgendaEvents } from './taskService'
import { listPendingAIReviews, listRejectedAIFeedback } from './ai/safeAIClient'
import {
  computeJurisMindIQ,
  computeHealthIndex,
  getCriticalProcesses,
  computeAllProcessRisks,
  generateInsights,
  generatePriorities,
  generateRecommendations,
  computeDaySummary,
  computeWeeklySummary,
  getIntelligenceWeights,
  buildTimeline,
  type IntelligenceData,
  type IntelligenceResult,
} from '../intelligence'

const MIN_DATA_POINTS = 3

export async function fetchIntelligenceData(orgId: string): Promise<IntelligenceData> {
  const [clients, cases, deadlines, publications, tasks, documents, activities, agenda] =
    await Promise.all([
      listClients(orgId),
      listCases(orgId),
      listDeadlines(orgId),
      listPublications(orgId),
      listTasks(orgId),
      listDocuments(orgId),
      listActivities(orgId, 50),
      getAgendaEvents(orgId),
    ])

  const today = new Date().toISOString().split('T')[0]
  const hearingsToday = agenda.filter((e) => e.type === 'audiencia' && e.date === today).length

  const totalPoints =
    clients.length + cases.length + deadlines.length + publications.length + tasks.length

  const aiSuggestedDeadlines = deadlines.filter(
    (d) => d.aiSuggested && d.status === 'pendente',
  ).length

  return {
    clients,
    cases,
    deadlines,
    publications,
    tasks,
    documents,
    activities,
    hearingsToday,
    isSimulated: totalPoints < MIN_DATA_POINTS,
    aiPendingReviews: listPendingAIReviews(orgId),
    aiRejectedFeedback: listRejectedAIFeedback(orgId),
    aiSuggestedDeadlines,
  }
}

export async function computeIntelligence(orgId: string): Promise<IntelligenceResult> {
  const data = await fetchIntelligenceData(orgId)
  const weights = getIntelligenceWeights()

  const iq = computeJurisMindIQ(data, weights)
  const health = computeHealthIndex(data, weights)
  const priorities = generatePriorities(data)
  const recommendations = generateRecommendations(data)
  const insights = generateInsights(data)
  const criticalProcesses = getCriticalProcesses(data, 10)
  const processRisks = computeAllProcessRisks(data)
  const daySummary = computeDaySummary(data)
  const weekly = computeWeeklySummary(data)

  return {
    iq,
    health,
    priorities,
    recommendations,
    insights,
    criticalProcesses,
    processRisks,
    daySummary,
    weekly,
    dataSource: data.isSimulated ? 'simulated' : 'real',
  }
}

export async function fetchTimeline(orgId: string, caseId?: string) {
  const data = await fetchIntelligenceData(orgId)
  return buildTimeline(data, caseId)
}
