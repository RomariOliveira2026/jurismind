import { memo } from 'react'
import { Link } from 'react-router-dom'
import {
  User, Briefcase, Newspaper, Clock, FileText, CheckSquare, Activity,
} from 'lucide-react'
import { formatDateBR } from '../../lib/helpers'
import { cn } from '../../lib/utils'
import type { TimelineEvent, TimelineEventType } from '../../intelligence/types'
import { Button } from '../ui/Button'

interface TimelineCardProps {
  event: TimelineEvent
  className?: string
}

const ICONS: Record<TimelineEventType, typeof User> = {
  client: User,
  case: Briefcase,
  publication: Newspaper,
  deadline: Clock,
  document: FileText,
  task: CheckSquare,
  activity: Activity,
}

const TYPE_LABELS: Record<TimelineEventType, string> = {
  client: 'Cliente',
  case: 'Processo',
  publication: 'Publicação',
  deadline: 'Prazo',
  document: 'Documento',
  task: 'Tarefa',
  activity: 'Histórico',
}

function TimelineCardInner({ event, className }: TimelineCardProps) {
  const Icon = ICONS[event.type]
  return (
    <article
      className={cn('relative flex gap-4 pl-8 pb-8 border-l-2 border-gold/30 last:pb-0', className)}
      aria-label={`${TYPE_LABELS[event.type]}: ${event.title}`}
    >
      <div className="absolute -left-[9px] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-gold ring-4 ring-ice dark:ring-navy" aria-hidden>
        <Icon className="h-2.5 w-2.5 text-navy" />
      </div>
      <div className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-navy-light">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">{TYPE_LABELS[event.type]}</span>
          <time className="text-xs text-text-muted" dateTime={event.date}>{formatDateBR(event.date)}</time>
        </div>
        <h4 className="mt-1 font-medium text-navy dark:text-ice">{event.title}</h4>
        <p className="mt-1 text-sm text-text-muted line-clamp-2">{event.description}</p>
        {event.responsible && (
          <p className="mt-2 text-xs text-text-muted">Responsável: {event.responsible}</p>
        )}
        {event.link && (
          <Link to={event.link} className="inline-block mt-3">
            <Button variant="ghost" size="sm">Detalhes</Button>
          </Link>
        )}
      </div>
    </article>
  )
}

export const TimelineCard = memo(TimelineCardInner)
