import { cn } from '../../lib/utils'
import type { ReactNode } from 'react'

type BadgeVariant = 'default' | 'urgente' | 'proximo' | 'futuro' | 'concluido' | 'gold' | 'outline'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-text dark:bg-slate-700 dark:text-ice',
  urgente: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  proximo: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  futuro: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  concluido: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  gold: 'bg-gold/20 text-gold dark:bg-gold/30',
  outline: 'border border-slate-300 text-text dark:border-slate-600 dark:text-ice',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function statusToBadge(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    urgente: 'urgente',
    proximo: 'proximo',
    futuro: 'futuro',
    concluido: 'concluido',
    ativo: 'futuro',
    suspenso: 'proximo',
    arquivado: 'default',
    encerrado: 'concluido',
    alta: 'urgente',
    media: 'proximo',
    baixa: 'default',
  }
  return map[status] || 'default'
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    urgente: 'Urgente',
    proximo: 'Próximo',
    futuro: 'Futuro',
    concluido: 'Concluído',
    ativo: 'Ativo',
    suspenso: 'Suspenso',
    arquivado: 'Arquivado',
    encerrado: 'Encerrado',
    alta: 'Alta',
    media: 'Média',
    baixa: 'Baixa',
  }
  return map[status] || status
}
