import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Plus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useDashboard } from '../../hooks/useDashboard'
import { StatCard } from '../../components/ui/StatCard'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { buttonStyles } from '../../components/ui/Button'
import { LoadingState } from '../../components/common/LoadingState'
import { ErrorState } from '../../components/common/ErrorState'
import { DoughnutChart } from '../../components/dashboard/DoughnutChart'
import { DeadlinesBarChart } from '../../components/dashboard/DeadlinesBarChart'
import { SmartAlerts } from '../../components/dashboard/SmartAlerts'
import { AIInsightsPanel } from '../../components/dashboard/AIInsightsPanel'
import { SystemStatus } from '../../components/dashboard/SystemStatus'
import { ActivityFeed } from '../../components/dashboard/ActivityFeed'
import { deadlineStatusVariant } from '../../lib/labels'
import { formatDateBR } from '../../lib/helpers'
import {
  DASHBOARD_KPIS,
  DASHBOARD_LAST_UPDATE,
  CASE_STATUS_CHART,
  DEADLINES_30_CHART,
  SMART_ALERTS,
  URGENT_DEADLINES,
  DASHBOARD_ACTIVITIES,
} from '../../data/dashboardEnterprise'

function urgentBadgeVariant(item: (typeof URGENT_DEADLINES)[0]) {
  if (item.priority === 'urgente') return 'urgente' as const
  if (item.priority === 'revisao') return 'gold' as const
  return deadlineStatusVariant(item.status)
}

export function DashboardPage() {
  const { session } = useAuth()
  const orgId = session!.organization.id
  const { data, isLoading, error, refetch } = useDashboard(orgId)

  if (isLoading) return <LoadingState message="Carregando dashboard..." />
  if (error) return <ErrorState message="Não foi possível carregar o dashboard." onRetry={() => refetch()} />

  const recentCases = data?.recentCases ?? []

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-xs text-text-muted dark:text-slate-500">
          Última atualização: {DASHBOARD_LAST_UPDATE}
        </p>
        <SystemStatus syncTime="há 2 minutos" />
      </div>

      <SmartAlerts alerts={SMART_ALERTS} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {DASHBOARD_KPIS.map((kpi) => (
          <Link
            key={kpi.title}
            to={kpi.href}
            className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 rounded-xl"
          >
            <StatCard
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              trend={kpi.trend}
              trendDirection={kpi.trendDirection}
              sparkline={kpi.sparkline}
              context={kpi.context}
              className="h-full"
            />
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card hover className="shadow-sm" padding="sm">
          <CardHeader className="mb-2">
            <CardTitle>Processos por Status</CardTitle>
          </CardHeader>
          <DoughnutChart segments={CASE_STATUS_CHART} />
        </Card>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <Card hover className="shadow-sm min-w-0" padding="sm">
            <CardHeader className="mb-2">
              <CardTitle className="text-base">Prazos dos próximos 30 dias</CardTitle>
            </CardHeader>
            <DeadlinesBarChart items={DEADLINES_30_CHART} />
          </Card>
          <AIInsightsPanel compact className="min-w-0" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          to="/app/assistentes/publicacoes"
          className={buttonStyles('gold', 'sm', false, 'h-9 px-3.5 gap-2 transition-opacity duration-[180ms] hover:opacity-95 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2')}
        >
          <Brain className="h-4 w-4 shrink-0" aria-hidden />Analisar publicação
        </Link>
        <Link
          to="/app/processos"
          className={buttonStyles('outline', 'sm', false, 'h-9 px-3.5 gap-2 border transition-colors duration-[180ms] hover:bg-navy/5 focus-visible:ring-2 focus-visible:ring-navy/30 focus-visible:ring-offset-2 dark:focus-visible:ring-gold/40')}
        >
          <Plus className="h-4 w-4 shrink-0" aria-hidden />Novo processo
        </Link>
        <Link
          to="/app/prazos"
          className={buttonStyles('outline', 'sm', false, 'h-9 px-3.5 gap-2 border transition-colors duration-[180ms] hover:bg-navy/5 focus-visible:ring-2 focus-visible:ring-navy/30 focus-visible:ring-offset-2 dark:focus-visible:ring-gold/40')}
        >
          <Plus className="h-4 w-4 shrink-0" aria-hidden />Novo prazo
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm" hover>
          <CardHeader className="mb-3">
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Prazos urgentes</CardTitle>
              <Link to="/app/prazos" className="text-xs font-medium text-gold hover:underline">Ver todos</Link>
            </div>
          </CardHeader>
          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {URGENT_DEADLINES.map((d) => (
              <Link
                key={d.id}
                to="/app/prazos"
                className="group relative flex flex-col gap-2 rounded-lg border border-slate-100 p-4 transition-all duration-[180ms] hover:border-gold/30 hover:bg-slate-50 hover:shadow-sm dark:border-slate-700 dark:hover:bg-navy/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant={urgentBadgeVariant(d)}>{d.statusLabel}</Badge>
                    <span className="text-xs text-text-muted">{d.daysLabel}</span>
                  </div>
                  <p className="font-medium text-navy dark:text-ice truncate">{d.title}</p>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-text-muted">
                    <span>{d.clientName}</span>
                    <span className="font-mono">{d.caseNumber}</span>
                    <span>{formatDateBR(d.deadlineDate)}</span>
                    <span className="hidden sm:inline">· {d.responsible}</span>
                  </div>
                </div>
                <span className="shrink-0 text-xs font-medium text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-[180ms] sm:ml-4">
                  Abrir processo →
                </span>
              </Link>
            ))}
          </div>
        </Card>

        <Card hover className="shadow-sm">
          <CardHeader className="mb-3"><CardTitle>Atividades recentes</CardTitle></CardHeader>
          <ActivityFeed activities={DASHBOARD_ACTIVITIES} />
        </Card>
      </div>

      {recentCases.length > 0 && (
        <Card hover className="shadow-sm">
          <CardHeader><CardTitle>Processos atualizados recentemente</CardTitle></CardHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {recentCases.map((c) => (
              <Link
                key={c.id}
                to={`/app/processos/${c.id}`}
                className="rounded-lg border border-slate-100 p-4 transition-all duration-[180ms] hover:border-gold/30 hover:shadow-sm dark:border-slate-700"
              >
                <p className="font-medium text-navy dark:text-ice">{c.title}</p>
                <p className="text-xs font-mono text-text-muted mt-1">{c.caseNumber}</p>
                <p className="text-xs text-text-muted">{c.clientName}</p>
              </Link>
            ))}
          </div>
        </Card>
      )}

      <div className="rounded-xl gradient-navy p-6 shadow-md transition-shadow duration-[180ms] hover:shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Brain className="h-8 w-8 text-gold" />
            <div>
              <h3 className="text-lg font-semibold text-white">Analisar nova publicação com IA</h3>
              <p className="text-sm text-slate-300">Cole uma intimação e identifique prazos e riscos.</p>
            </div>
          </div>
          <Link to="/app/assistentes/publicacoes" className={buttonStyles('gold', 'md')}>
            Analisar agora <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
