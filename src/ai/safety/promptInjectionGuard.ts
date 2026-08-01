const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /disregard\s+(all\s+)?(previous|prior|system)\s+/i,
  /forget\s+(everything|all|your)\s+/i,
  /you\s+are\s+now\s+/i,
  /act\s+as\s+(if\s+you|a)\s+/i,
  /reveal\s+(your\s+)?(system\s+)?prompt/i,
  /show\s+(me\s+)?(the\s+)?(system\s+)?prompt/i,
  /override\s+(safety|rules|instructions)/i,
  /jailbreak/i,
  /<\s*script/i,
  /javascript:/i,
]

export interface InjectionCheckResult {
  safe: boolean
  signals: string[]
}

export function checkPromptInjection(text: string): InjectionCheckResult {
  const signals: string[] = []
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      signals.push(`Padrão suspeito detectado: ${pattern.source.slice(0, 40)}`)
    }
  }

  const ratio = (text.match(/[{}<>[\]\\]/g) || []).length / Math.max(text.length, 1)
  if (ratio > 0.15) {
    signals.push('Conteúdo excessivamente malformado')
  }

  return { safe: signals.length === 0, signals }
}

export function stripDangerousHtml(text: string): string {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
}
