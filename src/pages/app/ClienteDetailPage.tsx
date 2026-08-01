import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { getClient } from '../../services/clientService'
import { listCases } from '../../services/caseService'
import { listDeadlines } from '../../services/deadlineService'
import { listTasks, listActivities } from '../../services/taskService'
import type { Client, Case, Deadline, Task, ActivityLog } from '../../types/entities'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { LoadingState } from '../../components/common/LoadingState'
import { CLIENT_STATUS_LABELS } from '../../lib/labels'
import { formatDateBR } from '../../lib/helpers'

export function ClienteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [client, setClient] = useState<Client | null>(null)
  const [cases, setCases] = useState<Case[]>([])
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      const c = await getClient(id)
      if (!c) { setLoading(false); return }
      setClient(c)
      const [cs, dl, ts, acts] = await Promise.all([
        listCases(c.organizationId),
        listDeadlines(c.organizationId, { clientId: id }),
        listTasks(c.organizationId),
        listActivities(c.organizationId, 5),
      ])
      setCases(cs.filter((x) => x.clientId === id))
      setDeadlines(dl)
      setTasks(ts.filter((t) => t.clientId === id))
      setActivities(acts.filter((a) => a.entityId === id))
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <LoadingState />
  if (!client) return <p className="text-text-muted">Cliente não encontrado.</p>

  return (
    <div className="space-y-6">
      <Link to="/app/clientes" className="inline-flex items-center gap-2 text-sm text-gold hover:underline"><ArrowLeft className="h-4 w-4" />Voltar</Link>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy dark:text-ice">{client.name}</h2>
          <p className="text-sm text-text-muted mt-1">{client.cpfCnpj} · {client.email} · {client.phone}</p>
        </div>
        <Badge variant={client.status === 'ativo' ? 'futuro' : 'default'}>{CLIENT_STATUS_LABELS[client.status]}</Badge>
      </div>

      {client.notes && <Card padding="sm"><p className="text-sm text-text-muted">{client.notes}</p></Card>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Processos ({cases.length})</CardTitle></CardHeader>
          <div className="space-y-2">
            {cases.map((c) => (
              <Link key={c.id} to={`/app/processos/${c.id}`} className="block rounded-lg border border-slate-100 p-3 hover:border-gold/30 dark:border-slate-700">
                <p className="font-medium text-sm text-navy dark:text-ice">{c.title}</p>
                <p className="text-xs font-mono text-text-muted">{c.caseNumber}</p>
              </Link>
            ))}
            {cases.length === 0 && <p className="text-sm text-text-muted">Nenhum processo.</p>}
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Prazos ({deadlines.length})</CardTitle></CardHeader>
          <div className="space-y-2">
            {deadlines.slice(0, 5).map((d) => (
              <div key={d.id} className="text-sm"><p className="font-medium text-navy dark:text-ice">{d.title}</p><p className="text-xs text-text-muted">{formatDateBR(d.deadlineDate)}</p></div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tarefas ({tasks.length})</CardTitle></CardHeader>
          {tasks.slice(0, 5).map((t) => <p key={t.id} className="text-sm text-navy dark:text-ice">{t.title}</p>)}
        </Card>

        <Card>
          <CardHeader><CardTitle>Atividades recentes</CardTitle></CardHeader>
          {activities.map((a) => <p key={a.id} className="text-sm text-text-muted">{a.userName} {a.action} · {formatDateBR(a.createdAt.split('T')[0])}</p>)}
        </Card>
      </div>
    </div>
  )
}
