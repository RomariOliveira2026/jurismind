import { memo, useMemo } from 'react'
import { cn } from '../../lib/utils'
import type { WeeklyDayStat } from '../../intelligence/types'

interface ProductivityChartProps {
  days: WeeklyDayStat[]
  className?: string
}

function ProductivityChartInner({ days, className }: ProductivityChartProps) {
  const maxVal = useMemo(
    () => Math.max(...days.map((d) => Math.max(d.deadlines, d.productivity, d.newClients, d.newCases)), 1),
    [days],
  )

  return (
    <div className={cn('space-y-4', className)} role="img" aria-label="Gráfico de produtividade semanal">
      <div className="flex items-end justify-between gap-2 h-40">
        {days.map((d) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-1 h-full justify-end">
            <div className="flex w-full gap-0.5 items-end justify-center h-32">
              <div
                className="w-2 rounded-t bg-gold/80 transition-all"
                style={{ height: `${(d.productivity / maxVal) * 100}%` }}
                title={`Produtividade: ${d.productivity}`}
                aria-hidden
              />
              <div
                className="w-2 rounded-t bg-navy/60 dark:bg-ice/40 transition-all"
                style={{ height: `${(d.deadlines / maxVal) * 100}%` }}
                title={`Prazos: ${d.deadlines}`}
                aria-hidden
              />
            </div>
            <span className="text-[10px] text-text-muted capitalize">{d.label}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 text-xs text-text-muted justify-center">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-gold/80" /> Produtividade</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-navy/60 dark:bg-ice/40" /> Prazos</span>
      </div>
    </div>
  )
}

export const ProductivityChart = memo(ProductivityChartInner)
