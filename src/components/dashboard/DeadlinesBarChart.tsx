import { useEffect, useMemo, useState } from 'react'
import { cn } from '../../lib/utils'

interface BarItem {
  label: string
  value: number
}

interface DeadlinesBarChartProps {
  items: BarItem[]
  className?: string
}

function buildYTicks(max: number) {
  const ceiling = Math.ceil(max / 15) * 15 || 15
  const step = ceiling <= 30 ? 10 : 15
  const ticks: number[] = []
  for (let v = 0; v <= ceiling; v += step) ticks.push(v)
  if (ticks[ticks.length - 1] < ceiling) ticks.push(ceiling)
  return ticks
}

export function DeadlinesBarChart({ items, className }: DeadlinesBarChartProps) {
  const maxValue = Math.max(...items.map((i) => i.value), 1)
  const yTicks = useMemo(() => buildYTicks(maxValue), [maxValue])
  const yMax = yTicks[yTicks.length - 1] || maxValue
  const [hovered, setHovered] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <figure className={cn('relative m-0', className)}>
      <div className="flex h-40 sm:h-44 gap-2">
        <div
          className="flex w-5 shrink-0 flex-col justify-between py-0.5 text-right"
          aria-hidden
        >
          {[...yTicks].reverse().map((tick) => (
            <span key={tick} className="text-[9px] sm:text-[10px] text-text-muted dark:text-slate-500 leading-none">
              {tick}
            </span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1 flex flex-col">
          <div className="relative flex-1">
            {yTicks.map((tick) => (
              <div
                key={tick}
                className="pointer-events-none absolute left-0 right-0 border-t border-slate-100 dark:border-slate-700/60"
                style={{ bottom: `${(tick / yMax) * 100}%` }}
              />
            ))}

            <div className="relative z-10 flex h-full items-end justify-between gap-1.5 sm:gap-3 px-0.5">
              {items.map((item, index) => {
                const heightPct = Math.max(6, (item.value / yMax) * 100)
                const isHovered = hovered === index
                const tooltipId = `bar-tooltip-${index}`

                return (
                  <div
                    key={item.label}
                    className="relative flex flex-1 flex-col items-center justify-end h-full min-w-0"
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(index)}
                    onBlur={() => setHovered(null)}
                    tabIndex={0}
                    role="graphics-symbol"
                    aria-label={`${item.label}: ${item.value} prazos`}
                    aria-describedby={isHovered ? tooltipId : undefined}
                  >
                    {isHovered && (
                      <div
                        id={tooltipId}
                        role="tooltip"
                        className="absolute bottom-full mb-1.5 z-20 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-center shadow-sm dark:border-slate-600 dark:bg-navy-light"
                      >
                        <p className="text-[10px] text-text-muted dark:text-slate-400">{item.label}</p>
                        <p className="text-xs font-semibold text-navy dark:text-ice">{item.value} prazos</p>
                      </div>
                    )}

                    <span
                      className={cn(
                        'mb-1 text-[11px] sm:text-xs font-semibold text-navy dark:text-ice transition-opacity duration-[180ms]',
                        isHovered ? 'opacity-100' : 'opacity-75',
                      )}
                    >
                      {item.value}
                    </span>

                    <div className="flex w-full max-w-[44px] sm:max-w-[60px] h-full items-end">
                      <div
                        className={cn(
                          'w-full rounded-t-md bg-[#c9a432] dark:bg-gold/80',
                          'shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]',
                          'transition-[filter,opacity] duration-[180ms]',
                          isHovered && 'brightness-105 opacity-100',
                          !isHovered && 'opacity-90',
                        )}
                        style={{
                          height: mounted ? `${heightPct}%` : '0%',
                          transition: mounted ? 'height 0.6s cubic-bezier(0.22, 1, 0.36, 1)' : undefined,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-1.5 border-t border-slate-200 dark:border-slate-600" />
          <div className="flex justify-between gap-1 sm:gap-2 pt-1.5">
            {items.map((item) => (
              <span
                key={item.label}
                className="flex-1 text-center text-[10px] sm:text-xs text-text-muted dark:text-slate-400 truncate"
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
      <figcaption className="sr-only">
        Gráfico de prazos dos próximos 30 dias com valores {items.map((i) => `${i.label} ${i.value}`).join(', ')}
      </figcaption>
    </figure>
  )
}
