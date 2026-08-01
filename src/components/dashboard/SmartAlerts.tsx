import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { Card } from '../ui/Card'
import type { SmartAlert } from '../../data/dashboardEnterprise'
import { cn } from '../../lib/utils'

interface SmartAlertsProps {
  alerts: SmartAlert[]
}

const colorStyles = {
  red: {
    border: 'border-red-200/60 dark:border-red-900/40',
    bg: 'bg-red-50/50 dark:bg-red-950/20',
    hover: 'hover:bg-red-50/80 hover:border-red-300/70 dark:hover:bg-red-950/35',
    badge: 'text-red-700 dark:text-red-400',
  },
  amber: {
    border: 'border-amber-200/60 dark:border-amber-900/40',
    bg: 'bg-amber-50/50 dark:bg-amber-950/20',
    hover: 'hover:bg-amber-50/80 hover:border-amber-300/70 dark:hover:bg-amber-950/35',
    badge: 'text-amber-700 dark:text-amber-400',
  },
  blue: {
    border: 'border-blue-200/60 dark:border-blue-900/40',
    bg: 'bg-blue-50/50 dark:bg-blue-950/20',
    hover: 'hover:bg-blue-50/80 hover:border-blue-300/70 dark:hover:bg-blue-950/35',
    badge: 'text-blue-700 dark:text-blue-400',
  },
}

export function SmartAlerts({ alerts }: SmartAlertsProps) {
  return (
    <Card
      padding="sm"
      className="border-amber-200/60 bg-amber-50/30 dark:border-amber-900/40 dark:bg-amber-950/10"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-navy dark:text-ice leading-none">Alertas Inteligentes</h3>
            <ul className="mt-2 space-y-1.5">
              {alerts.map((alert) => {
                const style = colorStyles[alert.color]
                return (
                  <li
                    key={alert.id}
                    className={cn(
                      'flex min-h-[48px] items-center gap-3 rounded-lg border px-3 py-2',
                      'transition-all duration-[180ms]',
                      style.border,
                      style.bg,
                      style.hover,
                    )}
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center text-base leading-none"
                      aria-hidden
                    >
                      {alert.emoji}
                    </span>
                    <div className="min-w-0 flex-1 py-0.5">
                      <p className={cn('text-xs font-semibold leading-none', style.badge)}>{alert.category}</p>
                      <p className="text-sm text-text-muted dark:text-slate-400 leading-snug mt-1">{alert.message}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        <Link
          to="/app/prazos"
          className="shrink-0 self-start text-xs font-medium text-gold hover:underline transition-opacity duration-[180ms] pt-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:rounded"
        >
          Ver todos →
        </Link>
      </div>
    </Card>
  )
}
