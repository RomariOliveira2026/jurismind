export function generateId(): string {
  return crypto.randomUUID()
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export function addDays(date: string, days: number): string {
  const d = new Date(date + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export function formatDateBR(date: string): string {
  return new Date(date + 'T12:00:00').toLocaleDateString('pt-BR')
}

export function formatDateTimeBR(date: string): string {
  return new Date(date).toLocaleString('pt-BR')
}

export function daysUntil(date: string): number {
  const target = new Date(date + 'T12:00:00')
  const now = new Date()
  now.setHours(12, 0, 0, 0)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function computeDeadlineStatus(deadlineDate: string, status: string): string {
  if (status === 'concluido' || status === 'cancelado') return status
  const days = daysUntil(deadlineDate)
  if (days < 0) return 'vencido'
  return status
}

export function sanitizeText(input: string, maxLength = 50000): string {
  return input.trim().slice(0, maxLength)
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export const AI_DISCLAIMER =
  'Sugestão gerada por inteligência artificial. Confirme a contagem, o termo inicial, o calendário aplicável e as regras do tribunal antes de utilizar.'

export const AI_LEGAL_WARNING =
  'O JurisMind é uma ferramenta de apoio. O conteúdo gerado deve ser revisado por profissional habilitado e não substitui a análise jurídica.'

export const DEMO_BANNER_TEXT =
  'Ambiente de demonstração — nenhum dado é real.'
