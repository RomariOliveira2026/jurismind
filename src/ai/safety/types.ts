export type EvidenceSourceType =
  | 'publicacao'
  | 'documento'
  | 'processo'
  | 'prazo'
  | 'tarefa'
  | 'usuario'
  | 'regra_interna'
  | 'inferencia'

export type EvidenceType = 'fato' | 'interpretacao' | 'sugestao' | 'incerteza'

export type ReviewStatus = 'nao_revisado' | 'confirmado' | 'rejeitado'

export type AIRiskLevel = 'baixo' | 'medio' | 'alto' | 'critico'

export type AIRequestStatus =
  | 'pending'
  | 'preparing'
  | 'analyzing'
  | 'validating'
  | 'completed'
  | 'low_confidence'
  | 'awaiting_review'
  | 'approved'
  | 'rejected'
  | 'error'
  | 'rate_limited'
  | 'unavailable'

export interface PossibleDeadline {
  value: string | null
  unit: string | null
  type: string | null
  startingPoint: string | null
  warnings: string[]
}

export interface EvidenceItem {
  id: string
  claim: string
  sourceType: EvidenceSourceType
  sourceId?: string
  sourceExcerpt?: string
  evidenceType: EvidenceType
  confidenceScore: number
  reviewStatus: ReviewStatus
}

export interface SafeAIStructuredOutput {
  summary: string
  documentType: string
  processNumber: string | null
  court: string | null
  parties: string[]
  facts: string[]
  interpretations: string[]
  suggestedActions: string[]
  possibleDeadline: PossibleDeadline
  evidence: EvidenceItem[]
  uncertainties: string[]
  confidenceScore: number
  riskLevel: AIRiskLevel
  warnings: string[]
}

export interface AIRequestContext {
  organizationId: string
  userId: string
  assistantId: string
  assistantSlug: string
  contextType: 'publicacao' | 'processo' | 'documento' | 'contrato' | 'audiencia' | 'rascunho' | 'gestao' | 'geral'
  contextId?: string
  actionType: string
  inputText: string
  sources?: string[]
  isDemo: boolean
}

export interface AIResponseRecord {
  id: string
  requestId: string
  organizationId: string
  provider: string
  model: string
  promptVersion: string
  assistantId: string
  assistantVersion: string
  structuredOutput: SafeAIStructuredOutput
  responseText: string
  confidenceScore: number
  riskLevel: AIRiskLevel
  warnings: string[]
  status: AIRequestStatus
  createdAt: string
  demoMode: boolean
}

export interface ValidationChecklistItem {
  id: string
  label: string
  required: boolean
}

export const DEFAULT_VALIDATION_CHECKLIST: ValidationChecklistItem[] = [
  { id: 'processo', label: 'Conferi o número do processo', required: true },
  { id: 'partes', label: 'Conferi as partes envolvidas', required: true },
  { id: 'datas', label: 'Conferi datas e termo inicial', required: true },
  { id: 'contagem', label: 'Conferi a regra de contagem aplicável', required: true },
  { id: 'legislacao', label: 'Conferi legislação e referências mencionadas', required: false },
  { id: 'revisao', label: 'Revisei integralmente o conteúdo', required: true },
  { id: 'apoio', label: 'Estou ciente de que a IA é apenas ferramenta de apoio', required: true },
]

export type FeedbackType = 'util' | 'parcial' | 'incorreta' | 'perigosa' | 'incompleta'
