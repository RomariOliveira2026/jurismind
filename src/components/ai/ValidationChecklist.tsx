import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { DEFAULT_VALIDATION_CHECKLIST, type ValidationChecklistItem } from '../../ai/safety/types'

interface ValidationChecklistProps {
  open: boolean
  onClose: () => void
  onConfirm: (checked: Record<string, boolean>) => void
  title?: string
  items?: ValidationChecklistItem[]
}

export function ValidationChecklist({
  open,
  onClose,
  onConfirm,
  title = 'Validação humana obrigatória',
  items = DEFAULT_VALIDATION_CHECKLIST,
}: ValidationChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const requiredItems = items.filter((i) => i.required)
  const allRequiredChecked = requiredItems.every((i) => checked[i.id])

  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-text-muted mb-4">
        Antes de prosseguir, confirme os itens abaixo. Esta ação será registrada para auditoria.
      </p>
      <ul className="space-y-3" role="list">
        {items.map((item) => (
          <li key={item.id}>
            <label className="flex items-start gap-3 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={!!checked[item.id]}
                onChange={() => toggle(item.id)}
                className="mt-1 rounded"
                aria-required={item.required}
              />
              <span>
                {item.label}
                {item.required && <span className="text-red-500 ml-1">*</span>}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex gap-3 justify-end">
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button variant="gold" disabled={!allRequiredChecked} onClick={() => onConfirm(checked)}>
          Confirmar e prosseguir
        </Button>
      </div>
    </Modal>
  )
}
