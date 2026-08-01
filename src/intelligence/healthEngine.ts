import type { HealthBand, HealthIndexResult, IntelligenceData } from './types'
import { computeJurisMindIQ } from './scoreEngine'
import type { IntelligenceWeights } from './types'

function bandFromScore(score: number): { band: HealthBand; label: string } {
  if (score <= 40) return { band: 'critico', label: 'Crítico' }
  if (score <= 70) return { band: 'atencao', label: 'Atenção' }
  if (score <= 90) return { band: 'bom', label: 'Bom' }
  return { band: 'excelente', label: 'Excelente' }
}

export function computeHealthIndex(data: IntelligenceData, weights: IntelligenceWeights): HealthIndexResult {
  const iq = computeJurisMindIQ(data, weights)
  const { band, label } = bandFromScore(iq.score)

  const indicators = iq.factors.map((f) => ({
    name: f.name,
    value: f.score,
    maxValue: 100,
    impact: f.reason,
  }))

  return {
    score: iq.score,
    band,
    label,
    indicators,
    ruleBased: true,
  }
}
