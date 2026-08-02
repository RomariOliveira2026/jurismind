import type { SVGProps } from 'react'

const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** Dois compartimentos isolados — multi-tenancy por escritório */
export function OfficeIsolationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps} {...props} aria-hidden>
      <rect x="3" y="5" width="7" height="14" rx="1.5" />
      <rect x="14" y="5" width="7" height="14" rx="1.5" />
      <line x1="12" y1="4" x2="12" y2="20" strokeDasharray="2.5 2.5" />
      <circle cx="6.5" cy="12" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="12" r="1.25" fill="currentColor" stroke="none" />
      <path d="M6.5 8.5v-1M17.5 8.5v-1" />
    </svg>
  )
}

/** Cadeado com ondas de transmissão — HTTPS/TLS */
export function EncryptionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps} {...props} aria-hidden>
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <circle cx="12" cy="15" r="1.25" fill="currentColor" stroke="none" />
      <path d="M12 16.25v2" />
      <path d="M3.5 9.5c.8-.6 1.7-.9 2.7-.9" />
      <path d="M20.5 9.5c-.8-.6-1.7-.9-2.7-.9" />
      <path d="M2 12.5c1.2-.8 2.6-1.2 4.2-1.2" />
      <path d="M22 12.5c-1.2-.8-2.6-1.2-4.2-1.2" />
    </svg>
  )
}

/** Escudo com verificação — conformidade LGPD */
export function LgpdComplianceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps} {...props} aria-hidden>
      <path d="M12 2.5L5 6v5.5c0 4.2 3 7.5 7 9 4-1.5 7-4.8 7-9V6l-7-3.5z" />
      <path d="M9 12.5l2 2 4.5-4.5" />
      <path d="M12 6.5v1.5" opacity="0.5" />
    </svg>
  )
}

/** Cérebro com lupa de revisão — IA responsável */
export function ResponsibleAIIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps} {...props} aria-hidden>
      <path d="M9 5.5a3 3 0 0 1 6 0c1.8 0 3 1.2 3 2.8 0 1-.4 1.8-1 2.4.6.5 1 1.3 1 2.2 0 1.8-1.5 3.1-3.5 3.1H8.5c-2 0-3.5-1.3-3.5-3.1 0-.9.4-1.7 1-2.2-.6-.6-1-1.4-1-2.4 0-1.6 1.2-2.8 3-2.8z" />
      <path d="M10 14.5v2.5M14 14.5v2.5" />
      <circle cx="17.5" cy="17.5" r="3" />
      <path d="M19.8 19.8L22 22" />
      <path d="M16.5 17.5h2M17.5 16.5v2" />
    </svg>
  )
}

export const SECURITY_CARD_ICONS = {
  'Isolamento por escritório': OfficeIsolationIcon,
  Criptografia: EncryptionIcon,
  LGPD: LgpdComplianceIcon,
  'IA responsável': ResponsibleAIIcon,
} as const
