import { RefreshCw } from 'lucide-react'

interface SyncBadgeProps {
  sources: string
  relativeTime: string
}

export function SyncBadge({ sources, relativeTime }: SyncBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs text-text-muted shadow-sm dark:border-slate-700 dark:bg-navy-light/80 dark:text-slate-400">
      <RefreshCw className="h-3 w-3 text-gold shrink-0" />
      <span>
        <span className="font-medium text-navy dark:text-slate-300">Última sincronização</span>
        {' · '}
        {sources}
        {' · '}
        {relativeTime}
      </span>
    </div>
  )
}
