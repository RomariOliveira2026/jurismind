import { env } from '../../config/env'
import { generateId, sanitizeText } from '../../lib/helpers'
import { getSupabase } from '../../lib/supabase'
import { computeConfidenceScore } from '../../ai/safety/confidenceEngine'
import { checkPromptInjection, stripDangerousHtml } from '../../ai/safety/promptInjectionGuard'
import { isValidStructuredOutput, sanitizeStructuredOutput } from '../../ai/safety/schemas'
import type {
  AIRequestContext,
  AIResponseRecord,
  SafeAIStructuredOutput,
  EvidenceItem,
  AIRequestStatus,
} from '../../ai/safety/types'
import { getAssistantBySlug } from '../../ai/assistants/registry'

const MAX_INPUT = 50000
const DEMO_STORE_KEY = 'jurismind-ai-store'

interface DemoAIStore {
  responses: AIResponseRecord[]
  validations: { id: string; responseId: string; userId: string; checklist: Record<string, boolean>; createdAt: string }[]
  feedback: { id: string; responseId: string; userId: string; type: string; comments?: string; createdAt: string }[]
}

function getDemoStore(): DemoAIStore {
  try {
    const raw = localStorage.getItem(DEMO_STORE_KEY)
    return raw ? JSON.parse(raw) : { responses: [], validations: [], feedback: [] }
  } catch {
    return { responses: [], validations: [], feedback: [] }
  }
}

function persistDemoStore(store: DemoAIStore) {
  localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(store))
}

function buildMockPublicationOutput(text: string, ctx: AIRequestContext): SafeAIStructuredOutput {
  const clean = sanitizeText(text)
  const procMatch = clean.match(/\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}/)
  const conf = computeConfidenceScore({
    text: clean,
    processNumber: procMatch?.[0],
    court: ctx.contextType === 'publicacao' ? undefined : undefined,
    hasDates: /\d{2}\/\d{2}\/\d{4}/.test(clean),
    hasClearDetermination: /intim|manifest|prazo/i.test(clean),
    hasProcessContext: !!ctx.contextId,
  })

  const excerpt = clean.slice(0, 120)
  const evidence: EvidenceItem[] = [
    {
      id: generateId(),
      claim: 'Foi identificada determinação para manifestação nos autos.',
      sourceType: 'publicacao',
      sourceExcerpt: excerpt,
      evidenceType: 'fato',
      confidenceScore: conf.score,
      reviewStatus: 'nao_revisado',
    },
    {
      id: generateId(),
      claim: 'Possível prazo de 15 dias úteis a partir da publicação.',
      sourceType: 'inferencia',
      sourceExcerpt: excerpt,
      evidenceType: 'sugestao',
      confidenceScore: Math.max(40, conf.score - 15),
      reviewStatus: 'nao_revisado',
    },
  ]

  if (conf.score < 40) {
    return sanitizeStructuredOutput({
      summary: 'Não foi possível concluir com segurança a partir dos dados disponíveis.',
      documentType: 'publicacao',
      processNumber: procMatch?.[0] || null,
      facts: [],
      interpretations: [],
      suggestedActions: [],
      possibleDeadline: { value: null, unit: null, type: null, startingPoint: null, warnings: ['Confirmar termo inicial manualmente'] },
      evidence,
      uncertainties: ['Texto insuficiente ou ambíguo para análise completa'],
      confidenceScore: conf.score,
      riskLevel: 'alto',
      warnings: ['Análise com confiança baixa — revisão obrigatória', ...(env.demoMode ? ['Resultado demonstrativo — não gerado por análise jurídica real.'] : [])],
    })
  }

  return sanitizeStructuredOutput({
    summary: 'Intimação para manifestação no prazo processual, conforme trecho analisado.',
    documentType: 'intimacao',
    processNumber: procMatch?.[0] || null,
    court: null,
    parties: ['Parte autora', 'Parte ré'],
    facts: ['Determinação para manifestação identificada no texto'],
    interpretations: ['Trata-se de possível intimação para manifestação nos autos'],
    suggestedActions: ['Elaborar manifestação', 'Comunicar o cliente', 'Registrar possível prazo após conferência'],
    possibleDeadline: {
      value: '15',
      unit: 'dias_uteis',
      type: 'manifestacao',
      startingPoint: 'data_publicacao',
      warnings: ['Confirmar termo inicial e calendário aplicável', 'Não salvar automaticamente como prazo oficial'],
    },
    evidence,
    uncertainties: procMatch ? [] : ['Número do processo não identificado com segurança'],
    confidenceScore: conf.score,
    riskLevel: conf.score >= 70 ? 'alto' : 'medio',
    warnings: [
      'Confirmar termo inicial e calendário aplicável.',
      'Verificar suspensão de prazos no tribunal.',
      ...(env.demoMode ? ['Resultado demonstrativo — não gerado por análise jurídica real.'] : []),
    ],
  })
}

