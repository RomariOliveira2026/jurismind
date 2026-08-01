import { cn } from '../../lib/utils'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-navy text-white hover:bg-navy-light dark:bg-ice dark:text-navy dark:hover:bg-white',
  secondary:
    'bg-slate-100 text-text hover:bg-slate-200 dark:bg-navy-light dark:text-ice dark:hover:bg-slate-700',
  outline:
    'border-2 border-navy text-navy hover:bg-navy hover:text-white dark:border-gold dark:text-gold dark:hover:bg-gold dark:hover:text-navy',
  ghost:
    'text-text hover:bg-slate-100 dark:text-ice dark:hover:bg-navy-light',
  gold: 'gradient-gold text-navy font-semibold hover:opacity-90 shadow-md',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
}

export function buttonStyles(
  variant: Variant = 'primary',
  size: Size = 'md',
  fullWidth?: boolean,
  className?: string,
) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className,
  )
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonStyles(variant, size, fullWidth, className)} {...props}>
      {children}
    </button>
  )
}
