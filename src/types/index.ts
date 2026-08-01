export * from './auth'
export * from './entities'

// Aliases legados para compatibilidade gradual
export type { Client as Cliente, Case as Processo, Deadline as Prazo } from './entities'
