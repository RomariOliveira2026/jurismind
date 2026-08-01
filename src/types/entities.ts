export type ClientType = 'pf' | 'pj'
export type ClientStatus = 'ativo' | 'arquivado'
export type CaseStatus = 'ativo' | 'suspenso' | 'arquivado' | 'encerrado'
export type CasePhase = 'inicial' | 'instrucao' | 'recursal' | 'execucao' | 'arquivado'
export type DeadlineStatus = 'pendente' | 'em_andamento' | 'concluido' | 'vencido' | 'cancelado'
export type DeadlinePriority = 'baixa' | 'media' | 'alta' | 'critica'
export type PublicationStatus = 'aguardando' | 'analisando' | 'analisada' | 'revisada' | 'erro'
export type TaskStatus = 'pendente' | 'em_andamento' | 'concluida' | 'cancelada'
export type RiskLevel = 'baixo' | 'medio' | 'alto'
export type NotificationType =
  | 'prazo_proximo'
  | 'prazo_vencido'
  | 'publicacao_analisada'
  | 'tarefa_atribuida'
  | 'processo_atualizado'

export interface Client {
  id: string
  organizationId: string
  name: string
  type: ClientType
  cpfCnpj: string
  email: string
  phone: string
  address?: string
  notes: string
  status: ClientStatus
  createdAt: string
  updatedAt: string
}

export interface Case {
  id: string
  organizationId: string
  clientId: string
  clientName?: string
  caseNumber: string
  title: string
  court: string
  jurisdiction: string
  district: string
  practiceArea: string
  caseType: string
  opposingParty?: string
  responsibleUserId?: string
  responsibleUserName?: string
  status: CaseStatus
  phase: CasePhase
  estimatedValue?: number
  notes: string
  createdAt: string
  updatedAt: string
}

export interface Deadline {
  id: string
  organizationId: string
  caseId?: string
  caseNumber?: string
  clientId?: string
  clientName?: string
  title: string
  description: string
  deadlineDate: string
  internalDate?: string
  priority: DeadlinePriority
  status: DeadlineStatus
  responsibleUserId?: string
  responsibleUserName?: string
  source: 'manual' | 'ia' | 'publicacao'
  aiSuggested?: boolean
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface Publication {
  id: string
  organizationId: string
  caseId?: string
  clientId?: string
  publicationDate: string
  source: string
  court: string
  rawText: string
  status: PublicationStatus
  createdAt: string
  updatedAt: string
}

export interface PublicationAnalysis {
  id: string
  publicationId: string
  summary: string
  detectedParties: string
  suggestedDeadline?: string
  suggestedAction: string
  riskLevel: RiskLevel
  confidence: number
  warnings: string[]
  possibleIntimation?: boolean
  possibleStartTerm?: string
  identifiedCaseNumber?: string
  reviewedBy?: string
  reviewedAt?: string
  createdAt: string
}

export interface Task {
  id: string
  organizationId: string
  caseId?: string
  clientId?: string
  title: string
  description: string
  dueDate?: string
  priority: DeadlinePriority
  status: TaskStatus
  assignedTo?: string
  assignedToName?: string
  createdAt: string
  updatedAt: string
}

export interface Document {
  id: string
  organizationId: string
  caseId?: string
  clientId?: string
  fileName: string
  filePath: string
  fileType: string
  fileSize: number
  uploadedBy: string
  uploadedByName?: string
  createdAt: string
}

export interface Notification {
  id: string
  organizationId: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  referenceType?: string
  referenceId?: string
  createdAt: string
}

export interface ActivityLog {
  id: string
  organizationId: string
  userId: string
  userName?: string
  action: string
  entityType: string
  entityId: string
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface OrganizationSettings {
  id: string
  organizationId: string
  deadlineAlertDays: number
  emailAlerts: boolean
  whatsappAlerts: boolean
  dailySummary: boolean
  weeklySummary: boolean
}

export interface AgendaEvent {
  id: string
  type: 'prazo' | 'audiencia' | 'reuniao' | 'tarefa'
  title: string
  date: string
  time?: string
  priority?: DeadlinePriority
  status?: string
  clientName?: string
  caseNumber?: string
  responsibleUserName?: string
  referenceId: string
}
