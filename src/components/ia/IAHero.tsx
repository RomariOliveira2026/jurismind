import { Brain, Sparkles } from 'lucide-react'
import { IA_LAST_UPDATE } from '../../data/iaCopilotDemo'

export function IAHero() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-white via-white to-gold/[0.04] p-4 shadow-sm dark:border-slate-700 dark:from-navy-light dark:via-navy-light dark:to-gold/[0.06] sm:p-5">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/[0.06] blur-2xl" aria-hidden />
      <div className="relative flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-3.5 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 border border-gold/25 shadow-sm">
            <Brain className="h-6 w-6 text-gold" aria-hidden />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-navy dark:text-ice flex items-center gap-2">
              IA Jurídica
              <Sparkles className="h-5 w-5 text-gold shrink-0" aria-hidden />
            </h1>
            <p className="mt-1 text-sm text-text-muted dark:text-slate-300 max-w-2xl leading-relaxed">
              Seu copiloto jurídico inteligente para analisar, interpretar e gerar documentos jurídicos com Inteligência Artificial especializada.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start lg:items-end gap-1.5 shrink-0 lg:text-right">
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50 ai-pulse-soft" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">IA Online</span>
          </div>
          <p className="text-xs text-text-muted dark:text-slate-400">
            Modelo:{' '}
            <span className="font-semibold text-navy dark:text-slate-200">JurisMind Legal AI v2</span>
          </p>
          <p className="text-[11px] text-text-muted dark:text-slate-500">
            Última sincronização: {IA_LAST_UPDATE}
          </p>
        </div>
      </div>
    </div>
  )
}
