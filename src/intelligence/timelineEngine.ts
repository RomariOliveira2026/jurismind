import type { Case } from '../types/entities'
import type { IntelligenceData, TimelineEvent } from './types'

export function buildTimeline(data: IntelligenceData, caseId?: string): TimelineEvent[] {
  const events: TimelineEvent[] = []

  const cases = caseId ? data.cases.filter((c) => c.id === caseId) : data.cases
  const clients = caseId
    ? data.clients.filter((c) => cases.some((cs) => cs.clientId === c.id))
    : data.clients

  clients.forEach((c) => {
    events.push({
      id: `tl-client-${c.id}`,
      type: 'client',
      date: c.createdAt.split('T')[0],
      title: c.name,
      description: `Cliente ${c.type === 'pf' ? 'PF' : 'PJ'} cadastrado`,
      link: `/app/clientes/${c.id}`,
    })
  })

  cases.forEach((c) => {
    events.push({
      id: `tl-case-${c.id}`,
      type: 'case',
      date: c.createdAt.split('T')[0],
      title: c.title,
      description: `Processo ${c.caseNumber}`,
      responsible: c.responsibleUserName,
      referenceId: c.id,
      link: `/app/processos/${c.id}`,
    })
  })

  const filterByCase = <T extends { caseId?: string }>(items: T[]) =>
    caseId ? items.filter((i) => i.caseId === caseId) : items

  filterByCase(data.publications).forEach((p) => {
    events.push({
      id: `tl-pub-${p.id}`,
      type: 'publication',
      date: p.publicationDate || p.createdAt.split('T')[0],
      title: 'Publicação',
      description: p.rawText.slice(0, 120) + (p.rawText.length > 120 ? '...' : ''),
      link: '/app/publicacoes',
    })
  })

  filterByCase(data.deadlines).forEach((d) => {
    events.push({
      id: `tl-dl-${d.id}`,
      type: 'deadline',
      date: d.deadlineDate,
      title: d.title,
      description: d.description || `Prazo — ${d.status}`,
      responsible: d.responsibleUserName,
      referenceId: d.id,
      link: '/app/prazos',
    })
  })

  const docs = caseId
    ? data.documents.filter((d) => d.caseId === caseId)
    : data.documents
  docs.forEach((d) => {
    events.push({
      id: `tl-doc-${d.id}`,
      type: 'document',
      date: d.createdAt.split('T')[0],
      title: d.fileName,
      description: 'Documento enviado',
      responsible: d.uploadedByName,
      link: '/app/documentos',
    })
  })

  filterByCase(data.tasks).forEach((t) => {
    events.push({
      id: `tl-task-${t.id}`,
      type: 'task',
      date: t.dueDate || t.createdAt.split('T')[0],
      title: t.title,
      description: t.description || `Tarefa — ${t.status}`,
      responsible: t.assignedToName,
      link: '/app/agenda',
    })
  })

  const acts = caseId
    ? data.activities.filter((a) => a.entityId === caseId)
    : data.activities
  acts.forEach((a) => {
    events.push({
      id: `tl-act-${a.id}`,
      type: 'activity',
      date: a.createdAt.split('T')[0],
      title: `${a.userName} ${a.action}`,
      description: `${a.entityType}${a.entityId ? ` #${a.entityId.slice(0, 8)}` : ''}`,
      responsible: a.userName,
    })
  })

  return events.sort((a, b) => b.date.localeCompare(a.date))
}

export function buildCaseTimeline(data: IntelligenceData, caseItem: Case): TimelineEvent[] {
  const scoped: IntelligenceData = {
    ...data,
    cases: [caseItem],
    clients: data.clients.filter((c) => c.id === caseItem.clientId),
  }
  return buildTimeline(scoped, caseItem.id)
}
