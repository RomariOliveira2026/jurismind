import { useRef, useState, useCallback } from 'react'
import { Upload, FileType } from 'lucide-react'
import { cn } from '../../lib/utils'
import { IA_MAX_CHARS } from '../../data/iaCopilotDemo'

interface IAInputAreaProps {
  value: string
  onChange: (value: string) => void
}

const FORMATS = ['PDF', 'DOCX', 'TXT']

export function IAInputArea({ value, onChange }: IAInputAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [zoneHover, setZoneHover] = useState(false)

  const handleFile = useCallback((file: File) => {
    if (!file.name.match(/\.(txt|pdf|docx?)$/i)) return
    if (file.name.match(/\.(pdf|docx?)$/i)) {
      onChange(value + (value ? '\n\n' : '') + `[Arquivo anexado: ${file.name} — conteúdo será processado na análise]`)
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = (e.target?.result as string) || ''
      onChange(text.slice(0, IA_MAX_CHARS))
    }
    reader.readAsText(file)
  }, [onChange, value])

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const isActive = dragOver || zoneHover

  return (
    <div
      className={cn(
        'rounded-xl border-2 border-dashed bg-white transition-all duration-[180ms] dark:bg-navy',
        isActive
          ? 'border-gold/60 bg-gold/[0.04] shadow-[0_0_0_1px_rgba(212,175,55,0.15)]'
          : 'border-slate-200 hover:border-gold/40 hover:bg-gold/[0.02] dark:border-slate-600 dark:hover:border-gold/30 dark:hover:bg-gold/[0.03]',
      )}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onMouseEnter={() => setZoneHover(true)}
        onMouseLeave={() => setZoneHover(false)}
        className="flex w-full flex-col items-center px-4 py-5 sm:py-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-inset rounded-t-xl transition-colors duration-[180ms]"
        aria-label="Enviar documento jurídico"
      >
        <div
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-[180ms]',
            isActive
              ? 'border-gold/40 bg-gold/15 scale-105'
              : 'border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-navy-light',
          )}
        >
          <Upload className={cn('h-7 w-7 transition-colors duration-[180ms]', isActive ? 'text-gold' : 'text-slate-400')} aria-hidden />
        </div>
        <p className="mt-3 text-sm font-semibold text-navy dark:text-ice">Arraste documentos aqui</p>
        <p className="text-xs text-text-muted dark:text-slate-400 mt-0.5">ou clique para enviar</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {FORMATS.map((fmt) => (
            <span
              key={fmt}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-navy dark:border-slate-600 dark:bg-navy-light dark:text-slate-300"
            >
              <FileType className="h-3 w-3 text-gold" aria-hidden />
              {fmt}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-text-muted dark:text-slate-500">Até 50 MB</p>
      </button>

      <div className="border-t border-slate-100 dark:border-slate-700 px-4 py-3">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, IA_MAX_CHARS))}
          placeholder="Cole uma petição, decisão, contrato, publicação, sentença ou qualquer documento jurídico para análise..."
          className="w-full min-h-[88px] sm:min-h-[100px] resize-y rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-text placeholder:text-slate-400 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/15 dark:border-slate-600 dark:bg-navy/50 dark:text-ice dark:placeholder:text-slate-500"
          aria-label="Documento jurídico para análise"
        />
        <div className="mt-2 flex justify-end">
          <span className="text-[11px] text-text-muted dark:text-slate-500 tabular-nums">
            {value.length.toLocaleString('pt-BR')} / {IA_MAX_CHARS.toLocaleString('pt-BR')} caracteres
          </span>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".txt,.pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
