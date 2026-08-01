import { cn } from '../../lib/utils'

interface SparklineProps {
  data: number[]
  className?: string
  color?: string
}

export function Sparkline({ data, className, color = '#d4af37' }: SparklineProps) {
  if (data.length < 2) return null

  const width = 80
  const height = 24
  const padding = 2
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data
    .map((v, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2)
      const y = height - padding - ((v - min) / range) * (height - padding * 2)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('h-6 w-20', className)}
      aria-hidden
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        opacity={0.85}
      />
    </svg>
  )
}
