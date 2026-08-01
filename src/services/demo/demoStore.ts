import type { AuthSession, Organization, Profile, OrganizationMember } from '../../types/auth'
import type {
  ActivityLog,
  Case,
  Client,
  Deadline,
  Document,
  Notification,
  OrganizationSettings,
  Publication,
  PublicationAnalysis,
  Task,
} from '../../types/entities'
import { addDays, generateId, todayISO } from '../../lib/helpers'

const DEMO_ORG_ID = 'demo-org-001'
const DEMO_USER_ID = 'demo-user-001'

export const DEMO_CREDENTIALS = {
  email: 'demo@jurismind.com.br',
  password: 'demo123',
}

function seedClients(): Client[] {
  return [
    { id: 'c1', organizationId: DEMO_ORG_ID, name: 'Maria Silva', type: 'pf', cpfCnpj: '123.456.789-00', email: 'maria@email.com', phone: '(11) 98765-4321', notes: 'Ação trabalhista.', status: 'ativo', createdAt: '2025-01-10', updatedAt: '2025-01-10' },
    { id: 'c2', organizationId: DEMO_ORG_ID, name: 'Construtora Horizonte S.A.', type: 'pj', cpfCnpj: '12.345.678/0001-90', email: 'juridico@horizonte.com', phone: '(21) 99876-5432', notes: 'Múltiplos processos cíveis.', status: 'ativo', createdAt: '2025-02-01', updatedAt: '2025-02-01' },
    { id: 'c3', organizationId: DEMO_ORG_ID, name: 'João Pereira', type: 'pf', cpfCnpj: '987.654.321-00', email: 'joao@email.com', phone: '(31) 97654-3210', notes: '', status: 'ativo', createdAt: '2025-02-15', updatedAt: '2025-02-15' },
    { id: 'c4', organizationId: DEMO_ORG_ID, name: 'Ana Beatriz Costa', type: 'pf', cpfCnpj: '456.789.123-00', email: 'ana@email.com', phone: '(41) 96543-2109', notes: 'Inventário.', status: 'ativo', createdAt: '2025-03-01', updatedAt: '2025-03-01' },
    { id: 'c5', organizationId: DEMO_ORG_ID, name: 'Tech Solutions Brasil', type: 'pj', cpfCnpj: '11.222.333/0001-44', email: 'legal@tech.com', phone: '(51) 95432-1098', notes: 'Propriedade intelectual.', status: 'ativo', createdAt: '2025-04-01', updatedAt: '2025-04-01' },
  ]
}

