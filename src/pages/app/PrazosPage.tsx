import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Clock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { listDeadlines, createDeadline, completeDeadline, deleteDeadline } from '../../services/deadlineService'
import { listCases } from '../../services/caseService'
import type { Deadline, DeadlinePriority, DeadlineStatus } from '../../types/entities'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, Textarea, Select } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingState } from '../../components/common/LoadingState'
import { ErrorState } from '../../components/common/ErrorState'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { DEADLINE_STATUS_LABELS, DEADLINE_PRIORITY_LABELS, deadlineStatusVariant, priorityVariant } from '../../lib/labels'
import { formatDateBR, daysUntil, todayISO, addDays, AI_DISCLAIMER } from '../../lib/helpers'

export function PrazosPage() {
  const { session, canWrite } = useAuth()
  const [searchParams] = useSearchParams()
  const orgId = session!.organization.id
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [cases, setCases] = useState<{ id: string; label: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'lista' | 'quadro'>('lista')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '')
  const [modalOpen, setModalOpen] = useState(false)
  const [completeId, setCompleteId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ caseId: '', title: '', description: '', deadlineDate: '', internalDate: '', priority: 'media' as DeadlinePriority, status: 'pendente' as DeadlineStatus })

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const periodo = searchParams.get('periodo')
      let from: string | undefined
      let to: string | undefined
      const today = todayISO()
      if (periodo === 'hoje') { from = today; to = today }
      if (periodo === '7dias') { from = today; to = addDays(today, 7) }

      const [dl, cs] = await Promise.all([
        listDeadlines(orgId, { status: statusFilter || undefined, from, to }),
        listCases(orgId),
      ])
      setDeadlines(dl)
      setCases(cs.map((c) => ({ id: c.id, label: `${c.caseNumber} — ${c.clientName}` })))
    } catch {
      setError('Não foi possível carregar os prazos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [orgId, statusFilter, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createDeadline(orgId, { ...form, clientId: undefined, source: 'manual', responsibleUserId: session!.userId, responsibleUserName: session!.profile.fullName }, session!.userId, session!.profile.fullName)
    setModalOpen(false)
    load()
  }

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={load} />

  const grouped = deadlines.reduce<Record<string, Deadline[]>>((acc, d) => {
    const key = d.deadlineDate
    if (!acc[key]) acc[key] = []
    acc[key].push(d)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {['', 'vencido', 'pendente', 'em_andamento', 'concluido'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`rounded-full px-3 py-1 text-xs font-medium cursor-pointer ${statusFilter === s ? 'bg-gold/20 text-gold' : 'bg-slate-100 text-text-muted dark:bg-navy-light'}`}>
              {s === '' ? 'Todos' : DEADLINE_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant={view === 'lista' ? 'gold' : 'ghost'} size="sm" onClick={() => setView('lista')}>Lista</Button>
          <Button variant={view === 'quadro' ? 'gold' : 'ghost'} size="sm" onClick={() => setView('quadro')}>Quadro</Button>
          {canWrite && <Button variant="gold" size="sm" onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" />Novo prazo</Button>}
        </div>
      </div>

      {deadlines.length === 0 ? (
        <EmptyState icon={Clock} title="Nenhum prazo" description="Crie um prazo para acompanhar." actionLabel="Novo prazo" onAction={() => setModalOpen(true)} />
      ) : view === 'lista' ? (
        <div className="space-y-3">
          {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([date, items]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-gold mb-2">{formatDateBR(date)}</h3>
              {items.map((d) => (
                <div key={d.id} className={`mb-2 rounded-xl border p-4 ${d.status === 'vencido' ? 'border-red-300 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-navy-light'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-navy dark:text-ice">{d.title}</p>
                      <p className="text-xs text-text-muted">{d.clientName} · {d.caseNumber}</p>
                      {d.aiSuggested && <p className="text-xs text-amber-600 mt-1">{AI_DISCLAIMER}</p>}
                      <p className="text-xs text-text-muted mt-1">{daysUntil(d.deadlineDate) >= 0 ? `Faltam ${daysUntil(d.deadlineDate)} dias` : `Vencido há ${Math.abs(daysUntil(d.deadlineDate))} dias`}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={priorityVariant(d.priority)}>{DEADLINE_PRIORITY_LABELS[d.priority]}</Badge>
                      <Badge variant={deadlineStatusVariant(d.status)}>{DEADLINE_STATUS_LABELS[d.status]}</Badge>
                      {canWrite && d.status !== 'concluido' && (
                        <Button variant="ghost" size="sm" onClick={() => setCompleteId(d.id)}>Concluir</Button>
                      )}
                      {canWrite && <Button variant="ghost" size="sm" onClick={() => setDeleteId(d.id)}>Excluir</Button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(['pendente', 'em_andamento', 'vencido', 'concluido'] as const).map((status) => (
            <div key={status} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="font-semibold text-sm text-navy dark:text-ice mb-3">{DEADLINE_STATUS_LABELS[status]}</h3>
              {deadlines.filter((d) => d.status === status).map((d) => (
                <div key={d.id} className="mb-2 rounded-lg bg-slate-50 p-3 text-sm dark:bg-navy">{d.title}</div>
              ))}
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo prazo">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Processo" options={[{ value: '', label: 'Selecione...' }, ...cases.map((c) => ({ value: c.id, label: c.label }))]} value={form.caseId} onChange={(e) => setForm({ ...form, caseId: e.target.value })} />
          <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Textarea label="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Data limite" type="date" value={form.deadlineDate} onChange={(e) => setForm({ ...form, deadlineDate: e.target.value })} required />
            <Input label="Data interna (opcional)" type="date" value={form.internalDate} onChange={(e) => setForm({ ...form, internalDate: e.target.value })} />
          </div>
          <Select label="Prioridade" options={Object.entries(DEADLINE_PRIORITY_LABELS).map(([v, l]) => ({ value: v, label: l }))} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as DeadlinePriority })} />
          <div className="flex gap-3"><Button type="button" variant="secondary" fullWidth onClick={() => setModalOpen(false)}>Cancelar</Button><Button type="submit" variant="gold" fullWidth>Salvar</Button></div>
        </form>
      </Modal>

      <ConfirmDialog open={!!completeId} onClose={() => setCompleteId(null)} onConfirm={async () => { if (completeId) { await completeDeadline(completeId, session!.userId, session!.profile.fullName, session!.organization.id); setCompleteId(null); load() } }} title="Concluir prazo" message="Confirma a conclusão deste prazo?" />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={async () => { if (deleteId) { await deleteDeadline(deleteId, session!.userId, session!.profile.fullName, session!.organization.id); setDeleteId(null); load() } }} title="Excluir prazo" message="Esta ação não pode ser desfeita." variant="danger" confirmLabel="Excluir" />
    </div>
  )
}
