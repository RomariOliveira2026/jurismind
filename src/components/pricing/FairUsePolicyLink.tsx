import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'
import {
  FAIR_USE_POLICY_PATH,
  FAIR_USE_POLICY_TITLE,
  FAIR_USE_SUMMARY,
} from '../../lib/aiFairUse'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

interface FairUsePolicyLinkProps {
  className?: string
  children?: React.ReactNode
  showSummaryOnClick?: boolean
}

export function FairUsePolicyLink({
  className,
  children = 'Política de Uso Justo',
  showSummaryOnClick = true,
}: FairUsePolicyLinkProps) {
  const [open, setOpen] = useState(false)

  if (!showSummaryOnClick) {
    return (
      <Link to={FAIR_USE_POLICY_PATH} className={cn('text-gold hover:underline', className)}>
        {children}
      </Link>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn('text-gold hover:underline cursor-pointer', className)}
      >
        {children}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={FAIR_USE_POLICY_TITLE}>
        <p className="text-sm text-text-muted leading-relaxed">{FAIR_USE_SUMMARY}</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Fechar
          </Button>
          <Link to={FAIR_USE_POLICY_PATH} onClick={() => setOpen(false)}>
            <Button variant="gold" size="sm" className="w-full sm:w-auto">
              Ler política completa
            </Button>
          </Link>
        </div>
      </Modal>
    </>
  )
}

export function FairUseFootnote({ className }: { className?: string }) {
  return (
    <p className={cn('text-xs text-text-muted dark:text-slate-400', className)}>
      *Sujeito à{' '}
      <FairUsePolicyLink className="text-xs">
        Política de Uso Justo
      </FairUsePolicyLink>
      .
    </p>
  )
}
