import {
  Calendar,
  FileText,
  Clock,
  Users,
  Paperclip,
  type LucideIcon,
} from 'lucide-react'
import type { DashboardActivity } from '../../data/dashboardEnterprise'
import { cn } from '../../lib/utils'

const actionIcons: Record<DashboardActivity['type'], LucideIcon> = {
  processo: FileText,
  prazo: Clock,
  publicacao: FileText,
  documento: Paperclip,
  cliente: Users,
  alerta: Clock,
  audiencia: Calendar,
}

const actionColors: Record<DashboardActivity['type'], string> = {
  processo: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  prazo: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  publicacao: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  documento: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  cliente: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  alerta: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  audiencia: 'bg-gold/20 text-gold',
}

interface ActivityFeedProps {
  activities: DashboardActivity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="space-y-4">
      {activities.map((a) => {
        const Icon = actionIcons[a.type]
        return (
          <div key={a.id} className="group flex gap-3">
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                'bg-navy/5 text-navy dark:bg-white/10 dark:text-ice',
              )}
              title={a.actor}
            >
              {a.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2">
                <span
                  className={cn(
                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded',
                    actionColors[a.type],
                  )}
                >
                  <Icon className="h-3 w-3" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-navy dark:text-ice leading-snug">{a.text}</p>
                  <p className="text-xs text-text-muted mt-0.5">{a.relativeTime}</p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
