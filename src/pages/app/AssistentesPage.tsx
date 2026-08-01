import { LEGAL_ASSISTANTS } from '../../ai/assistants/registry'
import { AssistantCard } from '../../components/ai/AssistantCard'
import { AIWarningBanner } from '../../components/ai/AIWarningBanner'
import { Sparkles } from 'lucide-react'

export function AssistentesPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl gradient-navy p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-gold" />
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">JurisMind Safe AI</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Assistentes Jurídicos</h2>
        <p className="mt-2 text-sm text-slate-300">
          Ferramentas especializadas com evidências, validação humana e rastreabilidade — não um chat genérico.
        </p>
      </div>

      <AIWarningBanner />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {LEGAL_ASSISTANTS.map((a) => (
          <AssistantCard key={a.id} assistant={a} />
        ))}
      </div>
    </div>
  )
}
