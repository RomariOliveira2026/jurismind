import { env } from '../../config/env'
import { getSupabase } from '../../lib/supabase'
import { FAIR_USE_PROTECTION_MESSAGE } from '../../lib/aiFairUse'

/** Espelha ai_usage_logs (migration 003) — métricas administrativas */
export interface AIUsageLogEntry {
  organizationId: string
  userId?: string
  assistantId?: string
  provider?: string
  model?: string
  estimatedInputTokens?: number
  estimatedOutputTokens?: number
  estimatedCost?: number
  durationMs?: number
  status: 'success' | 'error' | 'rate_limited' | 'blocked'
}

export type UsageProtectionStatus =
  | 'ok'
  | 'rate_limited'
  | 'suspicious_automation'
  | 'exceptional_load'

export interface UsageProtectionResult {
  allowed: boolean
  status: UsageProtectionStatus
  message?: string
}

export interface UsageCheckContext {
  organizationId: string
  userId: string
  assistantSlug?: string
}

interface WindowEntry {
  timestamp: number
  concurrent: number
}

const WINDOW_MS = 60_000
const memoryWindows = new Map<string, WindowEntry[]>()
const concurrentByKey = new Map<string, number>()

function windowKey(ctx: UsageCheckContext): string {
  return `${ctx.organizationId}:${ctx.userId}`
}

function pruneWindow(entries: WindowEntry[], now: number): WindowEntry[] {
  return entries.filter((e) => now - e.timestamp < WINDOW_MS)
}

function isProtectionEnabled(): boolean {
  return import.meta.env.VITE_AI_PROTECTION_ENABLED === 'true'
}

function getRateLimitPerMinute(): number {
  const parsed = Number(import.meta.env.VITE_AI_RATE_LIMIT_PER_MINUTE)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 120
}

function getMaxConcurrent(): number {
  const parsed = Number(import.meta.env.VITE_AI_MAX_CONCURRENT)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5
}

/** Verifica proteções — desativado por padrão; ativar via VITE_AI_PROTECTION_ENABLED */
export function checkUsageProtection(ctx: UsageCheckContext): UsageProtectionResult {
  if (!isProtectionEnabled()) {
    return { allowed: true, status: 'ok' }
  }

  const key = windowKey(ctx)
  const now = Date.now()
  const entries = pruneWindow(memoryWindows.get(key) ?? [], now)
  const rateLimit = getRateLimitPerMinute()

  if (entries.length >= rateLimit) {
    return {
      allowed: false,
      status: 'rate_limited',
      message: FAIR_USE_PROTECTION_MESSAGE,
    }
  }

  const concurrent = concurrentByKey.get(key) ?? 0
  if (concurrent >= getMaxConcurrent()) {
    return {
      allowed: false,
      status: 'exceptional_load',
      message: FAIR_USE_PROTECTION_MESSAGE,
    }
  }

  return { allowed: true, status: 'ok' }
}

export function beginConcurrentRequest(ctx: UsageCheckContext): () => void {
  const key = windowKey(ctx)
  concurrentByKey.set(key, (concurrentByKey.get(key) ?? 0) + 1)
  return () => {
    const next = (concurrentByKey.get(key) ?? 1) - 1
    if (next <= 0) concurrentByKey.delete(key)
    else concurrentByKey.set(key, next)
  }
}

export function trackRequestInWindow(ctx: UsageCheckContext): void {
  const key = windowKey(ctx)
  const now = Date.now()
  const entries = pruneWindow(memoryWindows.get(key) ?? [], now)
  entries.push({ timestamp: now, concurrent: 1 })
  memoryWindows.set(key, entries)
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

/** Registra consumo — demo: memória; produção: ai_usage_logs quando Supabase disponível */
export async function recordAIUsage(
  entry: AIUsageLogEntry,
  inputText = '',
  outputText = '',
): Promise<void> {
  const inputTokens = entry.estimatedInputTokens ?? estimateTokens(inputText)
  const outputTokens = entry.estimatedOutputTokens ?? estimateTokens(outputText)

  if (env.demoMode) return

  const sb = getSupabase()
  if (!sb) return

  try {
    const payload = {
      organization_id: entry.organizationId,
      user_id: entry.userId ?? null,
      assistant_id: entry.assistantId ?? null,
      provider: entry.provider ?? null,
      model: entry.model ?? null,
      estimated_input_tokens: inputTokens,
      estimated_output_tokens: outputTokens,
      estimated_cost: entry.estimatedCost ?? null,
      duration_ms: entry.durationMs ?? null,
      status: entry.status,
    }
    // Tabela definida na migration 003 — tipos gerados do Supabase pendentes
    await (sb as unknown as { from: (t: string) => { insert: (row: typeof payload) => PromiseLike<unknown> } })
      .from('ai_usage_logs')
      .insert(payload)
  } catch {
    // Falha silenciosa — não impactar UX do usuário
  }
}

export async function withUsageProtection<T>(
  ctx: UsageCheckContext,
  fn: () => Promise<T>,
): Promise<T> {
  const protection = checkUsageProtection(ctx)
  if (!protection.allowed) {
    throw new Error(protection.message ?? FAIR_USE_PROTECTION_MESSAGE)
  }

  const endConcurrent = beginConcurrentRequest(ctx)
  trackRequestInWindow(ctx)

  try {
    return await fn()
  } finally {
    endConcurrent()
  }
}
