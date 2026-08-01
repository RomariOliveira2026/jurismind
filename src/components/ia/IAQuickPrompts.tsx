import { QUICK_PROMPTS } from '../../data/iaCopilotDemo'
import { cn } from '../../lib/utils'

interface IAQuickPromptsProps {
  onSelect: (template: string) => void
}

export function IAQuickPrompts({ onSelect }: IAQuickPromptsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {QUICK_PROMPTS.map((prompt) => (
        <button
          key={prompt.id}
          type="button"
          onClick={() => onSelect(prompt.template)}
          className={cn(
            'inline-flex h-8 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5',
            'text-xs font-medium text-navy dark:text-ice dark:border-slate-600 dark:bg-navy-light',
            'cursor-pointer transition-all duration-[160ms]',
            'hover:border-gold/50 hover:bg-gold/5 hover:shadow-[0_0_12px_rgba(212,175,55,0.12)] hover:-translate-y-px',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50',
          )}
        >
          <span className="inline-flex h-4 w-4 items-center justify-center text-sm leading-none" aria-hidden>
            {prompt.emoji}
          </span>
          <span className="leading-none">{prompt.label}</span>
        </button>
      ))}
    </div>
  )
}
