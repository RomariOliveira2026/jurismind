import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Shield } from 'lucide-react'
import type { AssistantDefinition } from '../../ai/assistants/registry'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

const RISK_VARIANT = { baixo: 'proximo', medio: 'futuro', alto: 'urgente' } as const
const STATUS_LABEL = { ativo: 'Ativo', preparado: 'Preparado', em_breve: 'Em breve' }

function AssistantCardInner({ assistant }: { assistant: AssistantDefinition }) {
  const disabled = assistant.status === 'em_breve'
  return (
    <Card className={cn('flex flex-col h-full', disabled && 'opacity-60')}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-gold" aria-hidden />
          <h3 className="font-semibold text-navy dark:text-ice">{assistant.name}</h3>
        </div>
        <Badge variant={RISK_VARIANT[assistant.riskLevel]}>Risco {assistant.riskLevel}</Badge>
      </div>
      <p className="mt-2 text-sm text-text-muted flex-1">{assistant.description}</p>
      <div className="mt-3 space-y-1 text-xs text-text-muted">
        <p><strong>Finalidade:</strong> {assistant.purpose}</p>
        <p><strong>Contexto:</strong> {assistant.acceptedContexts.join(', ')}</p>
        <p className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          {assistant.requiresValidation ? 'Validação humana obrigatória' : 'Validação opcional'}
        </p>
        <p>v{assistant.version} · {STATUS_LABEL[assistant.status]}</p>
      </div>
      {disabled ? (
        <Button variant="outline" size="sm" className="mt-4" disabled>Em breve</Button>
      ) : (
        <Link to={assistant.route} className="mt-4">
          <Button variant="gold" size="sm" fullWidth>Abrir assistente</Button>
        </Link>
      )}
    </Card>
  )
}

export const AssistantCard = memo(AssistantCardInner)
