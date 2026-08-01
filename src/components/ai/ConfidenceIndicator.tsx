import { memo } from 'react'
import { cn } from '../../lib/utils'
import { confidenceBand } from '../../ai/safety/confidenceEngine'

interface ConfidenceIndicatorProps {
  score: number
  className?: string
  showDisclaimer?: boolean
}

const BAND_STYLES = {
  baixa: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300',
  moderada: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300',
  alta: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300',
  muito_alta: 'bg-gold/20 text-navy border-gold/40 dark:text-gold',
}

function ConfidenceIndicatorInner({ score, className, showDisclaimer = true }: ConfidenceIndicatorProps) {
  const band = confidenceBand(score)
  const labels = { baixa: 'Confiança baixa', moderada: 'Confiança moderada', alta: 'Confiança alta', muito_alta: 'Confiança muito alta' }

  return (
    <div className={cn('space-y-1', className)} role="status" aria-label={`${labels[band]}: ${score} de 100`}>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', band === 'baixa' ? 'bg-red-500' : band === 'moderada' ? 'bg-amber-500' : band === 'alta' ? 'bg-green-500' : 'bg-gold')}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className={cn('rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap', BAND_STYLES[band])}>
          {score} — {labels[band]}
        </span>
      </div>
      {showDisclaimer && (
        <p className="text-[10px] text-text-muted">O score indica qualidade dos dados analisados, não garantia de correção jurídica.</p>
      )}
    </div>
  )
}

export const ConfidenceIndicator = memo(ConfidenceIndicatorInner)
