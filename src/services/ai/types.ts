import type { RiskLevel } from '../../types/entities'

export interface AILegalInput {
  text: string
  type: 'resumo' | 'publicacao' | 'providencia' | 'rascunho'
  caseNumber?: string
}

export interface AILegalResult {
  id: string
  type: AILegalInput['type']
  title: string
  content: string
  summary?: string
  detectedParties?: string
  suggestedDeadline?: string
  suggestedAction?: string
  riskLevel?: RiskLevel
  confidence?: number
  warnings: string[]
  disclaimer: string
  createdAt: string
}

export interface AIProvider {
  analyzePublication(text: string): Promise<AILegalResult>
  summarize(text: string): Promise<AILegalResult>
  suggestActions(text: string): Promise<AILegalResult>
  draftDocument(text: string, caseNumber?: string): Promise<AILegalResult>
}
