import { Clock } from 'lucide-react'
import { IA_HISTORY } from '../../data/iaCopilotDemo'
import { cn } from '../../lib/utils'

interface IAHistoryProps {
  onSelect?: (title: string) => void
}

const STATUS_STYLES = {
  concluida: { dot: 'bg-emerald-500', label: 'Concluída', text: 'text-emerald-600 dark:text-emerald-400' },
  em_andamento: { dot: 'bg-amber-500', label: 'Em andamento', text: 'text-amber-600 dark:text-amber-400' },
}

export function IAHistory({ onSelect }: IAHistoryProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-3.5 dark:border-slate-700 dark:bg-navy-light transition-all duration-[180ms] hover:-translate-y-0.5 hover:shadow-md">
      <h2 className="text-sm font-semibold text-navy dark:text-ice mb-2.5">Últimas análises</h2>
      <ul className="space-y-1">
        {IA_HISTORY.map((item) => {
          const Icon = item.icon
          const status = STATUS_STYLES[item.status]
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect?.(item.title)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2 py-2 text-left cursor-pointer',
                  'transition-all duration-[180ms] hover:border-slate-200 hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-sm',
                  'dark:hover:border-slate-600 dark:hover:bg-navy/50',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50',
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/10 border border-gold/10">
                  <Icon className="h-4 w-4 text-gold" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-navy dark:text-ice truncate leading-tight">{item.title}</p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                    <p className="flex items-center gap-1 text-[10px] text-text-muted dark:text-slate-500">
                      <Clock className="h-3 w-3 shrink-0" aria-hidden />
                      {item.date} · {item.relativeTime}
                    </p>
                    <span className={cn('inline-flex items-center gap-1 text-[10px] font-medium', status.text)}>
                      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', status.dot)} aria-hidden />
                      {status.label}
                    </span>
                  </div>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
