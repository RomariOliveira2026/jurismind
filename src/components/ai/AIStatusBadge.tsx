import { memo } from 'react'
import { AlertTriangle } from 'lucide-react'
import type { AIRequestStatus } from '../../ai/safety/types'
import { cn } from '../../lib/utils'

interface AIStatusBadgeProps {
  status: AIRequestStatus
  className?: string
}

const LABELS: Record<AIRequestStatus, string> = {
  pending: 'Aguardando',
  preparing: 'Preparando contexto',
  analyzing: 'Analisando',
  validating: 'Validando',
  completed: 'Concluído',
  low_confidence: 'Confiança baixa',
  awaiting_review: 'Aguardando revisão',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
  error: 'Erro',
  rate_limited: 'Limite excedido',
  unavailable: 'Indisponível',
}

const STYLES: Record<AIRequestStatus, string> = {
  pending: 'bg-slate-100 text-slate-700',
  preparing: 'bg-blue-100 text-blue-700',
  analyzing: 'bg-blue-100 text-blue-700',
  validating: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-800',
  low_confidence: 'bg-amber-100 text-amber-800',
  awaiting_review: 'bg-gold/20 text-navy dark:text-gold',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  error: 'bg-red-100 text-red-800',
  rate_limited: 'bg-orange-100 text-orange-800',
  unavailable: 'bg-slate-100 text-slate-600',
}

function AIStatusBadgeInner({ status, className }: AIStatusBadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', STYLES[status], className)}>
      {(status === 'low_confidence' || status === 'error') && <AlertTriangle className="h-3 w-3" />}
      {LABELS[status]}
    </span>
  )
}

export const AIStatusBadge = memo(AIStatusBadgeInner)
