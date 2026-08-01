import type { SafeAIStructuredOutput, AIRiskLevel } from './types'

const RISK_LEVELS: AIRiskLevel[] = ['baixo', 'medio', 'alto', 'critico']

export function isValidStructuredOutput(data: unknown): data is SafeAIStructuredOutput {
  if (!data || typeof data !== 'object') return false
  const o = data as Record<string, unknown>
  return (
    typeof o.summary === 'string' &&
    Array.isArray(o.facts) &&
    Array.isArray(o.interpretations) &&
    Array.isArray(o.suggestedActions) &&
    Array.isArray(o.evidence) &&
    Array.isArray(o.uncertainties) &&
    typeof o.confidenceScore === 'number' &&
    RISK_LEVELS.includes(o.riskLevel as AIRiskLevel) &&
    Array.isArray(o.warnings)
  )
}

export function createEmptyOutput(): SafeAIStructuredOutput {
  return {
    summary: '',
    documentType: '',
    processNumber: null,
    court: null,
    parties: [],
    facts: [],
    interpretations: [],
    suggestedActions: [],
    possibleDeadline: { value: null, unit: null, type: null, startingPoint: null, warnings: [] },
    evidence: [],
    uncertainties: [],
    confidenceScore: 0,
    riskLevel: 'medio',
    warnings: [],
  }
}

export function sanitizeStructuredOutput(raw: Partial<SafeAIStructuredOutput>): SafeAIStructuredOutput {
  const base = createEmptyOutput()
  return {
    ...base,
    ...raw,
    summary: String(raw.summary || ''),
    documentType: String(raw.documentType || ''),
    processNumber: raw.processNumber ? String(raw.processNumber) : null,
    court: raw.court ? String(raw.court) : null,
    parties: Array.isArray(raw.parties) ? raw.parties.map(String) : [],
    facts: Array.isArray(raw.facts) ? raw.facts.map(String) : [],
    interpretations: Array.isArray(raw.interpretations) ? raw.interpretations.map(String) : [],
    suggestedActions: Array.isArray(raw.suggestedActions) ? raw.suggestedActions.map(String) : [],
    uncertainties: Array.isArray(raw.uncertainties) ? raw.uncertainties.map(String) : [],
    confidenceScore: Math.max(0, Math.min(100, Number(raw.confidenceScore) || 0)),
    riskLevel: RISK_LEVELS.includes(raw.riskLevel as AIRiskLevel) ? (raw.riskLevel as AIRiskLevel) : 'medio',
    warnings: Array.isArray(raw.warnings) ? raw.warnings.map(String) : [],
    possibleDeadline: {
      value: raw.possibleDeadline?.value ?? null,
      unit: raw.possibleDeadline?.unit ?? null,
      type: raw.possibleDeadline?.type ?? null,
      startingPoint: raw.possibleDeadline?.startingPoint ?? null,
      warnings: raw.possibleDeadline?.warnings ?? [],
    },
    evidence: Array.isArray(raw.evidence) ? raw.evidence : [],
  }
}
