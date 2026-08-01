import { todayISO } from '../lib/helpers'
import type { DaySummary, IntelligenceData, WeeklySummary } from './types'
import { getCriticalProcesses } from './riskEngine'

export function computeDaySummary(data: IntelligenceData): DaySummary {
  const today = todayISO()

  const deadlinesToday = data.deadlines.filter(
    (d) => d.deadlineDate === today && d.status !== 'concluido' && d.status !== 'cancelado',
  ).length

  const tasksToday = data.tasks.filter(
    (t) => t.dueDate === today && (t.status === 'pendente' || t.status === 'em_andamento'),
  ).length

  const publications = data.publications.filter(
    (p) => p.status === 'aguardando' || p.status === 'analisada',
  ).length

  const criticalCases = getCriticalProcesses(data, 10).filter((c) => c.score >= 50).length

  const clientsActive = data.clients.filter((c) => c.status === 'ativo').length
  const casesActive = data.cases.filter((c) => c.status === 'ativo').length

  const estimatedWorkMinutes =
    deadlinesToday * 45 + tasksToday * 30 + publications * 20 + criticalCases * 15

  return {
    deadlinesToday,
    tasksToday,
    hearings: data.hearingsToday,
    publications,
    criticalCases,
    clientsActive,
    casesActive,
    estimatedWorkMinutes,
  }
}

export function computeWeeklySummary(data: IntelligenceData): WeeklySummary {
  const days: WeeklySummary['days'] = []
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().split('T')[0]
    const label = d.toLocaleDateString('pt-BR', { weekday: 'short' })

    const deadlines = data.deadlines.filter((dl) => dl.deadlineDate === iso).length
    const completed = data.deadlines.filter(
      (dl) => dl.completedAt && dl.completedAt.startsWith(iso),
    ).length
    const productivity = completed > 0 ? Math.min(100, completed * 25 + deadlines * 10) : deadlines * 15

    const newClients = data.clients.filter((c) => c.createdAt.startsWith(iso)).length
    const newCases = data.cases.filter((c) => c.createdAt.startsWith(iso)).length

    days.push({ label, deadlines, productivity: Math.min(100, productivity), newClients, newCases })
  }

  return { days, ruleBased: true }
}
