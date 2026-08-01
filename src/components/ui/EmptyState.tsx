import { cn } from '../../lib/utils'
import type { LucideIcon } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-16 px-6 text-center dark:border-slate-600 dark:bg-navy/50',
        className,
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
        <Icon className="h-7 w-7 text-gold" />
      </div>
      <h3 className="text-lg font-semibold text-navy dark:text-ice">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-text-muted dark:text-slate-400">{description}</p>
      {actionLabel && onAction && (
        <Button variant="gold" className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
