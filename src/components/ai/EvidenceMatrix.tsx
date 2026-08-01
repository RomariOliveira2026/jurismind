import { memo } from 'react'
import type { EvidenceItem } from '../../ai/safety/types'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/utils'

const TYPE_LABELS = {
  fato: 'FATO EXTRAÍDO',
  interpretacao: 'INTERPRETAÇÃO',
  sugestao: 'SUGESTÃO',
  incerteza: 'INCERTEZA',
}

const TYPE_STYLES = {
  fato: 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/10',
  interpretacao: 'border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-900/10',
  sugestao: 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10',
  incerteza: 'border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10',
}

const SOURCE_LABELS: Record<string, string> = {
  publicacao: 'Publicação',
  documento: 'Documento',
  processo: 'Processo',
  prazo: 'Prazo',
  tarefa: 'Tarefa',
  usuario: 'Dado informado',
  regra_interna: 'Regra interna',
  inferencia: 'Inferência da IA',
}

function EvidenceMatrixInner({ items }: { items: EvidenceItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-text-muted">Nenhuma evidência registrada para esta análise.</p>
  }

  return (
    <div className="overflow-x-auto" role="table" aria-label="Matriz de evidências">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700 text-left text-xs text-text-muted">
            <th className="pb-2 pr-3">Afirmação</th>
            <th className="pb-2 pr-3 hidden md:table-cell">Origem</th>
            <th className="pb-2 pr-3 hidden lg:table-cell">Trecho</th>
            <th className="pb-2 pr-3">Tipo</th>
            <th className="pb-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className={cn('border-b border-slate-100 dark:border-slate-800', TYPE_STYLES[item.evidenceType])}>
              <td className="py-3 pr-3 text-navy dark:text-ice">{item.claim}</td>
              <td className="py-3 pr-3 hidden md:table-cell text-text-muted">{SOURCE_LABELS[item.sourceType] || item.sourceType}</td>
              <td className="py-3 pr-3 hidden lg:table-cell text-xs text-text-muted line-clamp-2">{item.sourceExcerpt || '—'}</td>
              <td className="py-3 pr-3"><Badge variant="futuro">{TYPE_LABELS[item.evidenceType]}</Badge></td>
              <td className="py-3 text-xs capitalize">{item.reviewStatus.replace('_', ' ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const EvidenceMatrix = memo(EvidenceMatrixInner)
