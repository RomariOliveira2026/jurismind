import { todayISO, daysUntil } from '../lib/helpers'
import type { IntelligenceData, PriorityItem, PriorityLevel, RecommendationItem } from './types'
import { getCriticalProcesses } from './riskEngine'

const LEVEL_ORDER: Record<PriorityLevel, number> = {
  maxima: 0,
  atencao: 1,
  oportunidade: 2,
}

export function generatePriorities(data: IntelligenceData): PriorityItem[] {
  const items: PriorityItem[] = []
  const today = todayISO()

  data.deadlines
    .filter((d) => d.deadlineDate === today && d.status !== 'concluido' && d.status !== 'cancelado')
    .slice(0, 2)
    .forEach((d) => {
      items.push({
        id: `prio-dl-${d.id}`,
        level: 'maxima',
        title: 'PRIORIDADE MÁXIMA',
        description: `Prazo "${d.title}" vence hoje${d.caseNumber ? ` — Processo ${d.caseNumber}` : ''}.`,
        actionLabel: d.caseId ? 'Abrir Processo' : 'Ver Prazos',
        actionLink: d.caseId ? `/app/processos/${d.caseId}` : '/app/prazos',
        sortOrder: 0,
      })
    })

  data.deadlines
    .filter((d) => d.status === 'vencido')
    .slice(0, 2)
    .forEach((d) => {
      items.push({
        id: `prio-over-${d.id}`,
        level: 'maxima',
        title: 'PRIORIDADE MÁXIMA',
        description: `Prazo vencido: ${d.title}${d.caseNumber ? ` (${d.caseNumber})` : ''}.`,
        actionLabel: 'Abrir Processo',
        actionLink: d.caseId ? `/app/processos/${d.caseId}` : '/app/prazos',
        sortOrder: 1,
      })
    })

  data.publications
    .filter((p) => p.status === 'aguardando' || p.status === 'analisada')
    .slice(0, 2)
    .forEach((p) => {
      items.push({
        id: `prio-pub-${p.id}`,
        level: 'atencao',
        title: 'ATENÇÃO',
        description: 'Nova publicação encontrada — revisão pendente.',
        actionLabel: 'Ver Publicação',
        actionLink: '/app/publicacoes',
        sortOrder: 2,
      })
    })

  const critical = getCriticalProcesses(data, 3)
  critical.forEach((c) => {
    if (c.score >= 50) {
      items.push({
        id: `prio-case-${c.caseId}`,
        level: 'atencao',
        title: 'ATENÇÃO',
        description: `Processo ${c.caseNumber} com risco ${c.level} (score ${c.score}).`,
        actionLabel: 'Abrir Processo',
        actionLink: `/app/processos/${c.caseId}`,
        sortOrder: 3,
      })
    }
  })

  const unlinkedDocs = data.documents.filter((d) => !d.caseId && !d.clientId)
  if (unlinkedDocs.length > 0) {
    items.push({
      id: 'prio-docs',
      level: 'oportunidade',
      title: 'OPORTUNIDADE',
      description: `${unlinkedDocs.length} documento(s) pendente(s) de classificação.`,
      actionLabel: 'Ver Documentos',
      actionLink: '/app/documentos',
      sortOrder: 4,
    })
  }

  const noResp = data.cases.filter((c) => c.status === 'ativo' && !c.responsibleUserId)
  if (noResp.length > 0) {
    items.push({
      id: 'prio-resp',
      level: 'oportunidade',
      title: 'OPORTUNIDADE',
      description: `${noResp.length} processo(s) sem responsável — delegue para melhorar o IQ.`,
      actionLabel: 'Ver Processos',
      actionLink: '/app/processos',
      sortOrder: 5,
    })
  }

  const pendingAI = data.aiPendingReviews ?? 0
  if (pendingAI > 0) {
    items.push({
      id: 'prio-ai-review',
      level: 'atencao',
      title: 'ATENÇÃO',
      description: `Há ${pendingAI} análise(s) de publicações aguardando validação.`,
      actionLabel: 'Revisar análises',
      actionLink: '/app/assistentes/publicacoes',
      sortOrder: 2,
    })
  }

  const suggestedDl = data.aiSuggestedDeadlines ?? 0
  if (suggestedDl > 0) {
    items.push({
      id: 'prio-ai-deadline',
      level: 'atencao',
      title: 'ATENÇÃO',
      description: `Existe${suggestedDl > 1 ? 'm' : ''} ${suggestedDl} prazo(s) sugerido(s) pela IA que ainda não foi confirmado.`,
      actionLabel: 'Ver Prazos',
      actionLink: '/app/prazos',
      sortOrder: 2,
    })
  }

  const rejectedAI = data.aiRejectedFeedback ?? 0
  if (rejectedAI > 0) {
    items.push({
      id: 'prio-ai-rejected',
      level: 'maxima',
      title: 'PRIORIDADE MÁXIMA',
      description: 'Uma resposta foi marcada como incorreta e precisa de revisão.',
      actionLabel: 'Governança IA',
      actionLink: '/app/configuracoes/ia',
      sortOrder: 1,
    })
  }

  return items
    .sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] || a.sortOrder - b.sortOrder)
    .slice(0, 5)
}

export function generateRecommendations(data: IntelligenceData): RecommendationItem[] {
  const recs: RecommendationItem[] = []
  let priority = 100

  getCriticalProcesses(data, 5).forEach((c) => {
    recs.push({
      id: `rec-case-${c.caseId}`,
      text: `Revisar processo ${c.caseNumber} — risco ${c.level}`,
      priority: priority--,
      link: `/app/processos/${c.caseId}`,
    })
  })

  data.documents
    .filter((d) => !d.caseId)
    .slice(0, 3)
    .forEach((d) => {
      recs.push({
        id: `rec-doc-${d.id}`,
        text: `Vincular documento "${d.fileName}"`,
        priority: priority--,
        link: '/app/documentos',
      })
    })

  data.tasks
    .filter((t) => !t.assignedTo && t.status === 'pendente')
    .slice(0, 3)
    .forEach((t) => {
      recs.push({
        id: `rec-task-${t.id}`,
        text: `Delegar tarefa: ${t.title}`,
        priority: priority--,
        link: '/app/agenda',
      })
    })

  data.publications
    .filter((p) => p.status === 'analisada')
    .slice(0, 2)
    .forEach((p) => {
      recs.push({
        id: `rec-pub-${p.id}`,
        text: 'Revisar publicação analisada',
        priority: priority--,
        link: '/app/publicacoes',
      })
    })

  data.deadlines
    .filter((d) => daysUntil(d.deadlineDate) <= 3 && d.status !== 'concluido')
    .slice(0, 2)
    .forEach((d) => {
      recs.push({
        id: `rec-dl-${d.id}`,
        text: `Criar lembrete para prazo: ${d.title}`,
        priority: priority--,
        link: '/app/prazos',
      })
    })

  if (recs.length === 0) {
    recs.push({
      id: 'rec-default',
      text: 'Cadastre processos e prazos para receber recomendações personalizadas.',
      priority: 1,
      link: '/app/processos',
    })
  }

  return recs.sort((a, b) => b.priority - a.priority).slice(0, 8)
}
