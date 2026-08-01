import type { LucideIcon } from 'lucide-react'
import {
  FileText,
  Scale,
  Mail,
  ScrollText,
  BookOpen,
  ListChecks,
} from 'lucide-react'

export const IA_MAX_CHARS = 50_000
export const IA_LAST_UPDATE = 'há 2 minutos'

export const RESULT_META = {
  time: '2,3 s',
  confidence: 98,
  sources: ['CNJ', 'STJ', 'STF', 'TRTs', 'Código Civil', 'CPC'],
}

export interface QuickPrompt {
  id: string
  emoji: string
  label: string
  template: string
}

export const QUICK_PROMPTS: QuickPrompt[] = [
  { id: 'qp-1', emoji: '📄', label: 'Resumir decisão', template: 'Resuma de forma objetiva a seguinte decisão judicial, destacando dispositivo e fundamentos:\n\n' },
  { id: 'qp-2', emoji: '⚖️', label: 'Analisar contrato', template: 'Analise o contrato abaixo quanto a cláusulas abusivas, riscos e pontos de atenção:\n\n' },
  { id: 'qp-3', emoji: '📅', label: 'Extrair prazos', template: 'Identifique todos os prazos processuais mencionados no documento:\n\n' },
  { id: 'qp-4', emoji: '📬', label: 'Interpretar publicação', template: 'Interprete a publicação/intimação abaixo e indique providências necessárias:\n\n' },
  { id: 'qp-5', emoji: '📝', label: 'Gerar minuta', template: 'Com base no contexto abaixo, elabore minuta de manifestação processual:\n\n' },
  { id: 'qp-6', emoji: '📚', label: 'Explicar jurisprudência', template: 'Explique de forma didática a jurisprudência ou precedente citado:\n\n' },
  { id: 'qp-7', emoji: '🔍', label: 'Encontrar riscos', template: 'Identifique riscos jurídicos, processuais e materiais no documento:\n\n' },
  { id: 'qp-8', emoji: '📌', label: 'Listar providências', template: 'Liste as providências recomendadas com base no documento:\n\n' },
]

export interface HistoryItem {
  id: string
  title: string
  date: string
  relativeTime: string
  icon: LucideIcon
  status: 'concluida' | 'em_andamento'
}

export const IA_HISTORY: HistoryItem[] = [
  { id: 'h-1', title: 'Contrato de Locação', date: '31/07/2026', relativeTime: 'há 12 min', icon: FileText, status: 'concluida' },
  { id: 'h-2', title: 'Contestação João Silva', date: '31/07/2026', relativeTime: 'há 1 hora', icon: Scale, status: 'em_andamento' },
  { id: 'h-3', title: 'Publicação TRT20', date: '30/07/2026', relativeTime: 'há 3 horas', icon: Mail, status: 'concluida' },
  { id: 'h-4', title: 'Embargos de Declaração', date: '30/07/2026', relativeTime: 'há 5 horas', icon: ScrollText, status: 'concluida' },
  { id: 'h-5', title: 'Mandado de Segurança', date: '29/07/2026', relativeTime: 'ontem', icon: BookOpen, status: 'concluida' },
  { id: 'h-6', title: 'Inventário — partilha', date: '28/07/2026', relativeTime: 'há 2 dias', icon: ListChecks, status: 'em_andamento' },
]

export const IA_SOURCES = [
  'CNJ', 'STJ', 'STF', 'TRTs', 'TJs', 'LGPD',
  'Código Civil', 'Código Penal', 'CPC', 'CPP',
]

export const DEMO_ANALYSIS = {
  summary:
    'Trata-se de intimação para manifestação em cumprimento de sentença, no prazo de 15 dias úteis, nos autos de ação de indenização por danos materiais e morais. O executado foi intimado a pagar o valor de R$ 48.750,00, acrescido de correção monetária e juros, sob pena de penhora.',
  mainPoints: [
    'Intimação para pagamento voluntário em 15 dias úteis.',
    'Valor principal: R$ 48.750,00 com encargos legais.',
    'Possibilidade de impugnação ao cumprimento de sentença.',
    'Recomendada verificação de cálculos e termo inicial.',
  ],
  deadlines: [
    { label: 'Manifestação / pagamento', date: '15 dias úteis', status: 'urgente' as const },
    { label: 'Impugnação ao cumprimento', date: '15 dias úteis após intimação', status: 'proximo' as const },
  ],
  risks: [
    { level: 'alto' as const, text: 'Penhora de ativos em caso de inércia.' },
    { level: 'medio' as const, text: 'Possível majoração por mora se não houver pagamento.' },
  ],
  actions: [
    'Comunicar o cliente sobre a intimação e valores.',
    'Conferir memória de cálculo e atualização monetária.',
    'Avaliar impugnação ou proposta de acordo.',
    'Registrar prazo no sistema após conferência manual.',
  ],
  confidence: 98,
}
