import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'
import type { PriorityItem } from '../../intelligence/types'

interface PriorityCardProps {
  item: PriorityItem
  className?: string
}

const LEVEL_STYLES = {
  maxima: {
    dot: '🔴',
    border: 'border-red-300 dark:border-red-800',
    bg: 'bg-red-50/30 dark:bg-red-950/20',
    title: 'text-red-700 dark:text-red-400',
  },
  atencao: {
    dot: '🟡',
    border: 'border-amber-300 dark:border-amber-800',
    bg: 'bg-amber-50/30 dark:bg-amber-950/20',
    title: 'text-amber-700 dark:text-amber-400',
  },
  oportunidade: {
    dot: '🟢',
    border: 'border-green-300 dark:border-green-800',
    bg: 'bg-green-50/30 dark:bg-green-950/20',
    title: 'text-green-700 dark:text-green-400',
  },
}

function PriorityCardInner({ item, className }: PriorityCardProps) {
  const s = LEVEL_STYLES[item.level]
  return (
    <article
      className={cn('rounded-xl border p-5', s.border, s.bg, className)}
      aria-label={`Prioridade ${item.title}: ${item.description}`}
    >
      <p className={cn('text-xs font-bold uppercase tracking-wider', s.title)}>
        {s.dot} {item.title}
      </p>
      <p className="mt-2 text-sm text-navy dark:text-ice">{item.description}</p>
      <Link to={item.actionLink} className="inline-block mt-4">
        <Button variant="outline" size="sm">{item.actionLabel}</Button>
      </Link>
    </article>
  )
}

export const PriorityCard = memo(PriorityCardInner)
