import { memo } from 'react'
import { cn } from '../../lib/utils'
import type { RiskLevel } from '../../intelligence/types'

interface RiskBadgeProps {
  level: RiskLevel
  score?: number
  className?: string
}

const STYLES: Record<RiskLevel, string> = {
  baixo: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
  medio: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  alto: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
  critico: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
}

const LABELS: Record<RiskLevel, string> = {
  baixo: 'Baixo',
  medio: 'Médio',
  alto: 'Alto',
  critico: 'Crítico',
}

function RiskBadgeInner({ level, score, className }: RiskBadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold', STYLES[level], className)}
      aria-label={`Risco ${LABELS[level]}${score !== undefined ? `, score ${score}` : ''}`}
    >
      {LABELS[level]}
      {score !== undefined && <span className="opacity-75">· {score}</span>}
    </span>
  )
}

export const RiskBadge = memo(RiskBadgeInner)