function seedCases(): Case[] {
  return [
    { id: 'cs1', organizationId: DEMO_ORG_ID, clientId: 'c1', clientName: 'Maria Silva', caseNumber: '0001234-56.2024.8.26.0100', title: 'Reclamação Trabalhista', court: 'TRT-2', jurisdiction: 'São Paulo', district: 'São Paulo', practiceArea: 'Trabalhista', caseType: 'Reclamação', opposingParty: 'Empresa XYZ Ltda.', responsibleUserId: DEMO_USER_ID, responsibleUserName: 'Dr. Ricardo Almeida', status: 'ativo', phase: 'instrucao', notes: 'Aguardando perícia.', createdAt: '2024-06-01', updatedAt: '2025-06-01' },
    { id: 'cs2', organizationId: DEMO_ORG_ID, clientId: 'c2', clientName: 'Construtora Horizonte S.A.', caseNumber: '0005555-12.2024.8.19.0001', title: 'Ação Civil Pública Ambiental', court: 'TJRJ', jurisdiction: 'Rio de Janeiro', district: 'Rio de Janeiro', practiceArea: 'Ambiental', caseType: 'ACP', opposingParty: 'Município', responsibleUserId: DEMO_USER_ID, responsibleUserName: 'Dr. Ricardo Almeida', status: 'ativo', phase: 'instrucao', notes: 'Liminar deferida.', createdAt: '2024-03-20', updatedAt: '2025-05-20' },
    { id: 'cs3', organizationId: DEMO_ORG_ID, clientId: 'c3', clientName: 'João Pereira', caseNumber: '0009876-54.2023.5.02.0001', title: 'Rescisão Indireta', court: 'TRT-2', jurisdiction: 'São Paulo', district: 'São Paulo', practiceArea: 'Trabalhista', caseType: 'Reclamação', status: 'ativo', phase: 'recursal', notes: '', createdAt: '2023-11-15', updatedAt: '2025-04-10' },
    { id: 'cs4', organizationId: DEMO_ORG_ID, clientId: 'c4', clientName: 'Ana Beatriz Costa', caseNumber: '0007777-89.2025.8.13.0024', title: 'Inventário', court: 'TJMG', jurisdiction: 'Minas Gerais', district: 'Belo Horizonte', practiceArea: 'Família', caseType: 'Inventário', status: 'ativo', phase: 'inicial', notes: '', createdAt: '2025-01-10', updatedAt: '2025-05-01' },
    { id: 'cs5', organizationId: DEMO_ORG_ID, clientId: 'c5', clientName: 'Tech Solutions Brasil', caseNumber: '0003333-45.2024.4.03.6100', title: 'Mandado de Segurança', court: 'TRF-3', jurisdiction: 'São Paulo', district: 'São Paulo', practiceArea: 'Administrativo', caseType: 'MS', status: 'suspenso', phase: 'recursal', notes: 'Aguardando decisão.', createdAt: '2024-08-05', updatedAt: '2025-03-15' },
    { id: 'cs6', organizationId: DEMO_ORG_ID, clientId: 'c1', clientName: 'Maria Silva', caseNumber: '0004444-11.2024.8.26.0100', title: 'Cobrança', court: 'TJSP', jurisdiction: 'São Paulo', district: 'São Paulo', practiceArea: 'Cível', caseType: 'Cobrança', status: 'ativo', phase: 'execucao', notes: '', createdAt: '2024-09-01', updatedAt: '2025-06-01' },
    { id: 'cs7', organizationId: DEMO_ORG_ID, clientId: 'c2', clientName: 'Construtora Horizonte S.A.', caseNumber: '0006666-22.2023.8.19.0001', title: 'Execução de Título', court: 'TJRJ', jurisdiction: 'Rio de Janeiro', district: 'Rio de Janeiro', practiceArea: 'Cível', caseType: 'Execução', status: 'encerrado', phase: 'arquivado', notes: 'Encerrado com acordo.', createdAt: '2023-05-10', updatedAt: '2025-01-20' },
    { id: 'cs8', organizationId: DEMO_ORG_ID, clientId: 'c3', clientName: 'João Pereira', caseNumber: '0008888-33.2025.5.02.0001', title: 'Horas Extras', court: 'TRT-2', jurisdiction: 'São Paulo', district: 'São Paulo', practiceArea: 'Trabalhista', caseType: 'Reclamação', status: 'ativo', phase: 'inicial', notes: 'Novo processo.', createdAt: '2025-05-01', updatedAt: '2025-05-01' },
  ]
}

