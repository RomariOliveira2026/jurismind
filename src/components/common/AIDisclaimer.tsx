import { Shield } from 'lucide-react'
import { AI_LEGAL_WARNING } from '../../lib/helpers'

export function AIDisclaimer({ className = '' }: { className?: string }) {
  return (
    <div className={`flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200 ${className}`}>
      <Shield className="h-4 w-4 shrink-0 mt-0.5" />
      <p>{AI_LEGAL_WARNING}</p>
    </div>
  )
}
