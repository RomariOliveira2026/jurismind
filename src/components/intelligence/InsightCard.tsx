import { memo } from 'react'
import { Lightbulb, AlertTriangle, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { InsightItem } from '../../intelligence/types'

interface InsightCardProps {
  insight: InsightItem
  className?: string
}

const ICONS = {
  warning: AlertTriangle,
  info: Lightbulb,
  opportunity: Sparkles,
}

const STYLES = {
  warning: 'border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-900/10',
  info: 'border-slate-200 bg-slate-50/50 dark:border-slate-700 dark:bg-navy-light/50',
  opportunity: 'border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-900/10',
}

function InsightCardInner({ insight, className }: InsightCardProps) {
  const Icon = ICONS[insight.type]
  return (
    <article
      className={cn('flex gap-3 rounded-xl border p-4', STYLES[insight.type], className)}
      aria-label={`Insight: ${insight.text}`}
    >
      <Icon className="h-5 w-5 shrink-0 text-gold mt-0.5" aria-hidden />
      <div>
        <p className="text-sm text-navy dark:text-ice">{insight.text}</p>
        <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wide">Baseado em regras</p>
      </div>
    </article>
  )
}

export const InsightCard = memo(InsightCardInner)
