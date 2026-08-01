import { todayISO, daysUntil } from '../lib/helpers'
import type { IntelligenceData, IntelligenceWeights, JurisMindIQResult, IQFactor } from './types'

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n))
}

function metricScore(ratio: number): number {
  return clamp(Math.round(100 - ratio * 100))
}

export function computeJurisMindIQ(data: IntelligenceData, weights: IntelligenceWeights): JurisMindIQResult {
  const today = todayISO()
  const weekEnd = new Date()
  weekEnd.setDate(weekEnd.getDate() + 7)
  const weekEndStr = weekEnd.toISOString().split('T')[0]

  const activeCases = data.cases.filter((c) => c.status === 'ativo')
  const activeDeadlines = data.deadlines.filter((d) => d.status !== 'concluido' && d.status !== 'cancelado')

  const overdue = activeDeadlines.filter((d) => d.status === 'vencido' || daysUntil(d.deadlineDate) < 0).length
  const upcoming = activeDeadlines.filter(
    (d) => d.deadlineDate >= today && d.deadlineDate <= weekEndStr,
  ).length
  const unreviewed = data.publications.filter((p) => p.status === 'aguardando' || p.status === 'analisada').length
  const overdueTasks = data.tasks.filter(
    (t) => (t.status === 'pendente' || t.status === 'em_andamento') && t.dueDate && t.dueDate < today,
  ).length
  const noResponsible = activeCases.filter((c) => !c.responsibleUserId).length
  const pendingDocs = data.documents.filter((d) => !d.caseId && !d.clientId).length
  const recentActs = data.activities.filter((a) => {
    const d = new Date(a.createdAt)
    const diff = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)
    return diff <= 7
  }).length

  const denominators = {
    overdue: Math.max(activeDeadlines.length, 1),
    upcoming: Math.max(activeDeadlines.length, 1),
    unreviewed: Math.max(data.publications.length, 1),
    overdueTasks: Math.max(data.tasks.length, 1),
    noResponsible: Math.max(activeCases.length, 1),
    pendingDocs: Math.max(data.documents.length, 1),
    recentActs: 10,
  }

  const factors: IQFactor[] = [
    {
      name: 'Prazos vencidos',
      weight: weights.overdueDeadlines,
      score: metricScore(overdue / denominators.overdue),
      impact: overdue > 0 ? 'negative' : 'positive',
      reason: overdue > 0 ? `${overdue} prazo(s) vencido(s)` : 'Nenhum prazo vencido',
    },
    {
      name: 'Prazos próximos',
      weight: weights.upcomingDeadlines,
      score: metricScore(upcoming / denominators.upcoming),
      impact: upcoming > 3 ? 'negative' : 'neutral',
      reason: `${upcoming} prazo(s) nos próximos 7 dias`,
    },
    {
      name: 'Publicações não revisadas',
      weight: weights.unreviewedPublications,
      score: metricScore(unreviewed / denominators.unreviewed),
      impact: unreviewed > 0 ? 'negative' : 'positive',
      reason: `${unreviewed} publicação(ões) pendente(s) de revisão`,
    },
    {
      name: 'Tarefas atrasadas',
      weight: weights.overdueTasks,
      score: metricScore(overdueTasks / denominators.overdueTasks),
      impact: overdueTasks > 0 ? 'negative' : 'positive',
      reason: overdueTasks > 0 ? `${overdueTasks} tarefa(s) atrasada(s)` : 'Tarefas em dia',
    },
    {
      name: 'Processos sem responsável',
      weight: weights.casesWithoutResponsible,
      score: metricScore(noResponsible / denominators.noResponsible),
      impact: noResponsible > 0 ? 'negative' : 'positive',
      reason: noResponsible > 0 ? `${noResponsible} processo(s) sem responsável` : 'Todos com responsável',
    },
    {
      name: 'Documentos pendentes',
      weight: weights.pendingDocuments,
      score: metricScore(pendingDocs / denominators.pendingDocs),
      impact: pendingDocs > 0 ? 'negative' : 'positive',
      reason: pendingDocs > 0 ? `${pendingDocs} documento(s) sem vínculo` : 'Documentos classificados',
    },
    {
      name: 'Atividades recentes',
      weight: weights.recentActivities,
      score: clamp(Math.round((recentActs / denominators.recentActs) * 100)),
      impact: recentActs >= 3 ? 'positive' : 'neutral',
      reason: `${recentActs} atividade(s) nos últimos 7 dias`,
    },
  ]

  const totalWeight = factors.reduce((s, f) => s + f.weight, 0) || 100
  const score = clamp(Math.round(factors.reduce((s, f) => s + f.score * (f.weight / totalWeight), 0)))

  const increases = factors.filter((f) => f.impact === 'positive').map((f) => f.reason)
  const decreases = factors.filter((f) => f.impact === 'negative').map((f) => f.reason)

  let label = 'Crítico'
  if (score >= 91) label = 'Excelente'
  else if (score >= 71) label = 'Bom'
  else if (score >= 41) label = 'Atenção'

  return { score, label, factors, increases, decreases, ruleBased: true }
}
