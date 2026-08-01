import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Brain, Save, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { env } from '../../config/env'
import { executeSafeAIRequest, saveFeedback, saveValidation } from '../../services/ai/safeAIClient'
import { createDeadline } from '../../services/deadlineService'
import { createPublication } from '../../services/publicationService'
import type { AIResponseRecord, FeedbackType } from '../../ai/safety/types'
import { SafeAIResult } from '../../components/ai/SafeAIResult'
import { ValidationChecklist } from '../../components/ai/ValidationChecklist'
import { AIWarningBanner } from '../../components/ai/AIWarningBanner'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Textarea, Input } from '../../components/ui/Input'
import { LoadingState } from '../../components/common/LoadingState'
import { useQueryClient } from '@tanstack/react-query'

export function PublicationAssistantPage() {
  const { session, canWrite } = useAuth()
  const queryClient = useQueryClient()
  const orgId = session!.organization.id

  const [texto, setTexto] = useState('')
  const [source, setSource] = useState('DJE')
  const [court, setCourt] = useState('')
  const [caseId, setCaseId] = useState('')
  const [response, setResponse] = useState<AIResponseRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [validationOpen, setValidationOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<'deadline' | 'save' | null>(null)
  const [saved, setSaved] = useState(false)

  const handleAnalyze = async () => {
    if (!texto.trim() || !canWrite) return
    setLoading(true)
    setError('')
    setResponse(null)
    try {
      const result = await executeSafeAIRequest({
        organizationId: orgId,
        userId: session!.userId,
        assistantId: 'asst-publicacoes',
        assistantSlug: 'publicacoes',
        contextType: 'publicacao',
        contextId: caseId || undefined,
        actionType: 'analisar',
        inputText: texto,
        isDemo: env.demoMode,
      })
      setResponse(result)
      queryClient.invalidateQueries({ queryKey: ['intelligence', orgId] })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro na análise')
    } finally {
      setLoading(false)
    }
  }

  const requestValidation = (action: 'deadline' | 'save') => {
    setPendingAction(action)
    setValidationOpen(true)
  }

  const handleValidated = async (checklist: Record<string, boolean>) => {
    if (!response) return
    saveValidation(response.id, session!.userId, checklist)
    setValidationOpen(false)

    if (pendingAction === 'deadline') {
      await createDeadline(orgId, {
        caseId: caseId || undefined,
        title: 'Possível prazo sugerido — ' + (response.structuredOutput.suggestedActions[0] || 'Manifestação'),
        description: response.structuredOutput.summary,
        deadlineDate: new Date().toISOString().split('T')[0],
        priority: response.structuredOutput.riskLevel === 'alto' ? 'critica' : 'alta',
        status: 'pendente',
        source: 'ia',
        aiSuggested: true,
        responsibleUserId: session!.userId,
        responsibleUserName: session!.profile.fullName,
      }, session!.userId, session!.profile.fullName)
      setSaved(true)
    }

    if (pendingAction === 'save') {
      await createPublication(orgId, {
        rawText: texto,
        source,
        court,
        publicationDate: new Date().toISOString().split('T')[0],
        caseId: caseId || undefined,
      }, session!.userId, session!.profile.fullName)
      setSaved(true)
    }

    setPendingAction(null)
    queryClient.invalidateQueries({ queryKey: ['intelligence', orgId] })
  }

  return (
    <div className="space-y-6">
      <Link to="/app/assistentes" className="inline-flex items-center gap-2 text-sm text-gold hover:underline">
        <ArrowLeft className="h-4 w-4" /> Voltar aos assistentes
      </Link>

      <AIWarningBanner demo={env.demoMode} />

      <Card>
        <CardHeader><div className="flex items-center gap-2"><Brain className="h-5 w-5 text-gold" /><CardTitle>Assistente de Publicações</CardTitle></div></CardHeader>
        <div className="grid gap-4 sm:grid-cols-3 mb-4">
          <Input label="Fonte" value={source} onChange={(e) => setSource(e.target.value)} />
          <Input label="Tribunal" value={court} onChange={(e) => setCourt(e.target.value)} />
          <Input label="ID do processo (opcional)" value={caseId} onChange={(e) => setCaseId(e.target.value)} />
        </div>
        <Textarea placeholder="Cole a publicação ou intimação..." value={texto} onChange={(e) => setTexto(e.target.value)} className="min-h-[160px]" />
        <Button variant="gold" className="mt-4" onClick={handleAnalyze} disabled={loading || !texto.trim() || !canWrite}>
          <Brain className="h-4 w-4" />{loading ? 'Analisando...' : 'Analisar com Safe AI'}
        </Button>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </Card>

      {loading && <LoadingState message="Preparando contexto e analisando..." />}

      {response && (
        <>
          <SafeAIResult
            response={response}
            onFeedback={(type: FeedbackType) => saveFeedback(response.id, session!.userId, type)}
          />
          <div className="flex flex-wrap gap-3">
            <Button variant="gold" onClick={() => requestValidation('deadline')} disabled={saved}>
              <Save className="h-4 w-4" />{saved ? 'Ação registrada' : 'Criar possível prazo (após validação)'}
            </Button>
            <Button variant="outline" onClick={() => requestValidation('save')}>
              <CheckCircle className="h-4 w-4" />Salvar análise vinculada
            </Button>
          </div>
        </>
      )}

      <ValidationChecklist
        open={validationOpen}
        onClose={() => { setValidationOpen(false); setPendingAction(null) }}
        onConfirm={handleValidated}
        title="Validação humana — ação sobre análise de IA"
      />
    </div>
  )
}
