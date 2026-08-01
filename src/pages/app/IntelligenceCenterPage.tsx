import { Link } from 'react-router-dom'
import { memo } from 'react'
import {
  Sparkles, Clock, Calendar, Newspaper, Briefcase, CheckSquare,
  Settings, GitBranch, Info,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useIntelligence } from '../../hooks/useIntelligence'
import { LoadingState } from '../../components/common/LoadingState'
import { ErrorState } from '../../components/common/ErrorState'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { ScoreCircle } from '../../components/intelligence/ScoreCircle'
import { HealthGauge } from '../../components/intelligence/HealthGauge'
import { PriorityCard } from '../../components/intelligence/PriorityCard'
import { InsightCard } from '../../components/intelligence/InsightCard'
import { RecommendationCard } from '../../components/intelligence/RecommendationCard'
import { RiskBadge } from '../../components/intelligence/RiskBadge'
import { ProductivityChart } from '../../components/intelligence/ProductivityChart'
import { formatDateBR } from '../../lib/helpers'

function greeting(name: string): string {
  const h = new Date().getHours()
  const period = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
  const first = name.split(' ')[0]
  return `${period}, Dr(a). ${first}`
}

function formatWorkTime(minutes: number): string {
  if (minutes < 60) return `~${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `~${h}h ${m}min` : `~${h}h`
}

const SummaryItem = memo(function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock
  label: string
  value: number
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 backdrop-blur-sm">
      <Icon className="h-4 w-4 text-gold shrink-0" aria-hidden />
      <span className="text-xs text-slate-200">{label}</span>
      <span className="ml-auto text-sm font-bold text-white">{value}</span>
    </div>
  )
})

export function IntelligenceCenterPage() {
  const { session } = useAuth()
  const orgId = session!.organization.id
  const { data, isLoading, error, refetch } = useIntelligence(orgId)

  if (isLoading) return <LoadingState message="Analisando seu escritório..." />
  if (error || !data) return <ErrorState message="Não foi possível carregar o Intelligence Center." onRetry={() => refetch()} />

  const today = formatDateBR(new Date().toISOString().split('T')[0])
  const { daySummary, iq, health, priorities, recommendations, insights, criticalProcesses, weekly } = data

  return (
    <div className="space-y-6 pb-8">
      {/* Header premium */}
      <section className="rounded-2xl gradient-navy p-6 lg:p-8 shadow-xl" aria-labelledby="ic-greeting">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-gold" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">Intelligence Center</span>
            </div>
            <h2 id="ic-greeting" className="text-2xl lg:text-3xl font-bold text-white">
              {greeting(session!.profile.fullName)}
            </h2>
            <p className="mt-1 text-sm text-slate-300">Hoje é {today}</p>
            {data.dataSource === 'simulated' && (
              <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-xs text-amber-200">
                <Info className="h-3 w-3" /> Poucos dados — análise baseada em regras configuráveis
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/app/intelligence/timeline">
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                <GitBranch className="h-4 w-4" /> Timeline
              </Button>
            </Link>
            <Link to="/app/intelligence/configuracoes">
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                <Settings className="h-4 w-4" /> Configurações
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2" role="list" aria-label="Resumo do dia">
          <SummaryItem icon={Clock} label="Prazos hoje" value={daySummary.deadlinesToday} />
          <SummaryItem icon={Calendar} label="Audiências" value={daySummary.hearings} />
          <SummaryItem icon={Newspaper} label="Publicações" value={daySummary.publications} />
          <SummaryItem icon={Briefcase} label="Processos críticos" value={daySummary.criticalCases} />
          <SummaryItem icon={CheckSquare} label="Tarefas" value={daySummary.tasksToday} />
        </div>
      </section>

      {/* IQ + Health */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="flex flex-col items-center py-8">
          <CardHeader className="w-full text-center border-0 pb-0">
            <CardTitle>JurisMind IQ</CardTitle>
          </CardHeader>
          <ScoreCircle score={iq.score} label={iq.label} subtitle="Índice operacional do escritório" />
          <div className="mt-6 w-full max-w-md space-y-3 px-4">
            {iq.increases.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">↑ Por que subiu</p>
                <ul className="text-xs text-text-muted space-y-0.5">
                  {iq.increases.slice(0, 3).map((r) => <li key={r}>• {r}</li>)}
                </ul>
              </div>
            )}
            {iq.decreases.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">↓ Por que caiu</p>
                <ul className="text-xs text-text-muted space-y-0.5">
                  {iq.decreases.slice(0, 3).map((r) => <li key={r}>• {r}</li>)}
                </ul>
              </div>
            )}
          </div>
        </Card>

        <Card className="flex flex-col items-center py-8">
          <CardHeader className="w-full text-center border-0 pb-0">
            <CardTitle>Índice de Saúde do Escritório</CardTitle>
          </CardHeader>
          <HealthGauge score={health.score} label={health.label} band={health.band} />
          <ul className="mt-4 w-full max-w-md px-4 space-y-1" aria-label="Indicadores de saúde">
            {health.indicators.slice(0, 4).map((ind) => (
              <li key={ind.name} className="flex justify-between text-xs text-text-muted">
                <span>{ind.name}</span>
                <span>{ind.impact}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Radar Jurídico */}
      <Card className="border-gold/20 bg-gradient-to-br from-white to-gold/5 dark:from-navy-light dark:to-gold/5">
        <CardHeader>
          <CardTitle className="text-xl">Radar Jurídico</CardTitle>
          <p className="text-sm text-text-muted">Prioridades ordenadas por urgência — geradas por regras, não por IA generativa</p>
        </CardHeader>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {priorities.length === 0 ? (
            <p className="text-sm text-text-muted col-span-full">Nenhuma prioridade no momento.</p>
          ) : (
            priorities.map((p) => <PriorityCard key={p.id} item={p} />)
          )}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Processos críticos */}
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle>Processos Críticos — Top 10</CardTitle></CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Ranking de processos críticos">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-left text-xs text-text-muted">
                  <th className="pb-2 pr-4">Cliente</th>
                  <th className="pb-2 pr-4">Processo</th>
                  <th className="pb-2 pr-4">Score</th>
                  <th className="pb-2 pr-4 hidden sm:table-cell">Dias parado</th>
                  <th className="pb-2 hidden md:table-cell">Próximo prazo</th>
                </tr>
              </thead>
              <tbody>
                {criticalProcesses.map((c) => (
                  <tr key={c.caseId} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 pr-4 text-navy dark:text-ice">{c.clientName || '—'}</td>
                    <td className="py-3 pr-4">
                      <Link to={`/app/processos/${c.caseId}`} className="font-mono text-xs text-gold hover:underline">
                        {c.caseNumber}
                      </Link>
                    </td>
                    <td className="py-3 pr-4"><RiskBadge level={c.level} score={c.score} /></td>
                    <td className="py-3 pr-4 hidden sm:table-cell text-text-muted">{c.daysIdle}d</td>
                    <td className="py-3 hidden md:table-cell text-text-muted">
                      {c.nextDeadline ? formatDateBR(c.nextDeadline) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recomendações */}
        <Card>
          <CardHeader><CardTitle>Recomendações Inteligentes</CardTitle></CardHeader>
          <RecommendationCard items={recommendations} />
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
          <p className="text-xs text-text-muted">Frases geradas por engine de regras — preparado para IA futura</p>
        </CardHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          {insights.map((ins) => <InsightCard key={ins.id} insight={ins} />)}
        </div>
      </Card>

      {/* Resumo do dia + semanal */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Resumo do Dia</CardTitle></CardHeader>
          <ul className="space-y-2 text-sm" aria-label="Resumo do dia">
            <li className="flex justify-between"><span>✔ Prazos</span><strong>{daySummary.deadlinesToday}</strong></li>
            <li className="flex justify-between"><span>✔ Tarefas</span><strong>{daySummary.tasksToday}</strong></li>
            <li className="flex justify-between"><span>✔ Audiências</span><strong>{daySummary.hearings}</strong></li>
            <li className="flex justify-between"><span>✔ Clientes ativos</span><strong>{daySummary.clientsActive}</strong></li>
            <li className="flex justify-between"><span>✔ Processos ativos</span><strong>{daySummary.casesActive}</strong></li>
          </ul>
          <p className="mt-4 rounded-lg bg-gold/10 px-4 py-3 text-sm text-navy dark:text-ice">
            Tempo estimado de trabalho hoje: <strong>{formatWorkTime(daySummary.estimatedWorkMinutes)}</strong>
          </p>
        </Card>

        <Card>
          <CardHeader><CardTitle>Resumo Semanal</CardTitle></CardHeader>
          <ProductivityChart days={weekly.days} />
        </Card>
      </div>
    </div>
  )
}