function seedDeadlines(): Deadline[] {
  const t = todayISO()
  return [
    { id: 'd1', organizationId: DEMO_ORG_ID, caseId: 'cs1', caseNumber: '0001234-56.2024.8.26.0100', clientId: 'c1', clientName: 'Maria Silva', title: 'Manifestação sobre laudo pericial', description: 'Prazo processual para manifestação.', deadlineDate: t, internalDate: addDays(t, -2), priority: 'critica', status: 'pendente', responsibleUserId: DEMO_USER_ID, responsibleUserName: 'Dr. Ricardo Almeida', source: 'manual', createdAt: '2025-06-01', updatedAt: '2025-06-01' },
    { id: 'd2', organizationId: DEMO_ORG_ID, caseId: 'cs3', caseNumber: '0009876-54.2023.5.02.0001', clientId: 'c3', clientName: 'João Pereira', title: 'Apresentar rol de testemunhas', description: '', deadlineDate: addDays(t, 1), priority: 'alta', status: 'pendente', source: 'manual', createdAt: '2025-06-01', updatedAt: '2025-06-01' },
    { id: 'd3', organizationId: DEMO_ORG_ID, caseId: 'cs2', caseNumber: '0005555-12.2024.8.19.0001', clientId: 'c2', clientName: 'Construtora Horizonte S.A.', title: 'Relatório de cumprimento de liminar', description: '', deadlineDate: addDays(t, 3), priority: 'media', status: 'em_andamento', source: 'manual', createdAt: '2025-05-28', updatedAt: '2025-06-01' },
    { id: 'd4', organizationId: DEMO_ORG_ID, caseId: 'cs4', caseNumber: '0007777-89.2025.8.13.0024', clientId: 'c4', clientName: 'Ana Beatriz Costa', title: 'Impugnar plano de partilha', description: '', deadlineDate: addDays(t, 7), priority: 'media', status: 'pendente', source: 'manual', createdAt: '2025-05-25', updatedAt: '2025-05-25' },
    { id: 'd5', organizationId: DEMO_ORG_ID, caseId: 'cs5', caseNumber: '0003333-45.2024.4.03.6100', clientId: 'c5', clientName: 'Tech Solutions Brasil', title: 'Acompanhar publicação de decisão', description: '', deadlineDate: addDays(t, 15), priority: 'baixa', status: 'pendente', source: 'manual', createdAt: '2025-05-20', updatedAt: '2025-05-20' },
    { id: 'd6', organizationId: DEMO_ORG_ID, caseId: 'cs1', caseNumber: '0001234-56.2024.8.26.0100', clientId: 'c1', clientName: 'Maria Silva', title: 'Contestação (concluída)', description: '', deadlineDate: addDays(t, -10), priority: 'alta', status: 'concluido', source: 'manual', completedAt: addDays(t, -12), createdAt: '2025-04-01', updatedAt: '2025-05-01' },
    { id: 'd7', organizationId: DEMO_ORG_ID, caseId: 'cs6', caseNumber: '0004444-11.2024.8.26.0100', clientId: 'c1', clientName: 'Maria Silva', title: 'Embargos à execução', description: 'Sugestão IA — aguardando confirmação.', deadlineDate: addDays(t, -2), priority: 'alta', status: 'vencido', source: 'ia', aiSuggested: true, createdAt: '2025-05-15', updatedAt: '2025-06-01' },
  ]
}

function seedPublications(): Publication[] {
  return [
    { id: 'p1', organizationId: DEMO_ORG_ID, caseId: 'cs1', clientId: 'c1', publicationDate: todayISO(), source: 'DJE', court: 'TRT-2', rawText: 'Intima-se a parte autora para manifestar-se sobre o laudo pericial complementar, no prazo de 15 dias.', status: 'analisada', createdAt: todayISO(), updatedAt: todayISO() },
    { id: 'p2', organizationId: DEMO_ORG_ID, caseId: 'cs2', clientId: 'c2', publicationDate: addDays(todayISO(), -1), source: 'DJE', court: 'TJRJ', rawText: 'Despacho: Vista às partes sobre o relatório de cumprimento.', status: 'revisada', createdAt: addDays(todayISO(), -1), updatedAt: todayISO() },
    { id: 'p3', organizationId: DEMO_ORG_ID, caseId: 'cs3', clientId: 'c3', publicationDate: addDays(todayISO(), -2), source: 'PJe', court: 'TRT-2', rawText: 'Audiência designada para o dia 15/08/2025 às 14h.', status: 'aguardando', createdAt: addDays(todayISO(), -2), updatedAt: addDays(todayISO(), -2) },
    { id: 'p4', organizationId: DEMO_ORG_ID, publicationDate: addDays(todayISO(), -3), source: 'DJE', court: 'TJSP', rawText: 'Sentença publicada. Prazo para apelação: 15 dias.', status: 'analisada', createdAt: addDays(todayISO(), -3), updatedAt: addDays(todayISO(), -2) },
  ]
}

