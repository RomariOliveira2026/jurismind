import { AlertTriangle } from 'lucide-react'
import { DEMO_BANNER_TEXT } from '../../lib/helpers'

export function DemoBanner() {
  return (
    <div className="flex items-center justify-center gap-2 bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-center text-xs font-medium text-amber-800 dark:text-amber-300">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      {DEMO_BANNER_TEXT}
    </div>
  )
}
