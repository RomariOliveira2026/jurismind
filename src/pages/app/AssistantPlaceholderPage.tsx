import { Link } from 'react-router-dom'
import { ArrowLeft, Construction } from 'lucide-react'
import { AIWarningBanner } from '../../components/ai/AIWarningBanner'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

export function AssistantPlaceholderPage({ name, description }: { name: string; description: string }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <Link to="/app/assistentes" className="inline-flex items-center gap-2 text-sm text-gold hover:underline">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <AIWarningBanner />
      <Card className="text-center py-12">
        <Construction className="h-12 w-12 text-gold mx-auto mb-4" />
        <h2 className="text-xl font-bold text-navy dark:text-ice">{name}</h2>
        <p className="text-sm text-text-muted mt-2">{description}</p>
        <p className="text-xs text-amber-600 mt-4">Arquitetura preparada — interface em evolução nesta sprint.</p>
        <Link to="/app/assistentes/publicacoes" className="inline-block mt-6">
          <Button variant="gold" size="sm">Usar Assistente de Publicações</Button>
        </Link>
      </Card>
    </div>
  )
}
