import { useState } from 'react'
import { FileText, Lightbulb, ScrollText, Download, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { analyzeLegalText, type AILegalResult } from '../../services/aiLegalService'
import { Button } from '../../components/ui/Button'
import { AIDisclaimer } from '../../components/common/AIDisclaimer'
import { copyToClipboard, formatDateTimeBR } from '../../lib/helpers'
import { cn } from '../../lib/utils'
import { IAHero } from '../../components/ia/IAHero'
import { IAInputArea } from '../../components/ia/IAInputArea'
import { IAQuickPrompts } from '../../components/ia/IAQuickPrompts'
import { IASidePanel } from '../../components/ia/IASidePanel'
import { IAHistory } from '../../components/ia/IAHistory'
import { IAResultCard } from '../../components/ia/IAResultCard'

type AnalysisType = 'resumo' | 'publicacao' | 'providencia' | 'rascunho'

const SECONDARY_ACTIONS: { type: AnalysisType; label: string; icon: typeof FileText }[] = [
  { type: 'resumo', label: 'Resumo', icon: FileText },
  { type: 'providencia', label: 'Providências', icon: Lightbulb },
  { type: 'rascunho', label: 'Minuta', icon: ScrollText },
]

export function IAPage() {
  const { session, hasPermission } = useAuth()
  const { error: toastError } = useToast()
  const [texto, setTexto] = useState('')
  const [result, setResult] = useState<AILegalResult | null>(null)
  const [loading, setLoading] = useState<AnalysisType | null>(null)
  const [copied, setCopied] = useState(false)

  if (!hasPermission('useAI')) {
    return <p className="text-text-muted">Seu perfil não tem acesso à IA Jurídica.</p>
  }

  const handleAction = async (type: AnalysisType) => {
    if (!texto.trim()) return
    setLoading(type)
    try {
      const r = await analyzeLegalText(
        { text: texto, type },
        {
          organizationId: session!.organization.id,
          userId: session!.userId,
        },
      )
      setResult(r)
    } catch {
      toastError('Não foi possível concluir a análise. Tente novamente.')
    } finally {
      setLoading(null)
    }
  }

  const handleCopy = async () => {
    if (!result) return
    await copyToClipboard(result.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExport = () => {
    if (!result) return
    const blob = new Blob([result.content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `jurismind-analise-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePromptSelect = (template: string) => {
    setTexto((prev) => (prev.trim() ? `${template}\n${prev}` : template))
  }

  const handleHistorySelect = (title: string) => {
    setTexto(`[Análise anterior: ${title}]\n\nCole aqui o documento para nova análise...`)
  }

  const isLoading = loading !== null

  return (
    <div className="animate-fade-in space-y-3 max-w-[1600px]">
      <IAHero />

      <AIDisclaimer className="py-2 text-[11px]" />

      <div className="grid gap-3 lg:grid-cols-12 lg:gap-4">
        <div className="lg:col-span-8 space-y-3 min-w-0">
          <IAInputArea value={texto} onChange={setTexto} />

          <IAQuickPrompts onSelect={handlePromptSelect} />

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2">
            <Button
              variant="gold"
              size="lg"
              onClick={() => handleAction('publicacao')}
              disabled={isLoading || !texto.trim()}
              className={cn(
                'h-11 px-7 gap-2.5 font-semibold',
                'bg-gradient-to-r from-gold to-gold-light shadow-[0_4px_14px_rgba(212,175,55,0.35)]',
                'transition-all duration-[180ms] hover:shadow-[0_6px_20px_rgba(212,175,55,0.45)] hover:-translate-y-0.5',
                'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
                'disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none',
              )}
            >
              <Sparkles className="h-5 w-5 shrink-0" aria-hidden />
              {loading === 'publicacao' ? 'Analisando...' : 'Analisar com IA'}
            </Button>

            {SECONDARY_ACTIONS.map(({ type, label, icon: Icon }) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => handleAction(type)}
                disabled={isLoading || !texto.trim()}
                className="h-9 gap-2 transition-all duration-[180ms] hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-navy/30 focus-visible:ring-offset-2 dark:focus-visible:ring-gold/40"
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {loading === type ? 'Processando...' : label}
              </Button>
            ))}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              disabled={!result || isLoading}
              className="h-9 gap-2 transition-all duration-[180ms] focus-visible:ring-2 focus-visible:ring-gold/50"
            >
              <Download className="h-4 w-4 shrink-0" aria-hidden />
              Exportar
            </Button>
          </div>

          <IAResultCard
            result={result}
            isDemo={!result}
            copied={copied}
            onCopy={handleCopy}
            authorName={session?.profile.fullName}
            createdAt={result ? formatDateTimeBR(result.createdAt) : undefined}
          />
        </div>

        <div className="lg:col-span-4 space-y-3 min-w-0">
          <IASidePanel />
          <IAHistory onSelect={handleHistorySelect} />
        </div>
      </div>
    </div>
  )
}
