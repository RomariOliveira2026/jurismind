import { memo } from 'react'
import { cn } from '../../lib/utils'
import type { HealthBand } from '../../intelligence/types'

interface HealthGaugeProps {
  score: number
  label: string
  band: HealthBand
  className?: string
}

const BAND_COLORS: Record<HealthBand, string> = {
  critico: '#ef4444',
  atencao: '#f59e0b',
  bom: '#22c55e',
  excelente: '#D4AF37',
}

function HealthGaugeInner({ score, label, band, className }: HealthGaugeProps) {
  const angle = -90 + (score / 100) * 180
  const color = BAND_COLORS[band]

  return (
    <div
      className={cn('flex flex-col items-center', className)}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Saúde do escritório: ${score}, ${label}`}
    >
      <svg width="200" height="110" viewBox="0 0 200 110" aria-hidden>
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          className="text-slate-200 dark:text-slate-700"
        />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={`${(score / 100) * 251} 251`}
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="100"
          x2={100 + 60 * Math.cos((angle * Math.PI) / 180)}
          y2={100 + 60 * Math.sin((angle * Math.PI) / 180)}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="100" cy="100" r="6" fill={color} />
        <text x="100" y="85" textAnchor="middle" className="fill-navy dark:fill-ice text-2xl font-bold" fontSize="24">
          {score}
        </text>
      </svg>
      <p className="text-sm font-semibold text-navy dark:text-ice">{label}</p>
      <div className="mt-2 flex gap-2 text-[10px] text-text-muted">
        <span>0-40 Crítico</span>
        <span>41-70 Atenção</span>
        <span>71-90 Bom</span>
        <span>91-100 Excelente</span>
      </div>
    </div>
  )
}

export const HealthGauge = memo(HealthGaugeInner)
