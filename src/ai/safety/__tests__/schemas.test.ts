import { describe, it, expect } from 'vitest'
import { isValidStructuredOutput, sanitizeStructuredOutput } from '../schemas'

const valid = {
  summary: 'Resumo',
  facts: ['fato'],
  interpretations: ['interp'],
  suggestedActions: ['ação'],
  evidence: [],
  uncertainties: [],
  confidenceScore: 80,
  riskLevel: 'medio',
  warnings: ['aviso'],
}

describe('schemas', () => {
  it('validates correct structured output', () => {
    expect(isValidStructuredOutput(valid)).toBe(true)
  })

  it('rejects invalid output', () => {
    expect(isValidStructuredOutput(null)).toBe(false)
    expect(isValidStructuredOutput({ summary: 1 })).toBe(false)
  })

  it('sanitizes partial output', () => {
    const out = sanitizeStructuredOutput({ summary: 'Teste', confidenceScore: 150, riskLevel: 'invalid' as never })
    expect(out.confidenceScore).toBe(100)
    expect(out.riskLevel).toBe('medio')
  })
})