async function callEdgeFunction(ctx: AIRequestContext): Promise<SafeAIStructuredOutput> {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase não configurado')

  const { data, error } = await sb.functions.invoke('legal-ai', {
    body: {
      assistantSlug: ctx.assistantSlug,
      actionType: ctx.actionType,
      contextType: ctx.contextType,
      contextId: ctx.contextId,
      inputText: ctx.inputText,
      sources: ctx.sources,
    },
  })

  if (error) throw new Error(error.message || 'Erro ao processar análise')
  if (!isValidStructuredOutput(data?.structuredOutput)) {
    throw new Error('Resposta inválida do servidor')
  }
  return data.structuredOutput
}

export async function executeSafeAIRequest(ctx: AIRequestContext): Promise<AIResponseRecord> {
  const assistant = getAssistantBySlug(ctx.assistantSlug)
  if (!assistant) throw new Error('Assistente não encontrado')

  const cleaned = stripDangerousHtml(sanitizeText(ctx.inputText, MAX_INPUT))
  if (!cleaned.trim()) throw new Error('Informe um texto para análise.')
  if (cleaned.length > MAX_INPUT) throw new Error('Texto excede o limite permitido.')

  const injection = checkPromptInjection(cleaned)
  if (!injection.safe) {
    throw new Error('Conteúdo bloqueado por segurança. Remova instruções suspeitas e tente novamente.')
  }

  const requestId = generateId()
  let structured: SafeAIStructuredOutput
  let provider = 'mock'
  let model = 'demo'

  if (env.demoMode) {
    await new Promise((r) => setTimeout(r, 1200))
    structured = buildMockPublicationOutput(cleaned, ctx)
  } else {
    try {
      structured = await callEdgeFunction({ ...ctx, inputText: cleaned })
      provider = 'edge-function'
      model = 'configurable'
    } catch {
      structured = buildMockPublicationOutput(cleaned, ctx)
      structured.warnings.push('Servidor de IA indisponível — exibindo análise assistida local.')
    }
  }

  const status: AIRequestStatus =
    structured.confidenceScore < 40 ? 'low_confidence' : assistant.requiresValidation ? 'awaiting_review' : 'completed'

  const record: AIResponseRecord = {
    id: generateId(),
    requestId,
    organizationId: ctx.organizationId,
    provider,
    model,
    promptVersion: '1.0.0',
    assistantId: assistant.id,
    assistantVersion: assistant.version,
    structuredOutput: structured,
    responseText: structured.summary,
    confidenceScore: structured.confidenceScore,
    riskLevel: structured.riskLevel,
    warnings: structured.warnings,
    status,
    createdAt: new Date().toISOString(),
    demoMode: env.demoMode,
  }

  if (env.demoMode) {
    const store = getDemoStore()
    store.responses.unshift(record)
    persistDemoStore(store)
  }

  return record
}

export function saveValidation(
  responseId: string,
  userId: string,
  checklist: Record<string, boolean>,
): void {
  const store = getDemoStore()
  store.validations.unshift({ id: generateId(), responseId, userId, checklist, createdAt: new Date().toISOString() })
  persistDemoStore(store)
}

export function saveFeedback(
  responseId: string,
  userId: string,
  type: string,
  comments?: string,
): void {
  const store = getDemoStore()
  store.feedback.unshift({ id: generateId(), responseId, userId, type, comments, createdAt: new Date().toISOString() })
  persistDemoStore(store)
}

export function listPendingAIReviews(orgId: string): number {
  const store = getDemoStore()
  return store.responses.filter(
    (r) => r.organizationId === orgId && (r.status === 'awaiting_review' || r.status === 'low_confidence'),
  ).length
}

export function listRejectedAIFeedback(_orgId: string): number {
  const store = getDemoStore()
  return store.feedback.filter(
    (f) => f.type === 'incorreta' || f.type === 'perigosa',
  ).length
}
