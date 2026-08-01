import type { UserRole, Profile, Organization } from '../../types/auth'
import type {
  Client,
  Case,
  Deadline,
  Publication,
  PublicationAnalysis,
  Task,
  Document,
  Notification,
  ActivityLog,
  OrganizationSettings,
  ClientStatus,
  ClientType,
  CaseStatus,
  CasePhase,
  DeadlineStatus,
  DeadlinePriority,
  PublicationStatus,
  TaskStatus,
  RiskLevel,
  NotificationType,
} from '../../types/entities'

type Row = Record<string, unknown>

export function mapProfile(row: Row): Profile {
  return {
    id: row.id as string,
    email: row.email as string,
    fullName: row.full_name as string,
    phone: (row.phone as string) || undefined,
    oabNumber: (row.oab_number as string) || undefined,
    oabState: (row.oab_state as string) || undefined,
    role: row.role as UserRole,
    jobTitle: (row.job_title as string) || undefined,
    avatarUrl: (row.avatar_url as string) || undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

export function mapOrganization(row: Row): Organization {
  return {
    id: row.id as string,
    name: row.name as string,
    document: (row.document as string) || undefined,
    phone: (row.phone as string) || undefined,
    email: (row.email as string) || undefined,
    address: (row.address as string) || undefined,
    city: (row.city as string) || undefined,
    state: (row.state as string) || undefined,
    plan: row.plan as Organization['plan'],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

export function mapClient(row: Row, clientName?: string): Client {
  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    name: (row.name as string) || clientName || '',
    type: row.type as ClientType,
    cpfCnpj: (row.cpf_cnpj as string) || '',
    email: (row.email as string) || '',
    phone: (row.phone as string) || '',
    address: (row.address as string) || undefined,
    notes: (row.notes as string) || '',
    status: row.status as ClientStatus,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

export function mapCase(row: Row, clientName?: string): Case {
  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    clientId: (row.client_id as string) || '',
    clientName: clientName || (row.client_name as string) || undefined,
    caseNumber: row.case_number as string,
    title: row.title as string,
    court: (row.court as string) || '',
    jurisdiction: (row.jurisdiction as string) || '',
    district: (row.district as string) || '',
    practiceArea: (row.practice_area as string) || '',
    caseType: (row.case_type as string) || '',
    opposingParty: (row.opposing_party as string) || undefined,
    responsibleUserId: (row.responsible_user_id as string) || undefined,
    status: row.status as CaseStatus,
    phase: row.phase as CasePhase,
    estimatedValue: row.estimated_value as number | undefined,
    notes: (row.notes as string) || '',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

export function mapDeadline(row: Row, extras?: { caseNumber?: string; clientName?: string }): Deadline {
  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    caseId: (row.case_id as string) || undefined,
    caseNumber: extras?.caseNumber,
    clientId: (row.client_id as string) || undefined,
    clientName: extras?.clientName,
    title: row.title as string,
    description: (row.description as string) || '',
    deadlineDate: row.deadline_date as string,
    internalDate: (row.internal_date as string) || undefined,
    priority: row.priority as DeadlinePriority,
    status: row.status as DeadlineStatus,
    responsibleUserId: (row.responsible_user_id as string) || undefined,
    source: (row.source as Deadline['source']) || 'manual',
    aiSuggested: Boolean(row.ai_suggested),
    completedAt: (row.completed_at as string) || undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

export function mapPublication(row: Row): Publication {
  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    caseId: (row.case_id as string) || undefined,
    clientId: (row.client_id as string) || undefined,
    publicationDate: (row.publication_date as string) || '',
    source: (row.source as string) || '',
    court: (row.court as string) || '',
    rawText: row.raw_text as string,
    status: row.status as PublicationStatus,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

export function mapPublicationAnalysis(row: Row): PublicationAnalysis {
  return {
    id: row.id as string,
    publicationId: row.publication_id as string,
    summary: (row.summary as string) || '',
    detectedParties: (row.detected_parties as string) || '',
    suggestedDeadline: (row.suggested_deadline as string) || undefined,
    suggestedAction: (row.suggested_action as string) || '',
    riskLevel: (row.risk_level as RiskLevel) || 'medio',
    confidence: Number(row.confidence) || 0,
    warnings: Array.isArray(row.warnings) ? (row.warnings as string[]) : [],
    reviewedBy: (row.reviewed_by as string) || undefined,
    reviewedAt: (row.reviewed_at as string) || undefined,
    createdAt: row.created_at as string,
  }
}

export function mapTask(row: Row): Task {
  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    caseId: (row.case_id as string) || undefined,
    clientId: (row.client_id as string) || undefined,
    title: row.title as string,
    description: (row.description as string) || '',
    dueDate: (row.due_date as string) || undefined,
    priority: row.priority as DeadlinePriority,
    status: row.status as TaskStatus,
    assignedTo: (row.assigned_to as string) || undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

export function mapDocument(row: Row): Document {
  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    caseId: (row.case_id as string) || undefined,
    clientId: (row.client_id as string) || undefined,
    fileName: row.file_name as string,
    filePath: row.file_path as string,
    fileType: (row.file_type as string) || '',
    fileSize: Number(row.file_size) || 0,
    uploadedBy: (row.uploaded_by as string) || '',
    createdAt: row.created_at as string,
  }
}

export function mapNotification(row: Row): Notification {
  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    userId: row.user_id as string,
    type: row.type as NotificationType,
    title: row.title as string,
    message: row.message as string,
    read: Boolean(row.read),
    referenceType: (row.reference_type as string) || undefined,
    referenceId: (row.reference_id as string) || undefined,
    createdAt: row.created_at as string,
  }
}

export function mapActivityLog(row: Row, userName?: string): ActivityLog {
  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    userId: (row.user_id as string) || '',
    userName,
    action: row.action as string,
    entityType: row.entity_type as string,
    entityId: (row.entity_id as string) || '',
    metadata: row.metadata as Record<string, unknown> | undefined,
    createdAt: row.created_at as string,
  }
}

export function mapOrganizationSettings(row: Row): OrganizationSettings {
  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    deadlineAlertDays: Number(row.deadline_alert_days) || 3,
    emailAlerts: Boolean(row.email_alerts),
    whatsappAlerts: Boolean(row.whatsapp_alerts),
    dailySummary: Boolean(row.daily_summary),
    weeklySummary: Boolean(row.weekly_summary),
  }
}
