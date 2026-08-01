import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { listDeadlines } from '../../services/deadlineService'
import { listCases } from '../../services/caseService'
import { listTasks } from '../../services/taskService'
import { listPublications } from '../../services/publicationService'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { LoadingState } from '../../components/common/LoadingState'
import { DEADLINE_STATUS_LABELS, CASE_PHASE_LABELS } from '../../lib/labels'
import { env } from '../../config/env'

export function RelatoriosPage() {
  const { session } = useAuth()
  const orgId = session!.organization.id
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    prazosPorStatus: [] as { label: string; value: number; color: string }[],
    processosPorFase: [] as { label: string; value: number }[],
    tarefasConcluidas: 0,
    publicacoesAnalisadas: 0,
  })

  useEffect(() => {
    const load = async () => {
      const [deadlines, cases, tasks, pubs] = await Promise.all([
        listDeadlines(orgId),
        listCases(orgId),
        listTasks(orgId),
        listPublications(orgId),
      ])

      const statusCount: Record<string, number> = {}
      deadlines.forEach((d) => { statusCount[d.status] = (statusCount[d.status] || 0) + 1 })

      const phaseCount: Record<string, number> = {}
      cases.forEach((c) => { phaseCount[c.phase] = (phaseCount[c.phase] || 0) + 1 })

      const colors: Record<string, string> = { vencido: '#ef4444', pendente: '#f59e0b', em_andamento: '#3b82f6', concluido: '#22c55e', cancelado: '#94a3b8' }

      setData({
        prazosPorStatus: Object.entries(statusCount).map(([k, v]) => ({ label: DEADLINE_STATUS_LABELS[k] || k, value: v, color: colors[k] || '#94a3b8' })),
        processosPorFase: Object.entries(phaseCount).map(([k, v]) => ({ label: CASE_PHASE_LABELS[k] || k, value: v })),
        tarefasConcluidas: tasks.filter((t) => t.status === 'concluida').length,
        publicacoesAnalisadas: pubs.filter((p) => p.status === 'analisada' || p.status === 'revisada').length,
      })
      setLoading(false)
    }
    load()
  }, [orgId])

  if (loading) return <LoadingState />

  const maxPhase = Math.max(...data.processosPorFase.map((d) => d.value), 1)

  return (
    <div className="space-y-6">
      {env.demoMode && (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-4 py-2 text-sm text-amber-800 dark:text-amber-300 text-center">
          Dados demonstrativos — baseados no ambiente de demonstração.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Prazos por status</CardTitle></CardHeader>
          <div className="space-y-4">
            {data.prazosPorStatus.map((item) => {
              const total = data.prazosPorStatus.reduce((s, i) => s + i.value, 0)
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-sm"><span>{item.label}</span><span className="font-medium">{item.value}</span></div>
                  <div className="mt-2 h-3 rounded-full bg-slate-100 dark:bg-navy"><div className="h-3 rounded-full" style={{ width: `${total ? (item.value / total) * 100 : 0}%`, backgroundColor: item.color }} /></div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Processos por fase</CardTitle></CardHeader>
          <div className="flex items-end justify-between gap-3 h-48 pt-4">
            {data.processosPorFase.map((item) => (
              <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-sm font-bold">{item.value}</span>
                <div className="w-full rounded-t-lg bg-gold/80" style={{ height: `${(item.value / maxPhase) * 100}%`, minHeight: item.value ? '8px' : '4px' }} />
                <span className="text-xs text-text-muted text-center">{item.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Produtividade</CardTitle></CardHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-navy"><p className="text-3xl font-bold text-gold">{data.tarefasConcluidas}</p><p className="text-sm text-text-muted">Tarefas concluídas</p></div>
            <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-navy"><p className="text-3xl font-bold text-gold">{data.publicacoesAnalisadas}</p><p className="text-sm text-text-muted">Publicações analisadas</p></div>
          </div>
        </Card>
      </div>
    </div>
  )
}
