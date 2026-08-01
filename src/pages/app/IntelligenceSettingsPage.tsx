import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import {
  DEFAULT_INTELLIGENCE_WEIGHTS,
  getIntelligenceWeights,
  saveIntelligenceWeights,
  resetIntelligenceWeights,
  WEIGHT_LABELS,
  type IntelligenceWeights,
} from '../../intelligence'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export function IntelligenceSettingsPage() {
  const { session } = useAuth()
  const { success } = useToast()
  const queryClient = useQueryClient()
  const [weights, setWeights] = useState<IntelligenceWeights>(getIntelligenceWeights)

  const total = Object.values(weights).reduce((s, v) => s + v, 0)

  const handleChange = (key: keyof IntelligenceWeights, value: string) => {
    const n = Math.max(0, Math.min(100, parseInt(value, 10) || 0))
    setWeights((prev) => ({ ...prev, [key]: n }))
  }

  const handleSave = () => {
    saveIntelligenceWeights(weights)
    queryClient.invalidateQueries({ queryKey: ['intelligence', session!.organization.id] })
    success('Pesos salvos com sucesso.')
  }

  const handleReset = () => {
    resetIntelligenceWeights()
    setWeights({ ...DEFAULT_INTELLIGENCE_WEIGHTS })
    queryClient.invalidateQueries({ queryKey: ['intelligence', session!.organization.id] })
    success('Pesos restaurados para o padrão.')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/app/intelligence" className="inline-flex items-center gap-2 text-sm text-gold hover:underline">
        <ArrowLeft className="h-4 w-4" /> Voltar ao Intelligence Center
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Intelligence Settings</CardTitle>
          <p className="text-sm text-text-muted">
            Configure os pesos do JurisMind IQ e do Índice de Saúde. Total recomendado: 100%.
          </p>
        </CardHeader>

        <div className="space-y-4">
          {(Object.keys(WEIGHT_LABELS) as (keyof IntelligenceWeights)[]).map((key) => (
            <div key={key} className="flex items-center gap-4">
              <label htmlFor={`weight-${key}`} className="flex-1 text-sm text-navy dark:text-ice">
                {WEIGHT_LABELS[key]}
              </label>
              <div className="flex items-center gap-2 w-28">
                <Input
                  id={`weight-${key}`}
                  type="number"
                  min={0}
                  max={100}
                  value={String(weights[key])}
                  onChange={(e) => handleChange(key, e.target.value)}
                  aria-label={`Peso ${WEIGHT_LABELS[key]}`}
                />
                <span className="text-sm text-text-muted">%</span>
              </div>
            </div>
          ))}
        </div>

        <p className={`mt-4 text-sm ${total === 100 ? 'text-green-600' : 'text-amber-600'}`} role="status">
          Total: {total}% {total !== 100 && '(será normalizado ao salvar)'}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="gold" onClick={handleSave}>Salvar pesos</Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" /> Restaurar padrão
          </Button>
        </div>
      </Card>
    </div>
  )
}
