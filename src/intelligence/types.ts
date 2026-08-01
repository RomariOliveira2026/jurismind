import type { Case, Client, Deadline, Document, Publication, Task, ActivityLog } from '../types/entities'

export interface IntelligenceWeights {
  overdueDeadlines: number
  upcomingDeadlines: number
  unreviewedPublications: number
  overdueTasks: number
  casesWithoutResponsible: number
  pendingDocuments: number
  recentActivities: number
}

export const DEFAULT_INTELLIGENCE_WEIGHTS: IntelligenceWeights = {
  overdueDeadlines: 20,
  upcomingDeadlines: 20,
  unreviewedPublications: 15,
  overdueTasks: 15,
  casesWithoutResponsible: 10,
  pendingDocuments: 10,
  recentActivities: 10,
}

export interface IntelligenceData {
  clients: Client[]
  cases: Case[]
  deadlines: Deadline[]
  publications: Publication[]
  tasks: Task[]
  documents: Document[]
  activities: ActivityLog[]
  hearingsToday: number
  isSimulated: boolean
  aiPendingReviews?: number
  aiRejectedFeedback?: number
  aiSuggestedDeadlines?: number
}

export type IQFactorImpact = 'positive' | 'negative' | 'neutral'

export interface IQFactor {
  name: string
  weight: number
  score: number
  impact: IQFactorImpact
  reason: string
}

export interface JurisMindIQResult {
  score: number
  label: string
  factors: IQFactor[]
  increases: string[]
  decreases: string[]
  ruleBased: true
}

export type HealthBand = 'critico' | 'atencao' | 'bom' | 'excelente'

export interface HealthIndicator {
  name: string
  value: number
  maxValue: number
  impact: string
}

export interface HealthIndexResult {
  score: number
  band: HealthBand
  label: string
  indicators: HealthIndicator[]
  ruleBased: true
}

export type RiskLevel = 'baixo' | 'medio' | 'alto' | 'critico'

export interface ProcessRiskScore {
  caseId: string
  caseNumber: string
  clientName?: string
  title: string
  score: number
  level: RiskLevel
  daysIdle: number
  nextDeadline?: string
  factors: string[]
}

export type PriorityLevel = 'maxima' | 'atencao' | 'oportunidade'

export interface PriorityItem {
  id: string
  level: PriorityLevel
  title: string
  description: string
  actionLabel: string
  actionLink: string
  sortOrder: number
}

export interface InsightItem {
  id: string
  text: string
  type: 'warning' | 'info' | 'opportunity'
  ruleBased: true
}

export interface RecommendationItem {
  id: string
  text: string
  priority: number
  link?: string
}

export type TimelineEventType =
  | 'client'
  | 'case'
  | 'publication'
  | 'deadline'
  | 'document'
  | 'task'
  | 'activity'

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  date: string
  title: string
  description: string
  responsible?: string
  referenceId?: string
  link?: string
}

export interface DaySummary {
  deadlinesToday: number
  tasksToday: number
  hearings: number
  publications: number
  criticalCases: number
  clientsActive: number
  casesActive: number
  estimatedWorkMinutes: number
}

export interface WeeklyDayStat {
  label: string
  deadlines: number
  productivity: number
  newClients: number
  newCases: number
}

export interface WeeklySummary {
  days: WeeklyDayStat[]
  ruleBased: true
}

export interface IntelligenceResult {
  iq: JurisMindIQResult
  health: HealthIndexResult
  priorities: PriorityItem[]
  recommendations: RecommendationItem[]
  insights: InsightItem[]
  criticalProcesses: ProcessRiskScore[]
  processRisks: ProcessRiskScore[]
  daySummary: DaySummary
  weekly: WeeklySummary
  dataSource: 'real' | 'simulated'
}
