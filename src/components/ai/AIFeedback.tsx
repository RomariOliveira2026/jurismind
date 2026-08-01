import { memo } from 'react'
import { ThumbsUp, ThumbsDown, AlertOctagon, HelpCircle } from 'lucide-react'
import type { FeedbackType } from '../../ai/safety/types'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

const OPTIONS: { type: FeedbackType; label: string; icon: typeof ThumbsUp }[] = [
  { type: 'util', label: 'Útil', icon: ThumbsUp },
  { type: 'parcial', label: 'Parcial', icon: HelpCircle },
  { type: 'incompleta', label: 'Incompleta', icon: HelpCircle },
  { type: 'incorreta', label: 'Incorreta', icon: ThumbsDown },
  { type: 'perigosa', label: 'Perigosa', icon: AlertOctagon },
]

interface AIFeedbackProps {
  onSubmit: (type: FeedbackType, comments?: string) => void
  className?: string
}

function AIFeedbackInner({ onSubmit, className }: AIFeedbackProps) {
  return (
    <div className={cn('space-y-3', className)} role="group" aria-label="Feedback da análise">
      <p className="text-sm font-medium text-navy dark:text-ice">Esta análise foi útil?</p>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map(({ type, label, icon: Icon }) => (
          <Button key={type} variant="outline" size="sm" onClick={() => onSubmit(type)}>
            <Icon className="h-4 w-4" /> {label}
          </Button>
        ))}
      </div>
    </div>
  )
}

export const AIFeedback = memo(AIFeedbackInner)