function seedTasks(): Task[] {
  const t = todayISO()
  return [
    { id: 't1', organizationId: DEMO_ORG_ID, caseId: 'cs1', clientId: 'c1', title: 'Revisar laudo pericial', description: 'Analisar pontos divergentes.', dueDate: t, priority: 'alta', status: 'pendente', assignedTo: DEMO_USER_ID, assignedToName: 'Dr. Ricardo Almeida', createdAt: t, updatedAt: t },
    { id: 't2', organizationId: DEMO_ORG_ID, caseId: 'cs2', clientId: 'c2', title: 'Preparar relatório de liminar', description: '', dueDate: addDays(t, 2), priority: 'media', status: 'em_andamento', assignedTo: DEMO_USER_ID, assignedToName: 'Dr. Ricardo Almeida', createdAt: t, updatedAt: t },
    { id: 't3', organizationId: DEMO_ORG_ID, caseId: 'cs4', clientId: 'c4', title: 'Contatar inventariante', description: '', dueDate: addDays(t, 5), priority: 'baixa', status: 'pendente', createdAt: t, updatedAt: t },
    { id: 't4', organizationId: DEMO_ORG_ID, title: 'Atualizar planilha de honorários', description: '', dueDate: addDays(t, 7), priority: 'baixa', status: 'pendente', createdAt: t, updatedAt: t },
    { id: 't5', organizationId: DEMO_ORG_ID, caseId: 'cs3', clientId: 'c3', title: 'Preparar testemunhas', description: '', dueDate: addDays(t, 3), priority: 'alta', status: 'pendente', createdAt: t, updatedAt: t },
    { id: 't6', organizationId: DEMO_ORG_ID, caseId: 'cs6', clientId: 'c1', title: 'Protocolar petição', description: 'Concluída.', dueDate: addDays(t, -5), priority: 'media', status: 'concluida', createdAt: addDays(t, -10), updatedAt: addDays(t, -5) },
  ]
}

function seedNotifications(): Notification[] {
  const t = new Date().toISOString()
  return [
    { id: 'n1', organizationId: DEMO_ORG_ID, userId: DEMO_USER_ID, type: 'prazo_proximo', title: 'Prazo hoje', message: 'Manifestação sobre laudo pericial vence hoje.', read: false, referenceType: 'deadline', referenceId: 'd1', createdAt: t },
    { id: 'n2', organizationId: DEMO_ORG_ID, userId: DEMO_USER_ID, type: 'prazo_vencido', title: 'Prazo vencido', message: 'Embargos à execução está vencido há 2 dias.', read: false, referenceType: 'deadline', referenceId: 'd7', createdAt: t },
    { id: 'n3', organizationId: DEMO_ORG_ID, userId: DEMO_USER_ID, type: 'publicacao_analisada', title: 'Publicação analisada', message: 'Nova análise disponível para o processo 0001234-56.', read: true, referenceType: 'publication', referenceId: 'p1', createdAt: t },
    { id: 'n4', organizationId: DEMO_ORG_ID, userId: DEMO_USER_ID, type: 'tarefa_atribuida', title: 'Nova tarefa', message: 'Revisar laudo pericial foi atribuída a você.', read: false, referenceType: 'task', referenceId: 't1', createdAt: t },
  ]
}

function seedActivities(): ActivityLog[] {
  const t = new Date().toISOString()
  return [
    { id: 'a1', organizationId: DEMO_ORG_ID, userId: DEMO_USER_ID, userName: 'Dr. Ricardo Almeida', action: 'criou', entityType: 'client', entityId: 'c5', createdAt: t },
    { id: 'a2', organizationId: DEMO_ORG_ID, userId: DEMO_USER_ID, userName: 'Dr. Ricardo Almeida', action: 'atualizou', entityType: 'case', entityId: 'cs1', createdAt: t },
    { id: 'a3', organizationId: DEMO_ORG_ID, userId: DEMO_USER_ID, userName: 'Dr. Ricardo Almeida', action: 'concluiu', entityType: 'deadline', entityId: 'd6', createdAt: t },
    { id: 'a4', organizationId: DEMO_ORG_ID, userId: DEMO_USER_ID, userName: 'Dr. Ricardo Almeida', action: 'analisou', entityType: 'publication', entityId: 'p1', createdAt: t },
  ]
}

export interface DemoStore {
  clients: Client[]
  cases: Case[]
  deadlines: Deadline[]
  publications: Publication[]
  publicationAnalyses: PublicationAnalysis[]
  tasks: Task[]
  documents: Document[]
  notifications: Notification[]
  activities: ActivityLog[]
  members: OrganizationMember[]
  settings: OrganizationSettings
}

const DEMO_PROFILE: Profile = {
  id: DEMO_USER_ID,
  email: DEMO_CREDENTIALS.email,
  fullName: 'Dr. Ricardo Almeida',
  phone: '(11) 99999-8888',
  oabNumber: '345678',
  oabState: 'SP',
  role: 'admin',
  jobTitle: 'Sócio',
  createdAt: '2025-01-01',
  updatedAt: '2025-06-01',
}

