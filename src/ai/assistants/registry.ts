export interface AssistantDefinition {
  id: string
  slug: string
  name: string
  description: string
  purpose: string
  acceptedContexts: string[]
  riskLevel: 'baixo' | 'medio' | 'alto'
  requiresValidation: boolean
  status: 'ativo' | 'preparado' | 'em_breve'
  version: string
  allowedActions: string[]
  route: string
}

export const LEGAL_ASSISTANTS: AssistantDefinition[] = [
  {
    id: 'asst-publicacoes',
    slug: 'publicacoes',
    name: 'Assistente de Publicações',
    description: 'Analisa intimações e publicações com evidências, possíveis prazos e providências.',
    purpose: 'Extrair fatos, interpretações e sugestões a partir de publicações processuais.',
    acceptedContexts: ['publicacao', 'processo'],
    riskLevel: 'alto',
    requiresValidation: true,
    status: 'ativo',
    version: '1.0.0',
    allowedActions: ['analisar', 'criar_prazo', 'criar_tarefa', 'vincular', 'revisar'],
    route: '/app/assistentes/publicacoes',
  },
  {
    id: 'asst-processos',
    slug: 'processos',
    name: 'Assistente de Processos',
    description: 'Opera com dados autorizados do processo para resumos, cronologia e providências.',
    purpose: 'Responder perguntas e gerar análises limitadas ao contexto do processo.',
    acceptedContexts: ['processo'],
    riskLevel: 'medio',
    requiresValidation: true,
    status: 'ativo',
    version: '1.0.0',
    allowedActions: ['resumir', 'cronologia', 'perguntar', 'sugerir'],
    route: '/app/assistentes/processos',
  },
  {
    id: 'asst-documentos',
    slug: 'documentos',
    name: 'Assistente de Documentos',
    description: 'Resume, extrai partes, datas e obrigações de documentos vinculados.',
    purpose: 'Análise assistida de documentos do escritório.',
    acceptedContexts: ['documento', 'processo'],
    riskLevel: 'medio',
    requiresValidation: true,
    status: 'preparado',
    version: '1.0.0',
    allowedActions: ['resumir', 'extrair', 'checklist'],
    route: '/app/assistentes/documentos',
  },
  {
    id: 'asst-contratos',
    slug: 'contratos',
    name: 'Assistente de Contratos',
    description: 'Extrai cláusulas, vigência, valores e pontos de atenção em contratos.',
    purpose: 'Análise estruturada de contratos com ressalvas jurídicas.',
    acceptedContexts: ['documento', 'contrato'],
    riskLevel: 'alto',
    requiresValidation: true,
    status: 'preparado',
    version: '1.0.0',
    allowedActions: ['analisar', 'extrair_clausulas'],
    route: '/app/assistentes/contratos',
  },
  {
    id: 'asst-audiencias',
    slug: 'audiencias',
    name: 'Assistente de Audiências',
    description: 'Prepara pauta, checklist e pontos relevantes para audiências.',
    purpose: 'Organizar preparação de audiências com base nos dados do processo.',
    acceptedContexts: ['processo', 'audiencia'],
    riskLevel: 'medio',
    requiresValidation: true,
    status: 'preparado',
    version: '1.0.0',
    allowedActions: ['preparar', 'checklist', 'pauta'],
    route: '/app/assistentes/audiencias',
  },
  {
    id: 'asst-providencias',
    slug: 'providencias',
    name: 'Assistente de Providências',
    description: 'Sugere possíveis providências com base no conteúdo analisado.',
    purpose: 'Listar ações recomendadas sem executá-las automaticamente.',
    acceptedContexts: ['publicacao', 'processo', 'geral'],
    riskLevel: 'medio',
    requiresValidation: true,
    status: 'ativo',
    version: '1.0.0',
    allowedActions: ['sugerir'],
    route: '/app/ia',
  },
  {
    id: 'asst-rascunhos',
    slug: 'rascunhos',
    name: 'Assistente de Rascunhos',
    description: 'Gera rascunhos iniciais de comunicações e minutas simples.',
    purpose: 'Produzir rascunhos editáveis — nunca petições prontas.',
    acceptedContexts: ['processo', 'cliente', 'geral'],
    riskLevel: 'medio',
    requiresValidation: true,
    status: 'ativo',
    version: '1.0.0',
    allowedActions: ['rascunho', 'editar', 'salvar'],
    route: '/app/assistentes/rascunhos',
  },
  {
    id: 'asst-gestao',
    slug: 'gestao',
    name: 'Assistente de Gestão Jurídica',
    description: 'Apoia organização de rotinas, pendências e prioridades do escritório.',
    purpose: 'Sugerir ações de gestão com base em dados operacionais.',
    acceptedContexts: ['escritorio', 'geral'],
    riskLevel: 'baixo',
    requiresValidation: false,
    status: 'preparado',
    version: '1.0.0',
    allowedActions: ['sugerir', 'priorizar'],
    route: '/app/intelligence',
  },
]

export function getAssistantBySlug(slug: string): AssistantDefinition | undefined {
  return LEGAL_ASSISTANTS.find((a) => a.slug === slug)
}
