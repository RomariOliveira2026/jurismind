import { sanitizeText } from '../../lib/helpers'

export interface ConfidenceInput {
  text: string
  processNumber?: string | null
  court?: string | null
  parties?: string[]
  hasDates?: boolean
  hasClearDetermination?: boolean
  ambiguousCount?: number
  hasProcessContext?: boolean
  hasRelatedDocuments?: boolean
}

export interface ConfidenceResult {
  score: number
  label: string
  factors: { name: string; impact: number; note: string }[]
}

const PROCESS_NUMBER_RE = /\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}/

export function computeConfidenceScore(input: ConfidenceInput): ConfidenceResult {
  const text = sanitizeText(input.text)
  const factors: ConfidenceResult['factors'] = []
  let score = 50

  if (text.length < 50) {
    score -= 20
    factors.push({ name: 'Texto curto', impact: -20, note: 'Conteúdo insuficiente para análise robusta' })
  } else if (text.length > 200) {
    score += 10
    factors.push({ name: 'Texto adequado', impact: 10, note: 'Volume de texto suficiente' })
  }

  const procNum = input.processNumber || (PROCESS_NUMBER_RE.test(text) ? text.match(PROCESS_NUMBER_RE)?.[0] : null)
  if (procNum) {
    score += 12
    factors.push({ name: 'Número do processo', impact: 12, note: 'Processo identificado' })
  } else {
    score -= 8
    factors.push({ name: 'Processo ausente', impact: -8, note: 'Número do processo não identificado' })
  }

  if (input.court || /tribunal|vara|comarca|tj|trf|stj|stf/i.test(text)) {
    score += 8
    factors.push({ name: 'Tribunal', impact: 8, note: 'Referência judicial presente' })
  }

  if (input.parties?.length || /autor|réu|requerente|requerido|exequente/i.test(text)) {
    score += 8
    factors.push({ name: 'Partes', impact: 8, note: 'Partes identificáveis' })
  }

  if (input.hasDates || /\d{2}\/\d{2}\/\d{4}/.test(text)) {
    score += 6
    factors.push({ name: 'Datas', impact: 6, note: 'Datas presentes no texto' })
  }

  if (input.hasClearDetermination || /intim|manifest|prazo|decisão|despacho/i.test(text)) {
    score += 10
    factors.push({ name: 'Determinação', impact: 10, note: 'Determinação identificável' })
  }

  const ambiguous = input.ambiguousCount ?? (text.match(/\?|incerto|não especificado|a definir/gi) || []).length
  if (ambiguous > 2) {
    score -= ambiguous * 3
    factors.push({ name: 'Ambiguidades', impact: -ambiguous * 3, note: `${ambiguous} ponto(s) ambíguo(s)` })
  }

  if (input.hasProcessContext) {
    score += 10
    factors.push({ name: 'Contexto do processo', impact: 10, note: 'Dados do processo disponíveis' })
  }

  if (input.hasRelatedDocuments) {
    score += 5
    factors.push({ name: 'Documentos', impact: 5, note: 'Documentos relacionados no contexto' })
  }

  const finalScore = Math.max(0, Math.min(100, Math.round(score)))
  let label = 'Confiança baixa'
  if (finalScore >= 90) label = 'Confiança muito alta'
  else if (finalScore >= 70) label = 'Confiança alta'
  else if (finalScore >= 40) label = 'Confiança moderada'

  return { score: finalScore, label, factors }
}

export function confidenceBand(score: number): 'baixa' | 'moderada' | 'alta' | 'muito_alta' {
  if (score >= 90) return 'muito_alta'
  if (score >= 70) return 'alta'
  if (score >= 40) return 'moderada'
  return 'baixa'
}
