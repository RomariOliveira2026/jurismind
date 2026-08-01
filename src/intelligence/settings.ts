import type { IntelligenceWeights } from './types'
import { DEFAULT_INTELLIGENCE_WEIGHTS } from './types'

const STORAGE_KEY = 'jurismind-intelligence-weights'

export function getIntelligenceWeights(): IntelligenceWeights {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_INTELLIGENCE_WEIGHTS }
    const parsed = JSON.parse(raw) as IntelligenceWeights
    return normalizeWeights(parsed)
  } catch {
    return { ...DEFAULT_INTELLIGENCE_WEIGHTS }
  }
}

export function saveIntelligenceWeights(weights: IntelligenceWeights): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeWeights(weights)))
}

export function resetIntelligenceWeights(): void {
  localStorage.removeItem(STORAGE_KEY)
}

function normalizeWeights(w: IntelligenceWeights): IntelligenceWeights {
  const total =
    w.overdueDeadlines +
    w.upcomingDeadlines +
    w.unreviewedPublications +
    w.overdueTasks +
    w.casesWithoutResponsible +
    w.pendingDocuments +
    w.recentActivities

  if (total === 100) return w

  const factor = 100 / (total || 100)
  return {
    overdueDeadlines: Math.round(w.overdueDeadlines * factor),
    upcomingDeadlines: Math.round(w.upcomingDeadlines * factor),
    unreviewedPublications: Math.round(w.unreviewedPublications * factor),
    overdueTasks: Math.round(w.overdueTasks * factor),
    casesWithoutResponsible: Math.round(w.casesWithoutResponsible * factor),
    pendingDocuments: Math.round(w.pendingDocuments * factor),
    recentActivities: Math.round(w.recentActivities * factor),
  }
}

export const WEIGHT_LABELS: Record<keyof IntelligenceWeights, string> = {
  overdueDeadlines: 'Prazos vencidos',
  upcomingDeadlines: 'Prazos próximos',
  unreviewedPublications: 'Publicações não revisadas',
  overdueTasks: 'Tarefas atrasadas',
  casesWithoutResponsible: 'Processos sem responsável',
  pendingDocuments: 'Documentos pendentes',
  recentActivities: 'Atividades recentes',
}

export { DEFAULT_INTELLIGENCE_WEIGHTS }
