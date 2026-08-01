import { Brain, ShieldCheck } from 'lucide-react'
import { IA_SOURCES } from '../../data/iaCopilotDemo'
import { cn } from '../../lib/utils'

export function IASidePanel() {
  const stats = [
    { label: 'Modelo', value: 'Legal AI v2' },
    { label: 'Status', value: 'Online' },
    { label: 'Tempo médio', value: '3 segundos' },
  ]

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl gradient-navy border border-gold/25 p-4 shadow-sm',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_20px_rgba(212,175,55,0.05)]',
        'transition-all duration-[180ms] hover:-translate-y-0.5 hover:shadow-md',
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold/[0.04] via-transparent to-transparent" aria-hidden />

      <div className="relative">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/15 border border-gold/20">
              <Brain className="h-5 w-5 text-gold" aria-hidden />
            </div>
            <h2 className="text-base font-semibold text-white">JurisMind AI</h2>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 border border-emerald-500/30 shrink-0">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50 ai-pulse-soft" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[9px] font-medium text-emerald-400 whitespace-nowrap">AI Engine Online</span>
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-2 mb-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg bg-white/5 border border-white/10 px-2 py-1.5">
              <dt className="text-[9px] text-slate-400">{s.label}</dt>
              <dd className="text-xs font-semibold text-white mt-0.5">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mb-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium text-slate-300">Precisão da IA</span>
            <span className="text-sm font-bold text-gold tabular-nums">98,7%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-[98.7%] rounded-full bg-gradient-to-r from-gold/80 to-gold" />
          </div>
        </div>

        <div className="mb-3">
          <p className="text-[10px] font-medium text-slate-400 mb-1.5">Fontes utilizadas</p>
          <div className="flex flex-wrap gap-1">
            {IA_SOURCES.map((source) => (
              <span
                key={source}
                className="rounded-md bg-white/5 border border-white/10 px-1.5 py-0.5 text-[9px] text-slate-300"
              >
                {source}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" aria-hidden />
          <span className="text-[10px] font-medium text-emerald-400">Análise baseada em evidências</span>
        </div>
      </div>
    </div>
  )
}
