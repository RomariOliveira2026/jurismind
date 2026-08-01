import { Link } from 'react-router-dom'
import { cn } from '../lib/utils'

interface LogoProps {
  className?: string
  showSlogan?: boolean
  light?: boolean
  onDark?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

/** Altura visível (sem slogan) e altura da imagem (recorte superior). */
const COMPACT = {
  sm: { clip: 'h-8', img: 'h-11' },
  md: { clip: 'h-10', img: 'h-14' },
  lg: { clip: 'h-12', img: 'h-[4.25rem]' },
  xl: { clip: 'h-14', img: 'h-20' },
} as const

const FULL = {
  sm: 'h-14',
  md: 'h-18',
  lg: 'h-24',
  xl: 'h-28',
} as const

export function Logo({ className, showSlogan, light, onDark, size = 'md' }: LogoProps) {
  const useFullAsset = showSlogan || light

  return (
    <Link
      to="/"
      className={cn('inline-flex shrink-0 transition-opacity hover:opacity-90', className)}
      aria-label="JurisMind — Início"
    >
      {useFullAsset ? (
        <img
          src="/logo.png"
          alt="JurisMind"
          className={cn(FULL[size], 'w-auto max-w-[min(100%,380px)] object-contain object-left')}
          loading="eager"
          decoding="async"
        />
      ) : (
        <span
          className={cn(
            'inline-flex overflow-hidden rounded-lg',
            onDark ? 'bg-transparent' : 'bg-navy dark:bg-transparent',
            COMPACT[size].clip,
            'max-w-[min(100%,280px)] sm:max-w-[min(100%,320px)]',
          )}
        >
          <img
            src="/logo.svg"
            alt="JurisMind"
            className={cn(COMPACT[size].img, 'w-auto max-w-none object-left object-top')}
            loading="eager"
            decoding="async"
          />
        </span>
      )}
    </Link>
  )
}
