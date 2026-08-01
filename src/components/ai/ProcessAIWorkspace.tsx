import { useState } from 'react'
import { Brain, Send } from 'lucide-react'
import type { Case } from '../../types/entities'
import type { AIResponseRecord } from '../../ai/safety/types'
import { executeSafeAIRequest, saveFeedback } from '../../services/ai/safeAIClient'
import { useAuth } from '../../context/AuthContext'
import { env } from '../../config/env'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Textarea } from '../ui/Input'
import { SafeAIResult } from './SafeAIResult'
import { SourceSelector, type SourceOption } from './SourceSelector'
import { AIWarningBanner } from './AIWarningBanner'
import { LoadingState } from '../common/LoadingState'
import type { FeedbackType } from '../../ai/safety/types'

interface ProcessAIWorkspaceProps {
  caseItem: Case
  deadlinesCount: number
  publicationsCount: number
  tasksCount: number
  documentsCount: number
}

export function ProcessAIWorkspace({
  caseItem,
  deadlinesCount,
  publicationsCount,
  tasksCount,
  documentsCount,
}: ProcessAIWorkspaceProps) {
  const { session } = useAuth()
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState<AIResponseRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sources, setSources] = useState<SourceOption[]>([
    { id: 'processo', label: 'Dados do processo', enabled: true },
    { id: 'publicacoes', label: 'Publicações', enabled: true, size: `${publicationsCount} item(ns)` },
    { id: 'prazos', label: 'Prazos', enabled: true, size: `${deadlinesCount} item(ns)` },
    { id: 'documentos', label: 'Documentos', enabled: false, size: `${documentsCount} item(ns)` },
    { id: 'tarefas', label: 'Tarefas', enabled: false, size: `${tasksCount} item(ns)` },
  ])

  const handleAsk = async () => {
    if (!question.trim() || !session) return
    setLoading(true)
    setError('')
    try {
      const enabledSources = sources.filter((s) => s.enabled).map((s) => s.id)
      const contextText = [
        `Processo: ${caseItem.caseNumber} - ${caseItem.title}`,
        `Cliente: ${caseItem.clientName || 'N/A'}`,
        `Tribunal: ${caseItem.court}`,
        `Pergunta: ${question}`,
        `Fontes habilitadas: ${enabledSources.join(', ')}`,
      ].join('\n')

      const result = await executeSafeAIRequest({
        organizationId: session.organization.id,
        userId: session.userId,
        assistantId: 'asst-processos',
        assistantSlug: 'processos',
        contextType: 'processo',
        contextId: caseItem.id,
        actionType: 'perguntar',
        inputText: contextText,
        sources: enabledSources,
        isDemo: env.demoMode,
      })
      setResponse(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao processar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <AIWarningBanner demo={env.demoMode} />
      <p className="text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-4 py-2">
        As respostas estão limitadas aos dados disponíveis neste processo.
      </p>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Contexto</CardTitle></CardHeader>
          <div className="text-sm space-y-2">
            <p><strong>Processo:</strong> {caseItem.caseNumber}</p>
            <p><strong>Cliente:</strong> {caseItem.clientName}</p>
            <p><strong>Responsável:</strong> {caseItem.responsibleUserName || '—'}</p>
          </div>
          <div className="mt-4">
            <SourceSelector
              sources={sources}
              onChange={(id, enabled) => setSources((prev) => prev.map((s) => (s.id === id ? { ...s, enabled } : s)))}
            />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><div className="flex items-center gap-2"><Brain className="h-5 w-5 text-gold" /><CardTitle>IA do Processo</CardTitle></div></CardHeader>
          <Textarea
            placeholder="Faça uma pergunta sobre este processo..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[100px]"
          />
          <Button variant="gold" className="mt-3" onClick={handleAsk} disabled={loading || !question.trim()}>
            <Send className="h-4 w-4" />{loading ? 'Analisando...' : 'Perguntar'}
          </Button>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </Card>
      </div>

      {loading && <LoadingState message="Preparando contexto e analisando..." />}
      {response && (
        <SafeAIResult
          response={response}
          onFeedback={(type: FeedbackType) => saveFeedback(response.id, session!.userId, type)}
        />
      )}
    </div>
  )
}
