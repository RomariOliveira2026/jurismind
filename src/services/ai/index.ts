import type { PublicationAnalysis } from '../../types/entities'
import { AI_DISCLAIMER, generateId, sanitizeText } from '../../lib/helpers'
import type { AILegalInput, AILegalResult, AIProvider } from './types'
import { recordAIUsage, withUsageProtection } from './usageTracker'

export type { AILegalInput, AILegalResult, AIProvider } from './types'

export interface AnalyzeLegalOptions {
  organizationId?: string
  userId?: string
}

export function toPublicationAnalysis(result: AILegalResult, publicationId: string): PublicationAnalysis {
  return {
    id: result.id,
    publicationId,
    summary: result.summary || result.content,
    detectedParties: result.detectedParties || '',
    suggestedDeadline: result.suggestedDeadline,
    suggestedAction: result.suggestedAction || '',
    riskLevel: result.riskLevel || 'medio',
    confidence: result.confidence || 0.7,
    warnings: result.warnings,
    createdAt: result.createdAt,
  }
}

const WARNINGS = [
  'Confirmar termo inicial e calendário aplicável.',
  'Verificar suspensão de prazos no tribunal.',
  'Revisar por profissional habilitado antes de utilizar.',
]

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function baseResult(
  type: AILegalInput['type'],
  title: string,
  content: string,
  extra?: Partial<AILegalResult>,
): Promise<AILegalResult> {
  await delay(1200)
  return {
    id: generateId(),
    type,
    title,
    content,
    warnings: WARNINGS,
    disclaimer: AI_DISCLAIMER,
    createdAt: new Date().toISOString(),
    ...extra,
  }
}

/** Mock provider — substituir por Edge Function em produção */
export const mockAIProvider: AIProvider = {
  async analyzePublication(text: string) {
    sanitizeText(text)
    return baseResult('publicacao', 'Análise da publicação', 'Intimação identificada para manifestação.', {
      summary: 'Intimação para manifestação no prazo de 15 dias úteis.',
      detectedParties: 'Parte autora / ré',
      suggestedDeadline: '15 dias úteis a partir da publicação',
      suggestedAction: 'Elaborar manifestação e verificar necessidade de dilação.',
      riskLevel: 'alto',
      confidence: 0.87,
    })
  },
  async summarize(text: string) {
    return baseResult('resumo', 'Resumo do documento', `O documento trata de ${sanitizeText(text).slice(0, 80)}...`, {
      summary: 'Manifestação requerida em prazo processual.',
      confidence: 0.82,
    })
  },
  async suggestActions(text: string) {
    sanitizeText(text)
    return baseResult(
      'providencia',
      'Providências sugeridas',
      '1. Comunicar o cliente.\n2. Verificar prazo.\n3. Preparar manifestação.\n4. Registrar prazo após conferência.',
      { suggestedAction: 'Manifestação nos autos', confidence: 0.75 },
    )
  },
  async draftDocument(text: string, caseNumber?: string) {
    sanitizeText(text)
    return baseResult(
      'rascunho',
      'Rascunho inicial',
      `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A)\n\nProcesso nº ${caseNumber || '___'}\n\n[NOME], vem manifestar-se...\n\nTermos em que, pede deferimento.`,
      { confidence: 0.7 },
    )
  },
}

let provider: AIProvider = mockAIProvider

export function setAIProvider(p: AIProvider) {
  provider = p
}

export async function analyzeLegalText(
  input: AILegalInput,
  options?: AnalyzeLegalOptions,
): Promise<AILegalResult> {
  if (!input.text.trim()) throw new Error('Informe um texto para análise.')

  const run = async () => {
    const startedAt = Date.now()
    let result: AILegalResult

    switch (input.type) {
      case 'publicacao':
        result = await provider.analyzePublication(input.text)
        break
      case 'resumo':
        result = await provider.summarize(input.text)
        break
      case 'providencia':
        result = await provider.suggestActions(input.text)
        break
      case 'rascunho':
        result = await provider.draftDocument(input.text, input.caseNumber)
        break
      default:
        throw new Error('Tipo de análise inválido.')
    }

    if (options?.organizationId && options?.userId) {
      await recordAIUsage(
        {
          organizationId: options.organizationId,
          userId: options.userId,
          provider: 'mock',
          model: 'demo',
          durationMs: Date.now() - startedAt,
          status: 'success',
        },
        input.text,
        result.content,
      )
    }

    return result
  }

  if (options?.organizationId && options?.userId) {
    return withUsageProtection(
      {
        organizationId: options.organizationId,
        userId: options.userId,
        assistantSlug: input.type,
      },
      run,
    )
  }

  return run()
}

export { provider as getAIProvider }
