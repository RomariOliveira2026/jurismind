import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Plus, Mail, Phone, Search, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { listClients, createClient, archiveClient, countClientCases } from '../../services/clientService'
import type { Client, ClientType } from '../../types/entities'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Modal } from '../../components/ui/Modal'
import { Input, Textarea, Select } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingState } from '../../components/common/LoadingState'
import { ErrorState } from '../../components/common/ErrorState'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { CLIENT_STATUS_LABELS } from '../../lib/labels'

export function ClientesPage() {
  const { session, canWrite } = useAuth()
  const orgId = session!.organization.id
  const userId = session!.userId
  const userName = session!.profile.fullName

  const [clients, setClients] = useState<(Client & { caseCount?: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [archiveId, setArchiveId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', type: 'pf' as ClientType, cpfCnpj: '', email: '', phone: '', notes: '' })

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const items = await listClients(orgId, { search, status: statusFilter || undefined })
      const withCounts = await Promise.all(items.map(async (c) => ({ ...c, caseCount: await countClientCases(c.id) })))
      setClients(withCounts)
    } catch {
      setError('Não foi possível carregar os clientes. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [orgId, search, statusFilter])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createClient(orgId, { ...form, status: 'ativo', address: '' }, userId, userName)
    setForm({ name: '', type: 'pf', cpfCnpj: '', email: '', phone: '', notes: '' })
    setModalOpen(false)
    load()
  }

  const handleArchive = async () => {
    if (!archiveId) return
    await archiveClient(archiveId, userId, userName, orgId)
    setArchiveId(null)
    load()
  }

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cliente..." className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm dark:border-slate-600 dark:bg-navy dark:text-ice" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-navy dark:text-ice">
            <option value="">Todos os status</option>
            <option value="ativo">Ativo</option>
            <option value="arquivado">Arquivado</option>
          </select>
        </div>
        {canWrite && <Button variant="gold" onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" />Novo cliente</Button>}
      </div>

      <p className="text-sm text-text-muted">{clients.length} clientes</p>

      {clients.length === 0 ? (
        <EmptyState icon={User} title="Nenhum cliente encontrado" description="Cadastre seu primeiro cliente." actionLabel="Novo cliente" onAction={() => setModalOpen(true)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <Card key={c.id} hover>
              <div className="flex items-start justify-between">
                <Link to={`/app/clientes/${c.id}`} className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-sm font-bold text-gold">{c.name.charAt(0)}</div>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-navy dark:text-ice">{c.name}</h3>
                    <p className="text-xs text-text-muted">{c.cpfCnpj}</p>
                  </div>
                </Link>
                <Badge variant={c.status === 'ativo' ? 'futuro' : 'default'}>{CLIENT_STATUS_LABELS[c.status]}</Badge>
              </div>
              <div className="mt-3 space-y-1 text-sm text-text-muted">
                <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /><span className="truncate">{c.email}</span></div>
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{c.phone}</div>
              </div>
              <p className="mt-3 text-xs text-gold">{c.caseCount} processo(s)</p>
              {canWrite && c.status === 'ativo' && (
                <button onClick={() => setArchiveId(c.id)} className="mt-2 text-xs text-text-muted hover:text-red-500 cursor-pointer">Arquivar</button>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo cliente">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Select label="Tipo" options={[{ value: 'pf', label: 'Pessoa física' }, { value: 'pj', label: 'Pessoa jurídica' }]} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ClientType })} />
          <Input label="CPF/CNPJ" value={form.cpfCnpj} onChange={(e) => setForm({ ...form, cpfCnpj: e.target.value })} />
          <Input label="E-mail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Textarea label="Observações" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex gap-3"><Button type="button" variant="secondary" fullWidth onClick={() => setModalOpen(false)}>Cancelar</Button><Button type="submit" variant="gold" fullWidth>Salvar</Button></div>
        </form>
      </Modal>

      <ConfirmDialog open={!!archiveId} onClose={() => setArchiveId(null)} onConfirm={handleArchive} title="Arquivar cliente" message="O cliente será arquivado mas seus dados serão preservados." confirmLabel="Arquivar" />
    </div>
  )
}
