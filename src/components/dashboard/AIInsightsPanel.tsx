import { Link } from 'react-router-dom'
import { Brain, Sparkles } from 'lucide-react'
import { AI_INSIGHTS } from '../../data/dashboardEnterprise'
import { useCountUp } from '../../hooks/useCountUp'
import { cn } from '../../lib/utils'

interface AIInsightsPanelProps {
  compact?: boolean
  className?: string
}

function AnimatedMetric({ label, target, decimals = 0 }: { label: string; target: number; decimals?: number }) {
  const display = useCountUp(target, 700, decimals)
  return (
    <div className="rounded-lg bg-white/5 px-2.5 py-2 border border-white/10">
      <p className="text-[10px] text-slate-300 leading-tight line-clamp-2">{label}</p>
      <p className="text-base sm:text-lg font-bold text-white mt-0.5 tabular-nums">{display}</p>
    </div>
  )
}

export function AIInsightsPanel({ compact, className }: AIInsightsPanelProps) {
  const accuracy = useCountUp(98.7, 700, 1)

  const metrics = [
    { label: 'Publicações analisadas hoje', value: AI_INSIGHTS.publicationsToday },
    { label: 'Prazos identificados automaticamente', value: AI_INSIGHTS.deadlinesIdentified },
    { label: 'Riscos críticos encontrados', value: AI_INSIGHTS.criticalRisks },
    { label: 'Sugestões geradas', value: AI_INSIGHTS.suggestions },
  ]

  return (
    <div
      className={cn(
        'rounded-xl gradient-navy border border-gold/25',
        'shadow-[0_0_0_1px_rgba(212,175,55,0.12),0_0_16px_rgba(212,175,55,0.06)]',
        'transition-shadow duration-[180ms] hover:shadow-[0_0_0_1px_rgba(212,175,55,0.18),0_0_20px_rgba(212,175,55,0.08)]',
        compact ? 'p-4 h-full flex flex-col min-w-0' : 'p-5',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 border border-gold/20">
            <Brain className="h-5 w-5 text-gold" aria-hidden />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-1.5">
              <span className="truncate">JurisMind AI Insights</span>
              <Sparkles className="h-3.5 w-3.5 text-gold shrink-0" aria-hidden />
            </h3>
            {!compact && (
              <p className="text-xs text-slate-300">Análise assistida em tempo real</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/30 shrink-0">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 ai-pulse-soft" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[10px] font-medium text-emerald-400 whitespace-nowrap">AI Engine Online</span>
        </div>
      </div>

      <div className={cn('grid gap-2 flex-1', compact ? 'grid-cols-2' : 'sm:grid-cols-2 gap-2.5')}>
        {metrics.map((m) => (
          <AnimatedMetric key={m.label} label={m.label} target={m.value} />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-lg bg-gold/10 px-3 py-2.5 border border-gold/35 shadow-[inset_0_1px_0_rgba(212,175,55,0.1)]">
        <span className="text-xs font-medium text-slate-200">Precisão da IA</span>
        <span className="text-lg sm:text-xl font-bold text-gold tracking-tight tabular-nums">{accuracy}%</span>
      </div>

      <Link
        to="/app/assistentes"
        className="mt-2.5 block text-center text-xs font-medium text-gold/90 hover:text-gold hover:underline transition-colors duration-[180ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:rounded"
      >
        Ver análises pendentes →
      </Link>
    </div>
  )
}
