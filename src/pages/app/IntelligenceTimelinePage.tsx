import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTimeline } from '../../hooks/useIntelligence'
import { LoadingState } from '../../components/common/LoadingState'
import { ErrorState } from '../../components/common/ErrorState'
import { TimelineCard } from '../../components/intelligence/TimelineCard'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'

export function IntelligenceTimelinePage() {
  const { session } = useAuth()
  const orgId = session!.organization.id
  const { data: events, isLoading, error, refetch } = useTimeline(orgId)

  if (isLoading) return <LoadingState message="Montando timeline..." />
  if (error) return <ErrorState message="Não foi possível carregar a timeline." onRetry={() => refetch()} />

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/app/intelligence" className="inline-flex items-center gap-2 text-sm text-gold hover:underline">
        <ArrowLeft className="h-4 w-4" /> Voltar ao Intelligence Center
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Timeline Inteligente</CardTitle>
          <p className="text-sm text-text-muted">
            Cliente → Processo → Eventos → Publicações → Prazos → Documentos → Tarefas → Histórico
          </p>
        </CardHeader>
        <div className="mt-4" role="feed" aria-label="Linha do tempo do escritório">
          {events && events.length > 0 ? (
            events.map((e) => <TimelineCard key={e.id} event={e} />)
          ) : (
            <p className="text-sm text-text-muted">Nenhum evento registrado ainda.</p>
          )}
        </div>
      </Card>
    </div>
  )
}
