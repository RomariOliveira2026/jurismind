import { todayISO } from '../lib/helpers'
import type { IntelligenceData, InsightItem } from './types'

export function generateInsights(data: IntelligenceData): InsightItem[] {
  const insights: InsightItem[] = []
  let id = 0
  const nextId = () => `insight-${++id}`

  const idleCases = data.cases.filter((c) => {
    const d = new Date(c.updatedAt)
    return c.status === 'ativo' && (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24) > 90
  })
  if (idleCases.length > 0) {
    insights.push({
      id: nextId(),
      text: `Você possui ${idleCases.length} processo(s) sem movimentação há mais de 90 dias.`,
      type: 'warning',
      ruleBased: true,
    })
  }

  const noRespDeadlines = data.deadlines.filter(
    (d) =>
      !d.responsibleUserId &&
      d.status !== 'concluido' &&
      d.status !== 'cancelado',
  )
  if (noRespDeadlines.length > 0) {
    insights.push({
      id: nextId(),
      text: `Existem ${noRespDeadlines.length} prazo(s) sem responsável definido.`,
      type: 'warning',
      ruleBased: true,
    })
  }

  const highRiskTasks = data.tasks.filter(
    (t) =>
      t.priority === 'critica' &&
      (t.status === 'pendente' || t.status === 'em_andamento'),
  )
  if (highRiskTasks.length > 0) {
    insights.push({
      id: nextId(),
      text: `Há ${highRiskTasks.length} tarefa(s) crítica(s) vinculada(s) a processos ativos.`,
      type: 'warning',
      ruleBased: true,
    })
  }

  const clientCaseCount = new Map<string, { name: string; count: number }>()
  data.cases
    .filter((c) => c.status === 'ativo' && c.clientId)
    .forEach((c) => {
      const cur = clientCaseCount.get(c.clientId) || { name: c.clientName || 'Cliente', count: 0 }
      clientCaseCount.set(c.clientId, { name: cur.name, count: cur.count + 1 })
    })
  const similarClients = [...clientCaseCount.values()].filter((v) => v.count >= 3)
  similarClients.slice(0, 2).forEach((v) => {
    insights.push({
      id: nextId(),
      text: `Cliente ${v.name} possui ${v.count} processos ativos — considere consolidar a gestão.`,
      type: 'info',
      ruleBased: true,
    })
  })

  const unclassified = data.documents.filter((d) => !d.caseId && !d.clientId)
  if (unclassified.length > 0) {
    insights.push({
      id: nextId(),
      text: `Existem ${unclassified.length} documento(s) ainda não classificados.`,
      type: 'opportunity',
      ruleBased: true,
    })
  }

  const today = todayISO()
  const todayDeadlines = data.deadlines.filter(
    (d) => d.deadlineDate === today && d.status !== 'concluido',
  )
  if (todayDeadlines.length > 0) {
    insights.push({
      id: nextId(),
      text: `${todayDeadlines.length} prazo(s) vence(m) hoje — priorize a resolução.`,
      type: 'warning',
      ruleBased: true,
    })
  }

  const unreviewed = data.publications.filter((p) => p.status === 'aguardando' || p.status === 'analisada')
  if (unreviewed.length > 0) {
    insights.push({
      id: nextId(),
      text: `${unreviewed.length} publicação(ões) aguardam revisão.`,
      type: 'info',
      ruleBased: true,
    })
  }

  if (insights.length === 0) {
    insights.push({
      id: nextId(),
      text: 'Nenhum alerta relevante no momento. Continue monitorando prazos e publicações.',
      type: 'info',
      ruleBased: true,
    })
  }

  if (data.isSimulated) {
    insights.push({
      id: nextId(),
      text: 'Dados insuficientes para análise completa — exibindo insights baseados em regras.',
      type: 'info',
      ruleBased: true,
    })
  }

  return insights.slice(0, 8)
}
