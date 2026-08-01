import { cn } from '../../lib/utils'
import type { LucideIcon } from 'lucide-react'
import { Sparkline } from '../dashboard/Sparkline'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendDirection?: 'up' | 'down' | 'neutral'
  sparkline?: number[]
  context?: string
  className?: string
  iconClassName?: string
}

const trendColors = {
  up: 'text-emerald-600 dark:text-emerald-400',
  down: 'text-red-600 dark:text-red-400',
  neutral: 'text-text-muted dark:text-slate-500',
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = 'neutral',
  sparkline,
  context,
  className,
  iconClassName,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'group relative flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm',
        'transition-all duration-[180ms] ease-out cursor-pointer',
        'hover:-translate-y-[3px] hover:border-navy/15 hover:shadow-[0_6px_16px_rgba(11,31,58,0.09)]',
        'dark:border-slate-700 dark:bg-navy-light dark:hover:border-gold/25 dark:hover:shadow-[0_6px_16px_rgba(0,0,0,0.25)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-text-muted dark:text-slate-400">{title}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-navy dark:text-ice">{value}</p>
          {trend && (
            <p className={cn('mt-1 text-xs font-medium', trendColors[trendDirection])}>{trend}</p>
          )}
        </div>
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10',
            iconClassName,
          )}
        >
          <Icon className="h-5 w-5 text-gold" aria-hidden />
        </div>
      </div>

      <div className="mt-auto pt-3">
        {sparkline && sparkline.length > 1 && (
          <div className="opacity-60 group-hover:opacity-90 transition-opacity duration-[180ms]">
            <Sparkline data={sparkline} />
          </div>
        )}
        {context && (
          <p className="mt-1.5 text-[10px] leading-tight text-text-muted dark:text-slate-500">{context}</p>
        )}
        <p className="mt-1 text-xs font-medium text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-[180ms]">
          Ver detalhes →
        </p>
      </div>
    </div>
  )
}
