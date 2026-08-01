import { useEffect, useState, useMemo } from 'react'
import { Calendar } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getAgendaEvents } from '../../services/taskService'
import { listClients } from '../../services/clientService'
import type { AgendaEvent } from '../../types/entities'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { LoadingState } from '../../components/common/LoadingState'
import { ErrorState } from '../../components/common/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'
import { formatDateBR } from '../../lib/helpers'
import { DEADLINE_PRIORITY_LABELS, priorityVariant } from '../../lib/labels'

export function AgendaPage() {
  const { session } = useAuth()
  const orgId = session!.organization.id
  const [events, setEvents] = useState<AgendaEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'lista' | 'semana'>('lista')
  const [clientFilter, setClientFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [clients, setClients] = useState<{ id: string; name: string }[]>([])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [ev, cl] = await Promise.all([getAgendaEvents(orgId), listClients(orgId)])
      setEvents(ev)
      setClients(cl.map((c) => ({ id: c.id, name: c.name })))
    } catch {
      setError('Não foi possível carregar a agenda. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [orgId])

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (typeFilter && e.type !== typeFilter) return false
      return true
    })
  }, [events, typeFilter])

  const grouped = useMemo(() => {
    const g: Record<string, AgendaEvent[]> = {}
    filtered.forEach((e) => {
      if (!g[e.date]) g[e.date] = []
      g[e.date].push(e)
    })
    return Object.entries(g).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  const exportICS = () => {
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//JurisMind//Agenda//PT']
    filtered.forEach((e) => {
      lines.push('BEGIN:VEVENT', `DTSTART;VALUE=DATE:${e.date.replace(/-/g, '')}`, `SUMMARY:${e.title}`, `DESCRIPTION:${e.clientName || ''}`, 'END:VEVENT')
    })
    lines.push('END:VCALENDAR')
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'jurismind-agenda.ics'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-navy dark:text-ice">
            <option value="">Todos os tipos</option>
            <option value="prazo">Prazos</option>
            <option value="tarefa">Tarefas</option>
            <option value="audiencia">Audiências</option>
            <option value="reuniao">Reuniões</option>
          </select>
          <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-navy dark:text-ice">
            <option value="">Todos os clientes</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('lista')} className={`px-3 py-1.5 text-sm rounded-lg cursor-pointer ${view === 'lista' ? 'bg-gold/20 text-gold' : 'text-text-muted'}`}>Lista</button>
          <button onClick={() => setView('semana')} className={`px-3 py-1.5 text-sm rounded-lg cursor-pointer ${view === 'semana' ? 'bg-gold/20 text-gold' : 'text-text-muted'}`}>Semana</button>
          <button onClick={exportICS} className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 text-text-muted hover:text-gold cursor-pointer">Exportar .ics</button>
        </div>
      </div>

      <p className="text-xs text-text-muted">Integração com Google Calendar — recurso futuro.</p>

      {grouped.length === 0 ? (
        <EmptyState icon={Calendar} title="Agenda vazia" description="Nenhum evento para os filtros selecionados." />
      ) : (
        <div className="space-y-6">
          {grouped.map(([date, items]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-gold mb-3">{formatDateBR(date)}</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((e) => (
                  <Card key={e.id} padding="sm" hover>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{e.type}</Badge>
                      {e.priority && <Badge variant={priorityVariant(e.priority)}>{DEADLINE_PRIORITY_LABELS[e.priority]}</Badge>}
                    </div>
                    <p className="font-medium text-navy dark:text-ice">{e.title}</p>
                    {e.clientName && <p className="text-xs text-text-muted mt-1">{e.clientName}</p>}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
