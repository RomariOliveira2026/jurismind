import { memo } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { RecommendationItem } from '../../intelligence/types'

interface RecommendationCardProps {
  items: RecommendationItem[]
  className?: string
}

function RecommendationCardInner({ items, className }: RecommendationCardProps) {
  return (
    <div className={cn('space-y-2', className)} role="list" aria-label="Recomendações inteligentes">
      {items.map((item) => (
        <div
          key={item.id}
          role="listitem"
          className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-navy-light"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-gold mt-0.5" aria-hidden />
          {item.link ? (
            <Link to={item.link} className="text-sm text-navy hover:text-gold dark:text-ice transition-colors">
              {item.text}
            </Link>
          ) : (
            <span className="text-sm text-navy dark:text-ice">{item.text}</span>
          )}
        </div>
      ))}
    </div>
  )
}

export const RecommendationCard = memo(RecommendationCardInner)
