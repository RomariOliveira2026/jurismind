import { cn } from '../../lib/utils'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text dark:text-ice">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-text placeholder:text-slate-400 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 dark:border-slate-600 dark:bg-navy dark:text-ice dark:placeholder:text-slate-500',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text dark:text-ice">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          'w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-text placeholder:text-slate-400 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 dark:border-slate-600 dark:bg-navy dark:text-ice dark:placeholder:text-slate-500 resize-y min-h-[100px]',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export function Select({ label, options, className, id, ...props }: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text dark:text-ice">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={cn(
          'w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-text transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 dark:border-slate-600 dark:bg-navy dark:text-ice',
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
