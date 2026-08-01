import { memo } from 'react'
import { cn } from '../../lib/utils'

interface ScoreCircleProps {
  score: number
  label: string
  subtitle?: string
  size?: 'md' | 'lg'
  className?: string
}

function ScoreCircleInner({ score, label, subtitle, size = 'lg', className }: ScoreCircleProps) {
  const dim = size === 'lg' ? 160 : 120
  const stroke = size === 'lg' ? 10 : 8
  const radius = (dim - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const color =
    score >= 91 ? 'text-green-500' : score >= 71 ? 'text-gold' : score >= 41 ? 'text-amber-500' : 'text-red-500'

  return (
    <div
      className={cn('flex flex-col items-center', className)}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`JurisMind IQ: ${score} de 100, ${label}`}
    >
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="-rotate-90" aria-hidden>
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-slate-200 dark:text-slate-700"
          />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn('transition-all duration-700', color)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-bold text-navy dark:text-ice', size === 'lg' ? 'text-4xl' : 'text-2xl')}>
            {score}
          </span>
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold text-navy dark:text-ice">{label}</p>
      {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
    </div>
  )
}

export const ScoreCircle = memo(ScoreCircleInner)
