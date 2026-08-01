import { useState } from 'react'
import { Brain, Sparkles } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { ScoreCircle } from '../../components/intelligence/ScoreCircle'

const QUESTIONS = [
  'Como o escritório controla prazos?',
  'Como recebe publicações?',
  'Quais áreas jurídicas atende?',
  'Quantos membros possui?',
  'Quais ferramentas utiliza?',
  'Quais tarefas consomem mais tempo?',
  'Qual o maior receio em relação à IA?',
  'Qual rotina deveria ser automatizada primeiro?',
  'Existem modelos internos aprovados?',
  'Existe política de revisão humana?',
]

const OPTIONS = ['Manual', 'Parcialmente digital', 'Totalmente digital']

export function AIDiagnosticPage() {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [result, setResult] = useState<number | null>(null)

  const handleSubmit = () => {
    const values = Object.values(answers)
    const score = values.length > 0 ? Math.round((values.reduce((a, b) => a + b, 0) / (values.length * 3)) * 100) : 0
    setResult(score)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-2xl gradient-navy p-6">
        <div className="flex items-center gap-2 mb-2"><Sparkles className="h-5 w-5 text-gold" /><span className="text-xs text-gold uppercase tracking-widest">Diagnóstico</span></div>
        <h2 className="text-2xl font-bold text-white">Maturidade em Inteligência Jurídica</h2>
        <p className="text-sm text-slate-300 mt-2">Este diagnóstico é orientativo e separado do JurisMind IQ.</p>
      </div>

      {!result ? (
        <Card>
          <CardHeader><div className="flex items-center gap-2"><Brain className="h-5 w-5 text-gold" /><CardTitle>Questionário</CardTitle></div></CardHeader>
          <div className="space-y-6">
            {QUESTIONS.map((q, i) => (
              <div key={q}>
                <p className="text-sm font-medium mb-2">{i + 1}. {q}</p>
                <div className="flex flex-wrap gap-2">
                  {OPTIONS.map((opt, idx) => (
                    <button
                      key={opt}
                      onClick={() => setAnswers((prev) => ({ ...prev, [i]: idx + 1 }))}
                      className={`rounded-lg border px-3 py-1.5 text-xs cursor-pointer ${answers[i] === idx + 1 ? 'border-gold bg-gold/10 text-gold' : 'border-slate-200 dark:border-slate-700'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <Button variant="gold" onClick={handleSubmit}>Gerar diagnóstico</Button>
          </div>
        </Card>
      ) : (
        <Card className="flex flex-col items-center py-8">
          <ScoreCircle score={result} label={result >= 70 ? 'Avançado' : result >= 40 ? 'Em evolução' : 'Inicial'} subtitle="Maturidade em IA Jurídica" />
          <div className="mt-6 w-full max-w-md space-y-2 text-sm">
            <p className="font-semibold">Plano sugerido:</p>
            <ol className="list-decimal pl-5 space-y-1 text-text-muted">
              <li>Organizar dados e processos</li>
              <li>Padronizar revisão humana</li>
              <li>Automatizar publicações e prazos</li>
              <li>Governar uso da IA</li>
              <li>Evoluir com assistentes especializados</li>
            </ol>
          </div>
          <Button variant="outline" className="mt-4" onClick={() => { setResult(null); setAnswers({}) }}>Refazer</Button>
        </Card>
      )}
    </div>
  )
}
