interface DoughnutSegment {
  label: string
  value: number
  color: string
}

interface DoughnutChartProps {
  segments: DoughnutSegment[]
  className?: string
}

export function DoughnutChart({ segments, className }: DoughnutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  let cumulative = 0
  const stops = segments
    .map((seg) => {
      const start = (cumulative / total) * 100
      cumulative += seg.value
      const end = (cumulative / total) * 100
      return `${seg.color} ${start}% ${end}%`
    })
    .join(', ')

  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center">
        <div
          className="relative h-44 w-44 shrink-0 rounded-full shadow-inner"
          style={{ background: `conic-gradient(${stops})` }}
          role="img"
          aria-label="Gráfico de processos por status"
        >
          <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white dark:bg-navy-light">
            <span className="text-2xl font-bold text-navy dark:text-ice">{total}</span>
            <span className="text-xs text-text-muted">processos</span>
          </div>
        </div>
        <ul className="grid gap-2.5 sm:min-w-[160px]">
          {segments.map((seg) => (
            <li key={seg.label} className="flex items-center justify-between gap-4 text-sm">
              <span className="flex items-center gap-2 text-text-muted dark:text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                {seg.label}
              </span>
              <span className="font-semibold text-navy dark:text-ice">{seg.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
