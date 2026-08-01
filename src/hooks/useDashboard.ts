import { useQuery } from '@tanstack/react-query'
import { getDashboardStats, listActivities } from '../services/taskService'
import { listDeadlines } from '../services/deadlineService'
import { listCases } from '../services/caseService'

export function useDashboard(orgId: string) {
  return useQuery({
    queryKey: ['dashboard', orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const [stats, deadlines, activities, cases] = await Promise.all([
        getDashboardStats(orgId),
        listDeadlines(orgId),
        listActivities(orgId, 8),
        listCases(orgId, { status: 'ativo' }),
      ])
      return {
        stats,
        urgentDeadlines: deadlines
          .filter((d) => d.status === 'vencido' || d.status === 'pendente' || d.status === 'em_andamento')
          .slice(0, 6),
        activities,
        recentCases: cases.slice(0, 4).map((c) => ({
          id: c.id,
          title: c.title,
          caseNumber: c.caseNumber,
          clientName: c.clientName,
        })),
      }
    },
  })
}
