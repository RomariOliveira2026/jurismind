import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, Focus, X } from 'lucide-react'
import { getCase } from '../../services/caseService'
import { getClient } from '../../services/clientService'
import { listDeadlines } from '../../services/deadlineService'
import { listPublications } from '../../services/publicationService'
import { listTasks, listDocuments } from '../../services/taskService'
import { fetchIntelligenceData } from '../../services/intelligenceService'
import { computeProcessRisk } from '../../intelligence/riskEngine'
import { useFocusMode } from '../../context/FocusModeContext'
import { useTimeline } from '../../hooks/useIntelligence'
import type { Case, Client, Deadline, Publication, Task, Document } from '../../types/entities'
import { Card, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { LoadingState } from '../../components/common/LoadingState'
import { RiskBadge } from '../../components/intelligence/RiskBadge'
import { TimelineCard } from '../../components/intelligence/TimelineCard'
import { CASE_STATUS_LABELS, CASE_PHASE_LABELS } from '../../lib/labels'
import { ProcessAIWorkspace } from '../../components/ai/ProcessAIWorkspace'

const NORMAL_TABS = ['Visão geral', 'Prazos', 'Publicações', 'Tarefas'] as const
const FOCUS_TABS = ['Cliente', 'Processo', 'Timeline', 'Documentos', 'IA', 'Publicações', 'Prazos', 'Tarefas'] as const

export function ProcessoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isFocusMode, focusCaseId, enterFocus, exitFocus } = useFocusMode()
  const inFocus = isFocusMode && focusCaseId === id

  const [caseItem, setCaseItem] = useState<Case | null>(null)
  const [client, setClient] = useState<Client | null>(null)
  const [tab, setTab] = useState<string>('Visão geral')
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [publications, setPublications] = useState<Publication[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [riskScore, setRiskScore] = useState<number | null>(null)
  const [riskLevel, setRiskLevel] = useState<'baixo' | 'medio' | 'alto' | 'critico' | null>(null)
  const [loading, setLoading] = useState(true)

  const orgId = caseItem?.organizationId || ''
  const { data: timelineEvents } = useTimeline(orgId, id)

  const tabs = inFocus ? FOCUS_TABS : NORMAL_TABS

  useEffect(() => {
    if (!id) return
    const load = async () => {
      const c = await getCase(id)
      if (!c) { setLoading(false); return }
      setCaseItem(c)
      const [dl, pub, ts, docs, intelData, cl] = await Promise.all([
        listDeadlines(c.organizationId, { caseId: id }),
        listPublications(c.organizationId),
        listTasks(c.organizationId),
        listDocuments(c.organizationId),
        fetchIntelligenceData(c.organizationId),
        c.clientId ? getClient(c.clientId) : Promise.resolve(null),
      ])
      setDeadlines(dl)
      setPublications(pub.filter((p) => p.caseId === id))
      setTasks(ts.filter((t) => t.caseId === id))
      setDocuments(docs.filter((d) => d.caseId === id))
      setClient(cl)
      const risk = computeProcessRisk(c, intelData)
      setRiskScore(risk.score)
      setRiskLevel(risk.level)
      setLoading(false)
    }
    load()
  }, [id])

  useEffect(() => {
    if (inFocus) setTab('Processo')
    else setTab('Visão geral')
  }, [inFocus])

  const handleEnterFocus = () => {
    if (id) {
      enterFocus(id)
      setTab('Processo')
    }
  }

  const handleExitFocus = () => {
    exitFocus()
    setTab('Visão geral')
  }

  if (loading) return <LoadingState />
  if (!caseItem) return <p>Processo não encontrado.</p>

  return (
    <div className="space-y-6">
      {!inFocus && (
        <Link to="/app/processos" className="inline-flex items-center gap-2 text-sm text-gold hover:underline">
          <ArrowLeft className="h-4 w-4" />Voltar
        </Link>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy dark:text-ice">{caseItem.title}</h2>
          <p className="font-mono text-sm text-text-muted mt-1">{caseItem.caseNumber}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="futuro">{CASE_STATUS_LABELS[caseItem.status]}</Badge>
            <Badge variant="proximo">{CASE_PHASE_LABELS[caseItem.phase]}</Badge>
            {riskLevel && riskScore !== null && <RiskBadge level={riskLevel} score={riskScore} />}
          </div>
        </div>
        {inFocus ? (
          <Button variant="gold" size="sm" onClick={handleExitFocus} aria-label="Sair do modo foco">
            <X className="h-4 w-4" /> Sair do modo foco
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={handleEnterFocus} aria-label="Entrar em modo foco">
            <Focus className="h-4 w-4" /> Entrar em Modo Foco
          </Button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-700 pb-px" role="tablist">
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 cursor-pointer ${tab === t ? 'border-gold text-gold' : 'border-transparent text-text-muted'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {(tab === 'Visão geral' || tab === 'Processo') && (
        <Card>
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div><span className="text-text-muted">Cliente:</span> {caseItem.clientName}</div>
            <div><span className="text-text-muted">Tribunal:</span> {caseItem.court}</div>
            <div><span className="text-text-muted">Comarca:</span> {caseItem.district}</div>
            <div><span className="text-text-muted">Área:</span> {caseItem.practiceArea}</div>
            <div><span className="text-text-muted">Responsável:</span> {caseItem.responsibleUserName || '—'}</div>
          </div>
          {caseItem.notes && <p className="mt-4 text-sm text-text-muted">{caseItem.notes}</p>}
        </Card>
      )}

      {tab === 'Cliente' && client && (
        <Card>
          <CardTitle>{client.name}</CardTitle>
          <div className="mt-3 grid gap-2 text-sm">
            <div><span className="text-text-muted">E-mail:</span> {client.email}</div>
            <div><span className="text-text-muted">Telefone:</span> {client.phone}</div>
            <Link to={`/app/clientes/${client.id}`} className="text-gold text-sm hover:underline">Ver ficha completa</Link>
          </div>
        </Card>
      )}

      {tab === 'Timeline' && (
        <div role="feed">
          {timelineEvents?.map((e) => <TimelineCard key={e.id} event={e} />)}
          {(!timelineEvents || timelineEvents.length === 0) && (
            <p className="text-sm text-text-muted">Nenhum evento na timeline deste processo.</p>
          )}
        </div>
      )}

      {tab === 'Documentos' && (
        documents.length > 0
          ? documents.map((d) => (
              <Card key={d.id} padding="sm">
                <p className="font-medium">{d.fileName}</p>
                <p className="text-xs text-text-muted">{d.fileType}</p>
              </Card>
            ))
          : <p className="text-sm text-text-muted">Nenhum documento vinculado.</p>
      )}

      {tab === 'IA' && (
        <ProcessAIWorkspace
          caseItem={caseItem}
          deadlinesCount={deadlines.length}
          publicationsCount={publications.length}
          tasksCount={tasks.length}
          documentsCount={documents.length}
        />
      )}

      {tab === 'Prazos' && (
        deadlines.length > 0
          ? deadlines.map((d) => (
              <Card key={d.id} padding="sm">
                <CardTitle>{d.title}</CardTitle>
                <p className="text-xs text-text-muted">{d.deadlineDate}</p>
              </Card>
            ))
          : <p className="text-sm text-text-muted">Nenhum prazo vinculado.</p>
      )}

      {tab === 'Publicações' && (
        publications.length > 0
          ? publications.map((p) => (
              <Card key={p.id} padding="sm">
                <p className="text-sm line-clamp-3">{p.rawText}</p>
              </Card>
            ))
          : <p className="text-sm text-text-muted">Nenhuma publicação vinculada.</p>
      )}

      {tab === 'Tarefas' && (
        tasks.length > 0
          ? tasks.map((t) => (
              <Card key={t.id} padding="sm">
                <p className="font-medium">{t.title}</p>
              </Card>
            ))
          : <p className="text-sm text-text-muted">Nenhuma tarefa vinculada.</p>
      )}
    </div>
  )
}
