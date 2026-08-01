import { todayISO, daysUntil } from '../lib/helpers'
import type { Case } from '../types/entities'
import type { IntelligenceData, ProcessRiskScore, RiskLevel } from './types'

function daysSince(date: string): number {
  const d = new Date(date)
  const now = new Date()
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
}

function levelFromScore(score: number): RiskLevel {
  if (score >= 76) return 'critico'
  if (score >= 51) return 'alto'
  if (score >= 26) return 'medio'
  return 'baixo'
}

export function computeProcessRisk(caseItem: Case, data: IntelligenceData): ProcessRiskScore {
  const factors: string[] = []
  let score = 0

  const idle = daysSince(caseItem.updatedAt)
  if (idle > 90) {
    score += 25
    factors.push(`Sem movimentação há ${idle} dias`)
  } else if (idle > 30) {
    score += 15
    factors.push(`Parado há ${idle} dias`)
  } else if (idle > 14) {
    score += 8
    factors.push(`Atualizado há ${idle} dias`)
  }

  const caseDeadlines = data.deadlines.filter(
    (d) => d.caseId === caseItem.id && d.status !== 'concluido' && d.status !== 'cancelado',
  )
  const overdueDl = caseDeadlines.filter((d) => d.status === 'vencido' || daysUntil(d.deadlineDate) < 0)
  if (overdueDl.length > 0) {
    score += 20
    factors.push(`${overdueDl.length} prazo(s) vencido(s)`)
  }
  if (caseDeadlines.length >= 3) {
    score += 10
    factors.push(`${caseDeadlines.length} prazos ativos`)
  }

  const pubs = data.publications.filter(
    (p) => p.caseId === caseItem.id && (p.status === 'aguardando' || p.status === 'analisada'),
  )
  if (pubs.length > 0) {
    score += 12
    factors.push(`${pubs.length} publicação(ões) pendente(s)`)
  }

  const tasks = data.tasks.filter(
    (t) => t.caseId === caseItem.id && (t.status === 'pendente' || t.status === 'em_andamento'),
  )
  if (tasks.length > 0) {
    score += 8
    factors.push(`${tasks.length} tarefa(s) pendente(s)`)
  }

  const docs = data.documents.filter((d) => d.caseId === caseItem.id)
  if (docs.length === 0 && caseItem.status === 'ativo') {
    score += 5
    factors.push('Sem documentos vinculados')
  }

  if (!caseItem.responsibleUserId) {
    score += 15
    factors.push('Sem responsável definido')
  }

  const nextDeadline = caseDeadlines
    .filter((d) => d.deadlineDate >= todayISO())
    .sort((a, b) => a.deadlineDate.localeCompare(b.deadlineDate))[0]

  if (nextDeadline && daysUntil(nextDeadline.deadlineDate) <= 3) {
    score += 10
    factors.push('Prazo crítico nos próximos 3 dias')
  }

  const finalScore = Math.min(100, score)

  return {
    caseId: caseItem.id,
    caseNumber: caseItem.caseNumber,
    clientName: caseItem.clientName,
    title: caseItem.title,
    score: finalScore,
    level: levelFromScore(finalScore),
    daysIdle: idle,
    nextDeadline: nextDeadline?.deadlineDate,
    factors,
  }
}

export function computeAllProcessRisks(data: IntelligenceData): ProcessRiskScore[] {
  return data.cases
    .filter((c) => c.status === 'ativo')
    .map((c) => computeProcessRisk(c, data))
    .sort((a, b) => b.score - a.score)
}

export function getCriticalProcesses(data: IntelligenceData, limit = 10): ProcessRiskScore[] {
  return computeAllProcessRisks(data).slice(0, limit)
}
