import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Plus, Search, Copy, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { listCases, createCase } from '../../services/caseService'
import { listClients } from '../../services/clientService'
import type { Case, CasePhase, CaseStatus } from '../../types/entities'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, Textarea, Select } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { LoadingState } from '../../components/common/LoadingState'
import { ErrorState } from '../../components/common/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'
import { Briefcase } from 'lucide-react'
import { CASE_STATUS_LABELS, CASE_PHASE_LABELS } from '../../lib/labels'
import { copyToClipboard } from '../../lib/helpers'

export function ProcessosPage() {
  const { session, canWrite } = useAuth()
  const orgId = session!.organization.id
  const [cases, setCases] = useState<Case[]>([])
  const [clients, setClients] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [copied, setCopied] = useState('')
  const [form, setForm] = useState({ caseNumber: '', title: '', clientId: '', court: '', jurisdiction: '', district: '', practiceArea: '', caseType: '', status: 'ativo' as CaseStatus, phase: 'inicial' as CasePhase, notes: '' })

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [cs, cl] = await Promise.all([
        listCases(orgId, { search, status: statusFilter || undefined }),
        listClients(orgId),
      ])
      setCases(cs)
      setClients(cl.map((c) => ({ id: c.id, name: c.name })))
    } catch {
      setError('Não foi possível carregar os processos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [orgId, search, statusFilter])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createCase(orgId, { ...form, opposingParty: '', responsibleUserId: session!.userId, responsibleUserName: session!.profile.fullName, estimatedValue: undefined }, session!.userId, session!.profile.fullName)
    setModalOpen(false)
    load()
  }

  const handleCopy = async (num: string) => {
    await copyToClipboard(num)
    setCopied(num)
    setTimeout(() => setCopied(''), 2000)
  }

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3 flex-wrap flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Número, título ou cliente..." className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm dark:border-slate-600 dark:bg-navy dark:text-ice" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-navy dark:text-ice">
            <option value="">Todos</option>
            {Object.entries(CASE_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        {canWrite && <Button variant="gold" onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" />Novo processo</Button>}
      </div>

      {cases.length === 0 ? (
        <EmptyState icon={Briefcase} title="Nenhum processo" description="Cadastre um processo." actionLabel="Novo processo" onAction={() => setModalOpen(true)} />
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-navy-light"><tr>
                <th className="px-4 py-3 text-left font-medium text-text-muted">Número</th>
                <th className="px-4 py-3 text-left font-medium text-text-muted">Título</th>
                <th className="px-4 py-3 text-left font-medium text-text-muted">Cliente</th>
                <th className="px-4 py-3 text-left font-medium text-text-muted">Fase</th>
                <th className="px-4 py-3 text-left font-medium text-text-muted">Status</th>
                <th className="px-4 py-3"></th>
              </tr></thead>
              <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-navy-light">
                {cases.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-navy/50">
                    <td className="px-4 py-3 font-mono text-xs"><Link to={`/app/processos/${p.id}`} className="text-navy dark:text-ice hover:text-gold">{p.caseNumber}</Link></td>
                    <td className="px-4 py-3">{p.title}</td>
                    <td className="px-4 py-3 text-text-muted">{p.clientName}</td>
                    <td className="px-4 py-3 text-text-muted">{CASE_PHASE_LABELS[p.phase]}</td>
                    <td className="px-4 py-3"><Badge variant="futuro">{CASE_STATUS_LABELS[p.status]}</Badge></td>
                    <td className="px-4 py-3"><button onClick={() => handleCopy(p.caseNumber)} className="text-gold cursor-pointer">{copied === p.caseNumber ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-3">
            {cases.map((p) => (
              <Link key={p.id} to={`/app/processos/${p.id}`} className="block rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="font-medium text-navy dark:text-ice">{p.title}</p>
                <p className="text-xs font-mono text-text-muted mt-1">{p.caseNumber}</p>
                <p className="text-xs text-text-muted mt-1">{p.clientName}</p>
              </Link>
            ))}
          </div>
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo processo">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Número do processo" value={form.caseNumber} onChange={(e) => setForm({ ...form, caseNumber: e.target.value })} required />
          <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Select label="Cliente" options={[{ value: '', label: 'Selecione...' }, ...clients.map((c) => ({ value: c.id, label: c.name }))]} value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Tribunal" value={form.court} onChange={(e) => setForm({ ...form, court: e.target.value })} />
            <Input label="Comarca" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
          </div>
          <Input label="Área / Tipo" value={form.practiceArea} onChange={(e) => setForm({ ...form, practiceArea: e.target.value })} />
          <Textarea label="Observações" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex gap-3"><Button type="button" variant="secondary" fullWidth onClick={() => setModalOpen(false)}>Cancelar</Button><Button type="submit" variant="gold" fullWidth>Salvar</Button></div>
        </form>
      </Modal>
    </div>
  )
}
