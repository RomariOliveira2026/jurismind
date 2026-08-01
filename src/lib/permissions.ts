import type { UserRole } from '../types/auth'

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  advogado: 'Advogado',
  assistente: 'Assistente',
  leitura: 'Leitura',
}

export const PERMISSIONS = {
  manageTeam: ['admin'] as UserRole[],
  manageSettings: ['admin'] as UserRole[],
  viewReports: ['admin', 'advogado'] as UserRole[],
  manageClients: ['admin', 'advogado', 'assistente'] as UserRole[],
  manageCases: ['admin', 'advogado', 'assistente'] as UserRole[],
  manageDeadlines: ['admin', 'advogado', 'assistente'] as UserRole[],
  useAI: ['admin', 'advogado'] as UserRole[],
  viewOnly: ['leitura'] as UserRole[],
}

export function hasPermission(role: UserRole, permission: keyof typeof PERMISSIONS): boolean {
  return PERMISSIONS[permission].includes(role)
}

export function canWrite(role: UserRole): boolean {
  return role !== 'leitura'
}
