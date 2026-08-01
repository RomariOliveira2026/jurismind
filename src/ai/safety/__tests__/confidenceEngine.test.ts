import { describe, it, expect } from 'vitest'
import { computeConfidenceScore, confidenceBand } from '../confidenceEngine'

describe('confidenceEngine', () => {
  it('returns low score for short text without process number', () => {
    const result = computeConfidenceScore({ text: 'oi' })
    expect(result.score).toBeLessThan(40)
    expect(result.label).toBe('Confiança baixa')
  })

  it('increases score with process number and determination', () => {
    const text = 'Processo 0001234-56.2024.8.26.0100 — Intima-se a parte autora para manifestar-se no prazo de 15 dias. Publicado em 28/07/2026 no DJE.'
    const result = computeConfidenceScore({
      text,
      hasDates: true,
      hasClearDetermination: true,
      hasProcessContext: true,
    })
    expect(result.score).toBeGreaterThanOrEqual(70)
  })

  it('classifies confidence bands correctly', () => {
    expect(confidenceBand(25)).toBe('baixa')
    expect(confidenceBand(50)).toBe('moderada')
    expect(confidenceBand(75)).toBe('alta')
    expect(confidenceBand(95)).toBe('muito_alta')
  })
})
