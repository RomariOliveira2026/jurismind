import { useEffect, useState } from 'react'
import { Brain, Save, AlertTriangle, Clock, Lightbulb, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { listPublications, createPublication, analyzePublication, markPublicationReviewed, getPublicationAnalysis } from '../../services/publicationService'
import { createDeadline } from '../../services/deadlineService'
import type { Publication, PublicationAnalysis } from '../../types/entities'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { Textarea, Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { LoadingState } from '../../components/common/LoadingState'
import { ErrorState } from '../../components/common/ErrorState'
import { AIDisclaimer } from '../../components/common/AIDisclaimer'
import { PUBLICATION_STATUS_LABELS } from '../../lib/labels'
import { AI_DISCLAIMER } from '../../lib/helpers'

export function PublicacoesPage() {
  const { session, canWrite } = useAuth()
  const orgId = session!.organization.id
  const [publications, setPublications] = useState<Publication[]>([])
  const [selected, setSelected] = useState<Publication | null>(null)
  const [analysis, setAnalysis] = useState<PublicationAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [texto, setTexto] = useState('')
  const [source, setSource] = useState('DJE')
  const [court, setCourt] = useState('')
  const [saved, setSaved] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setPublications(await listPublications(orgId))
    } catch {
      setError('Não foi possível carregar as publicações. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [orgId])

  const handleCreateAndAnalyze = async () => {
    if (!texto.trim() || !canWrite) return
    setAnalyzing(true)
    const pub = await createPublication(orgId, { rawText: texto, source, court, publicationDate: new Date().toISOString().split('T')[0], caseId: undefined, clientId: undefined }, session!.userId, session!.profile.fullName)
    const result = await analyzePublication(pub.id, session!.userId, session!.profile.fullName, session!.organization.id)
    setSelected(pub)
    setAnalysis(result)
    setTexto('')
    setAnalyzing(false)
    load()
  }

  const handleSelect = async (pub: Publication) => {
    setSelected(pub)
    setAnalysis(await getPublicationAnalysis(pub.id))
  }

  const handleSaveDeadline = async () => {
    if (!analysis || !selected) return
  if (!window.confirm('Confirma a criação deste prazo com base na sugestão da IA?\n\n' + AI_DISCLAIMER)) return
    await createDeadline(orgId, {
      caseId: selected.caseId,
      clientId: selected.clientId,
      title: 'Prazo sugerido por IA — ' + (analysis.suggestedAction || 'Manifestação'),
      description: analysis.summary,
      deadlineDate: analysis.suggestedDeadline || new Date().toISOString().split('T')[0],
      priority: analysis.riskLevel === 'alto' ? 'critica' : 'alta',
      status: 'pendente',
      source: 'ia',
      aiSuggested: true,
      responsibleUserId: session!.userId,
      responsibleUserName: session!.profile.fullName,
    }, session!.userId, session!.profile.fullName)
    setSaved(true)
  }

  const handleReview = async () => {
    if (!selected) return
    await markPublicationReviewed(selected.id, session!.userId, session!.profile.fullName, session!.organization.id)
    load()
    setSelected({ ...selected, status: 'revisada' })
  }

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="space-y-6">
      <AIDisclaimer />

      <Card>
        <CardHeader><CardTitle>Nova publicação</CardTitle></CardHeader>
        <div className="grid gap-4 sm:grid-cols-2 mb-4">
          <Input label="Fonte" value={source} onChange={(e) => setSource(e.target.value)} />
          <Input label="Tribunal" value={court} onChange={(e) => setCourt(e.target.value)} />
        </div>
        <Textarea placeholder="Cole o texto da publicação ou intimação..." value={texto} onChange={(e) => setTexto(e.target.value)} className="min-h-[140px]" />
        <div className="mt-4 flex gap-3">
          <Button variant="gold" onClick={handleCreateAndAnalyze} disabled={analyzing || !texto.trim() || !canWrite}>
            <Brain className="h-4 w-4" />{analyzing ? 'Analisando...' : 'Analisar com IA'}
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Publicações ({publications.length})</CardTitle></CardHeader>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {publications.map((p) => (
              <button key={p.id} onClick={() => handleSelect(p)} className={`w-full text-left rounded-lg border p-3 cursor-pointer ${selected?.id === p.id ? 'border-gold bg-gold/5' : 'border-slate-200 dark:border-slate-700'}`}>
                <p className="text-sm line-clamp-2">{p.rawText}</p>
                <Badge variant="proximo" className="mt-2">{PUBLICATION_STATUS_LABELS[p.status]}</Badge>
              </button>
            ))}
          </div>
        </Card>

        {analysis && selected && (
          <div className="space-y-4">
            <Card><div className="flex items-center gap-2 mb-2"><Brain className="h-5 w-5 text-gold" /><CardTitle>Resumo</CardTitle></div><p className="text-sm">{analysis.summary}</p></Card>
            <Card><div className="flex items-center gap-2 mb-2"><Clock className="h-5 w-5 text-gold" /><CardTitle>Prazo sugerido</CardTitle></div><p className="text-sm font-medium">{analysis.suggestedDeadline}</p><p className="text-xs text-amber-600 mt-2">{AI_DISCLAIMER}</p></Card>
            <Card><div className="flex items-center gap-2 mb-2"><AlertTriangle className="h-5 w-5 text-gold" /><CardTitle>Risco</CardTitle></div><Badge variant={analysis.riskLevel === 'alto' ? 'urgente' : 'proximo'}>Risco {analysis.riskLevel} · {Math.round(analysis.confidence * 100)}% confiança</Badge></Card>
            <Card><div className="flex items-center gap-2 mb-2"><Lightbulb className="h-5 w-5 text-gold" /><CardTitle>Providência</CardTitle></div><p className="text-sm">{analysis.suggestedAction}</p></Card>
            {analysis.warnings.length > 0 && <Card><p className="text-xs text-text-muted">Pontos de conferência: {analysis.warnings.join(' · ')}</p></Card>}
            <div className="flex flex-wrap gap-3">
              <Button variant="gold" onClick={handleSaveDeadline} disabled={saved}><Save className="h-4 w-4" />{saved ? 'Prazo criado!' : 'Salvar como prazo'}</Button>
              {selected.status !== 'revisada' && <Button variant="outline" onClick={handleReview}><CheckCircle className="h-4 w-4" />Marcar como revisada</Button>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
