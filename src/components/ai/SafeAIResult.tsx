import { memo, type ReactNode } from 'react'
import type { AIResponseRecord } from '../../ai/safety/types'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { AIWarningBanner } from './AIWarningBanner'
import { ConfidenceIndicator } from './ConfidenceIndicator'
import { EvidenceMatrix } from './EvidenceMatrix'
import { AIStatusBadge } from './AIStatusBadge'
import { AIFeedback } from './AIFeedback'
import { Badge } from '../ui/Badge'
import type { FeedbackType } from '../../ai/safety/types'

interface SafeAIResultProps {
  response: AIResponseRecord
  onFeedback?: (type: FeedbackType) => void
  showFeedback?: boolean
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card padding="sm">
      <CardHeader className="border-0 pb-2"><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      {children}
    </Card>
  )
}

function SafeAIResultInner({ response, onFeedback, showFeedback = true }: SafeAIResultProps) {
  const o = response.structuredOutput

  return (
    <article className="space-y-4" aria-label="Resultado Safe AI">
      <AIWarningBanner demo={response.demoMode} />
      <div className="flex flex-wrap items-center gap-3">
        <AIStatusBadge status={response.status} />
        <Badge variant={o.riskLevel === 'alto' || o.riskLevel === 'critico' ? 'urgente' : 'proximo'}>
          Risco {o.riskLevel}
        </Badge>
        <span className="text-xs text-text-muted">
          {response.assistantVersion} · {response.provider} · {new Date(response.createdAt).toLocaleString('pt-BR')}
        </span>
      </div>

      <ConfidenceIndicator score={o.confidenceScore} />

      <Section title="1. Resumo da análise">
        <p className="text-sm text-navy dark:text-ice">{o.summary || 'Não foi possível concluir com segurança a partir dos dados disponíveis.'}</p>
      </Section>

      {o.facts.length > 0 && (
        <Section title="2. Fatos identificados">
          <ul className="list-disc pl-5 text-sm space-y-1">{o.facts.map((f) => <li key={f}>{f}</li>)}</ul>
        </Section>
      )}

      {o.interpretations.length > 0 && (
        <Section title="3. Interpretação assistida">
          <ul className="list-disc pl-5 text-sm space-y-1">{o.interpretations.map((f) => <li key={f}>{f}</li>)}</ul>
        </Section>
      )}

      {o.suggestedActions.length > 0 && (
        <Section title="4. Sugestões de providência">
          <ul className="list-disc pl-5 text-sm space-y-1">{o.suggestedActions.map((f) => <li key={f}>{f}</li>)}</ul>
        </Section>
      )}

      {(o.possibleDeadline.value || o.possibleDeadline.warnings.length > 0) && (
        <Section title="5. Possível prazo">
          <p className="text-sm font-medium">
            {o.possibleDeadline.value ? `${o.possibleDeadline.value} ${o.possibleDeadline.unit || ''}` : 'Não identificado com segurança'}
          </p>
          {o.possibleDeadline.startingPoint && <p className="text-xs text-text-muted mt-1">Termo inicial sugerido: {o.possibleDeadline.startingPoint}</p>}
          <ul className="mt-2 text-xs text-amber-700 dark:text-amber-300 list-disc pl-4">
            {o.possibleDeadline.warnings.map((w) => <li key={w}>{w}</li>)}
          </ul>
        </Section>
      )}

      <Section title="6. Fontes utilizadas / Matriz de evidências">
        <EvidenceMatrix items={o.evidence} />
      </Section>

      {o.uncertainties.length > 0 && (
        <Section title="7. Pontos que exigem conferência">
          <ul className="list-disc pl-5 text-sm text-amber-700 dark:text-amber-300 space-y-1">
            {o.uncertainties.map((u) => <li key={u}>{u}</li>)}
          </ul>
        </Section>
      )}

      {o.warnings.length > 0 && (
        <Section title="9. Avisos">
          <ul className="list-disc pl-5 text-xs text-text-muted space-y-1">{o.warnings.map((w) => <li key={w}>{w}</li>)}</ul>
        </Section>
      )}

      {showFeedback && onFeedback && <AIFeedback onSubmit={onFeedback} />}
    </article>
  )
}

export const SafeAIResult = memo(SafeAIResultInner)
