import { Shield } from 'lucide-react'
import { cn } from '../../lib/utils'

export function AIWarningBanner({ className = '', demo = false }: { className?: string; demo?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border border-gold/30 bg-gold/5 px-4 py-3',
        className,
      )}
      role="alert"
    >
      <Shield className="h-5 w-5 text-gold shrink-0 mt-0.5" aria-hidden />
      <div>
        <p className="text-sm font-medium text-navy dark:text-ice">
          Análise assistida por inteligência artificial. Revise integralmente antes de utilizar.
        </p>
        {demo && (
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
            Resultado demonstrativo — não gerado por análise jurídica real.
          </p>
        )}
      </div>
    </div>
  )
}
