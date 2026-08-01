import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  variant?: 'danger' | 'primary'
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  variant = 'primary',
  loading,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-text-muted dark:text-slate-400 mb-6">{message}</p>
      <div className="flex gap-3">
        <Button variant="secondary" fullWidth onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant={variant === 'danger' ? 'primary' : 'gold'}
          fullWidth
          onClick={onConfirm}
          disabled={loading}
          className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
        >
          {loading ? 'Aguarde...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
