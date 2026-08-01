export type UserRole = 'admin' | 'advogado' | 'assistente' | 'leitura'

export interface Profile {
  id: string
  email: string
  fullName: string
  phone?: string
  oabNumber?: string
  oabState?: string
  role: UserRole
  jobTitle?: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Organization {
  id: string
  name: string
  document?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  plan: 'gratuito' | 'profissional' | 'escritorio'
  createdAt: string
  updatedAt: string
}

export interface OrganizationMember {
  id: string
  organizationId: string
  userId: string
  role: UserRole
  profile?: Profile
  joinedAt: string
}

export interface AuthSession {
  userId: string
  email: string
  profile: Profile
  organization: Organization
  role: UserRole
  isDemo: boolean
}

export interface SignUpData {
  email: string
  password: string
  fullName: string
  phone?: string
  oabNumber?: string
  oabState?: string
  organizationName: string
  organizationDocument?: string
  acceptTerms: boolean
}