const DEMO_ORG: Organization = {
  id: DEMO_ORG_ID,
  name: 'Almeida & Associados Advocacia',
  document: '12.345.678/0001-99',
  phone: '(11) 3333-4444',
  email: 'contato@almeidaadv.com.br',
  address: 'Av. Paulista, 1000',
  city: 'São Paulo',
  state: 'SP',
  plan: 'profissional',
  createdAt: '2025-01-01',
  updatedAt: '2025-06-01',
}

export function createDemoSession(): AuthSession {
  return {
    userId: DEMO_USER_ID,
    email: DEMO_CREDENTIALS.email,
    profile: DEMO_PROFILE,
    organization: DEMO_ORG,
    role: 'admin',
    isDemo: true,
  }
}

function createInitialStore(): DemoStore {
  return {
    clients: seedClients(),
    cases: seedCases(),
    deadlines: seedDeadlines(),
    publications: seedPublications(),
    publicationAnalyses: [
      {
        id: 'pa1',
        publicationId: 'p1',
        summary: 'Intimação para manifestação sobre laudo pericial complementar, prazo de 15 dias úteis.',
        detectedParties: 'Parte autora',
        suggestedDeadline: addDays(todayISO(), 15),
        suggestedAction: 'Elaborar manifestação técnica sobre o laudo.',
        riskLevel: 'alto',
        confidence: 0.87,
        warnings: ['Confirmar termo inicial da publicação', 'Verificar suspensão de prazos'],
        possibleIntimation: true,
        possibleStartTerm: 'Data da publicação no DJE',
        identifiedCaseNumber: '0001234-56.2024.8.26.0100',
        createdAt: todayISO(),
      },
    ],
    tasks: seedTasks(),
    documents: [],
    notifications: seedNotifications(),
    activities: seedActivities(),
    members: [
      { id: 'm1', organizationId: DEMO_ORG_ID, userId: DEMO_USER_ID, role: 'admin', profile: DEMO_PROFILE, joinedAt: '2025-01-01' },
      { id: 'm2', organizationId: DEMO_ORG_ID, userId: 'demo-user-002', role: 'advogado', profile: { id: 'demo-user-002', email: 'ana@almeidaadv.com.br', fullName: 'Dra. Ana Souza', role: 'advogado', oabNumber: '234567', oabState: 'SP', createdAt: '2025-02-01', updatedAt: '2025-02-01' }, joinedAt: '2025-02-01' },
      { id: 'm3', organizationId: DEMO_ORG_ID, userId: 'demo-user-003', role: 'assistente', profile: { id: 'demo-user-003', email: 'carlos@almeidaadv.com.br', fullName: 'Carlos Mendes', role: 'assistente', jobTitle: 'Assistente jurídico', createdAt: '2025-03-01', updatedAt: '2025-03-01' }, joinedAt: '2025-03-01' },
    ],
    settings: {
      id: 's1',
      organizationId: DEMO_ORG_ID,
      deadlineAlertDays: 3,
      emailAlerts: true,
      whatsappAlerts: false,
      dailySummary: true,
      weeklySummary: true,
    },
  }
}

const STORAGE_KEY = 'jurismind-demo-store'

let memoryStore: DemoStore | null = null

export function getDemoStore(): DemoStore {
  if (memoryStore) return memoryStore
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      memoryStore = JSON.parse(saved) as DemoStore
      return memoryStore
    }
  } catch {
    // ignore
  }
  memoryStore = createInitialStore()
  persistDemoStore(memoryStore)
  return memoryStore
}

export function resetDemoStore(): void {
  memoryStore = createInitialStore()
  persistDemoStore(memoryStore)
}

export function persistDemoStore(store: DemoStore): void {
  memoryStore = store
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // ignore quota errors
  }
}

export function logActivity(
  store: DemoStore,
  userId: string,
  userName: string,
  action: string,
  entityType: string,
  entityId: string,
  metadata?: Record<string, unknown>,
): void {
  store.activities.unshift({
    id: generateId(),
    organizationId: DEMO_ORG_ID,
    userId,
    userName,
    action,
    entityType,
    entityId,
    metadata,
    createdAt: new Date().toISOString(),
  })
  if (store.activities.length > 100) store.activities.length = 100
}

export { DEMO_ORG_ID, DEMO_USER_ID, DEMO_PROFILE, DEMO_ORG }
