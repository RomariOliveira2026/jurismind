import type { ReactNode } from 'react'
import {
  FileText,
  List,
  Calendar,
  AlertTriangle,
  ListChecks,
  Gauge,
  Copy,
  Save,
  Brain,
  Clock,
} from 'lucide-react'
import type { AILegalResult } from '../../services/aiLegalService'
import { DEMO_ANALYSIS, RESULT_META } from '../../data/iaCopilotDemo'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

interface IAResultCardProps {
  result: AILegalResult | null
  isDemo?: boolean
  copied: boolean
  onCopy: () => void
  authorName?: string
  createdAt?: string
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof FileText
  title: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-lg border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-navy/40',
        'transition-all duration-[180ms] hover:-translate-y-0.5 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600',
      )}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 border border-gold/15">
          <Icon className="h-4 w-4 text-gold shrink-0" aria-hidden />
        </div>
        <h3 className="text-sm font-semibold text-navy dark:text-ice">{title}</h3>
      </div>
      {children}
    </div>
  )
}

export function IAResultCard({ result, isDemo, copied, onCopy, authorName, createdAt }: IAResultCardProps) {
  const confidence = result?.confidence
    ? Math.round(result.confidence * 100)
    : isDemo
      ? RESULT_META.confidence
      : DEMO_ANALYSIS.confidence

  const summary = result?.summary || (isDemo ? DEMO_ANALYSIS.summary : result?.content?.slice(0, 300))
  const mainPoints = isDemo || !result
    ? DEMO_ANALYSIS.mainPoints
    : result.content.split('\n').filter(Boolean).slice(0, 4)

  const deadlines = isDemo || !result?.suggestedDeadline
    ? DEMO_ANALYSIS.deadlines
    : [{ label: 'Prazo identificado', date: result.suggestedDeadline, status: 'urgente' as const }]

  const risks = isDemo || !result
    ? DEMO_ANALYSIS.risks
    : result.warnings.map((w) => ({ level: 'medio' as const, text: w }))

  const actions = isDemo || !result?.suggestedAction
    ? DEMO_ANALYSIS.actions
    : [result.suggestedAction, ...result.content.split('\n').filter((l) => /^\d+\./.test(l))].filter(Boolean).slice(0, 4)

  const sources = RESULT_META.sources

  return (
    <div
      className={cn(
        'rounded-xl border bg-white shadow-sm dark:bg-navy-light transition-all duration-[180ms] hover:-translate-y-0.5 hover:shadow-md',
        isDemo ? 'border-slate-200 dark:border-slate-700' : 'border-gold/30',
      )}
    >
      <div className="border-b border-slate-100 dark:border-slate-700 px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 border border-gold/20">
              <Brain className="h-5 w-5 text-gold" aria-hidden />
            </div>
            <div>
              <h2 className="text-base font-semibold text-navy dark:text-ice">Análise concluída</h2>
              {isDemo && (
                <p className="text-[11px] text-text-muted dark:text-slate-500 mt-0.5">
                  Exemplo demonstrativo — execute uma análise para resultados reais
                </p>
              )}
              {result && !isDemo && (
                <p className="text-[11px] text-text-muted dark:text-slate-500 mt-0.5">
                  {result.title}{createdAt ? ` · ${createdAt}` : ''}{authorName ? ` · ${authorName}` : ''}
                </p>
              )}
            </div>
          </div>

          {!isDemo && result && (
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={onCopy} className="h-8 gap-1.5">
                <Copy className="h-3.5 w-3.5" aria-hidden />
                {copied ? 'Copiado!' : 'Copiar'}
              </Button>
              <Button variant="ghost" size="sm" className="h-8 gap-1.5">
                <Save className="h-3.5 w-3.5" aria-hidden />
                Salvar
              </Button>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <span className="inline-flex items-center gap-1.5 text-text-muted dark:text-slate-400">
            <Clock className="h-3.5 w-3.5 text-gold" aria-hidden />
            <span className="font-medium text-navy dark:text-slate-300">Tempo:</span> {RESULT_META.time}
          </span>
          <span className="inline-flex items-center gap-1.5 text-text-muted dark:text-slate-400">
            <Gauge className="h-3.5 w-3.5 text-gold" aria-hidden />
            <span className="font-medium text-navy dark:text-slate-300">Confiança:</span>{' '}
            <span className="font-semibold text-gold">{confidence}%</span>
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-medium text-navy dark:text-slate-300">Fontes:</span>
            {sources.map((s) => (
              <span
                key={s}
                className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-text dark:border-slate-600 dark:bg-navy/50 dark:text-slate-300"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-xs font-medium text-text-muted dark:text-slate-500 mb-3">Resultado da análise</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Section icon={FileText} title="Resumo">
            <p className="text-sm text-text dark:text-slate-200 leading-relaxed">{summary}</p>
          </Section>

          <Section icon={List} title="Principais pontos">
            <ul className="space-y-2">
              {mainPoints.map((point) => (
                <li key={point} className="flex gap-2 text-sm text-text dark:text-slate-200">
                  <span className="text-gold shrink-0 font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={Calendar} title="Prazos encontrados">
            <ul className="space-y-2.5">
              {deadlines.map((d) => (
                <li key={d.label} className="flex items-center justify-between gap-2">
                  <span className="text-sm text-text dark:text-slate-200">{d.label}</span>
                  <Badge variant={d.status === 'urgente' ? 'urgente' : 'proximo'}>{d.date}</Badge>
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={AlertTriangle} title="Riscos identificados">
            <ul className="space-y-2.5">
              {risks.map((r) => (
                <li key={r.text} className="flex items-start gap-2 text-sm">
                  <Badge variant={r.level === 'alto' ? 'urgente' : 'proximo'} className="shrink-0 mt-0.5">
                    {r.level === 'alto' ? 'Alto' : 'Médio'}
                  </Badge>
                  <span className="text-text dark:text-slate-200">{r.text}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={ListChecks} title="Providências sugeridas">
            <ol className="space-y-2 list-decimal list-inside">
              {actions.map((action) => (
                <li key={action} className="text-sm text-text dark:text-slate-200">{action}</li>
              ))}
            </ol>
          </Section>

          <Section icon={Gauge} title="Nível de confiança">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold/80 to-gold transition-all duration-700"
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <span className="text-lg font-bold text-gold tabular-nums">{confidence}%</span>
            </div>
          </Section>
        </div>

        {result && !isDemo && result.disclaimer && (
          <p className="mt-4 text-xs text-text-muted dark:text-slate-500 italic border-t border-slate-100 dark:border-slate-700 pt-3">
            {result.disclaimer}
          </p>
        )}
      </div>
    </div>
  )
}
