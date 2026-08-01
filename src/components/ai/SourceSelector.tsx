import { memo } from 'react'
import { cn } from '../../lib/utils'

export interface SourceOption {
  id: string
  label: string
  enabled: boolean
  size?: string
}

interface SourceSelectorProps {
  sources: SourceOption[]
  onChange: (id: string, enabled: boolean) => void
  className?: string
}

function SourceSelectorInner({ sources, onChange, className }: SourceSelectorProps) {
  return (
    <div className={cn('space-y-2', className)} role="group" aria-label="Selecionar fontes de contexto">
      <p className="text-sm font-medium text-navy dark:text-ice">Fontes permitidas para a IA</p>
      {sources.map((s) => (
        <label key={s.id} className="flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-navy-light">
          <input
            type="checkbox"
            checked={s.enabled}
            onChange={(e) => onChange(s.id, e.target.checked)}
            className="rounded"
          />
          <span className="text-sm flex-1">{s.label}</span>
          {s.size && <span className="text-xs text-text-muted">{s.size}</span>}
        </label>
      ))}
      <p className="text-xs text-text-muted">A IA só utilizará fontes explicitamente permitidas.</p>
    </div>
  )
}

export const SourceSelector = memo(SourceSelectorInner)
