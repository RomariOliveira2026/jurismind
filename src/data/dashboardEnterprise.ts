import type { LucideIcon } from 'lucide-react'
import {
  AlertCircle,
  Briefcase,
  Calendar,
  CheckSquare,
  Clock,
  FileText,
} from 'lucide-react'

export interface DashboardKpi {
  title: string
  value: number
  icon: LucideIcon
  trend: string
  trendDirection: 'up' | 'down' | 'neutral'
  href: string
  sparkline: number[]
  context: string
}

export interface UrgentDeadlineItem {
  id: string
  title: string
  clientName: string
  caseNumber: string
  deadlineDate: string
  daysLabel: string
  status: string
  statusLabel: string
  responsible: string
  priority?: 'urgente' | 'revisao'
}

export type ActivityType = 'processo' | 'prazo' | 'publicacao' | 'documento' | 'cliente' | 'alerta' | 'audiencia'

export interface DashboardActivity {
  id: string
  text: string
  relativeTime: string
  initials: string
  actor: string
  type: ActivityType
}

export interface SmartAlert {
  id: string
  category: string
  message: string
  emoji: string
  color: 'red' | 'amber' | 'blue'
}

export const DASHBOARD_LAST_UPDATE = 'há 2 minutos'

export const DASHBOARD_SYNC = {
  sources: 'TJSE • TRT20 • STJ',
  relativeTime: 'há 2 minutos',
}

export const DASHBOARD_KPIS: DashboardKpi[] = [
  {
    title: 'Prazos vencidos',
    value: 2,
    icon: AlertCircle,
    trend: '▼ -4%',
    trendDirection: 'down',
    href: '/app/prazos?status=vencido',
    sparkline: [3, 2, 4, 2, 3, 2, 2],
    context: 'vs. semana passada',
  },
  {
    title: 'Prazos hoje',
    value: 7,
    icon: Clock,
    trend: '▲ +12%',
    trendDirection: 'up',
    href: '/app/prazos?periodo=hoje',
    sparkline: [2, 3, 4, 5, 6, 6, 7],
    context: 'Atualizado há 2 min',
  },
  {
    title: 'Próximos 7 dias',
    value: 18,
    icon: Calendar,
    trend: '▲ +8%',
    trendDirection: 'up',
    href: '/app/prazos?periodo=7dias',
    sparkline: [12, 14, 13, 15, 16, 17, 18],
    context: 'Próxima semana',
  },
  {
    title: 'Processos ativos',
    value: 143,
    icon: Briefcase,
    trend: '▲ +3%',
    trendDirection: 'up',
    href: '/app/processos',
    sparkline: [138, 139, 140, 141, 142, 142, 143],
    context: 'Últimos 30 dias',
  },
  {
    title: 'Publicações pendentes',
    value: 26,
    icon: FileText,
    trend: '▼ -2%',
    trendDirection: 'down',
    href: '/app/publicacoes',
    sparkline: [28, 27, 29, 28, 27, 26, 26],
    context: 'Aguardando revisão',
  },
  {
    title: 'Tarefas pendentes',
    value: 19,
    icon: CheckSquare,
    trend: '▲ +5%',
    trendDirection: 'up',
    href: '/app/agenda',
    sparkline: [14, 15, 16, 17, 17, 18, 19],
    context: 'Em andamento',
  },
]

export const CASE_STATUS_CHART = [
  { label: 'Ativos', value: 143, color: '#d4af37' },
  { label: 'Suspensos', value: 28, color: '#3b82f6' },
  { label: 'Encerrados', value: 64, color: '#64748b' },
  { label: 'Arquivados', value: 37, color: '#132d4f' },
]

export const DEADLINES_30_CHART = [
  { label: 'Hoje', value: 7 },
  { label: '7 dias', value: 18 },
  { label: '15 dias', value: 24 },
  { label: '30 dias', value: 41 },
]

export const SMART_ALERTS: SmartAlert[] = [
  {
    id: 'sa-1',
    category: 'Prazo vencido',
    message: 'Existem 2 prazos vencidos aguardando ação.',
    emoji: '⚠',
    color: 'red',
  },
  {
    id: 'sa-2',
    category: 'Publicação pendente',
    message: 'Há 4 publicações aguardando revisão.',
    emoji: '📄',
    color: 'amber',
  },
  {
    id: 'sa-3',
    category: 'Audiência amanhã',
    message: 'Um cliente possui audiência amanhã às 14h.',
    emoji: '📅',
    color: 'blue',
  },
]

export const AI_INSIGHTS = {
  publicationsToday: 26,
  deadlinesIdentified: 14,
  criticalRisks: 2,
  suggestions: 31,
  accuracy: '98,7%',
}

export const URGENT_DEADLINES: UrgentDeadlineItem[] = [
  {
    id: 'ud-1',
    title: 'Manifestação — cumprimento de sentença',
    clientName: 'Maria Silva',
    caseNumber: '0001234-56.2024.8.26.0100',
    deadlineDate: '2026-07-31',
    daysLabel: 'Hoje',
    status: 'vencido',
    statusLabel: 'Vencido',
    responsible: 'Dra. Mariana Costa',
  },
  {
    id: 'ud-2',
    title: 'Contrarrazões ao recurso especial',
    clientName: 'Construtora Horizonte',
    caseNumber: '0009876-12.2023.4.05.0001',
    deadlineDate: '2026-07-31',
    daysLabel: 'Hoje',
    status: 'pendente',
    statusLabel: 'Pendente',
    priority: 'urgente',
    responsible: 'Dr. Lucas Andrade',
  },
  {
    id: 'ud-3',
    title: 'Impugnação ao cumprimento de sentença',
    clientName: 'Banco Delta',
    caseNumber: '0011223-45.2024.8.26.0003',
    deadlineDate: '2026-08-01',
    daysLabel: '1d',
    status: 'em_andamento',
    statusLabel: 'Em andamento',
    responsible: 'Dra. Fernanda Lima',
  },
  {
    id: 'ud-4',
    title: 'Réplica à contestação',
    clientName: 'Tech Solutions Brasil',
    caseNumber: '0005544-78.2025.8.26.0220',
    deadlineDate: '2026-08-02',
    daysLabel: '2d',
    status: 'pendente',
    statusLabel: 'Pendente',
    responsible: 'Dr. Pedro Nunes',
  },
  {
    id: 'ud-5',
    title: 'Recurso de apelação',
    clientName: 'Grupo Oliveira',
    caseNumber: '0003321-09.2023.8.26.0600',
    deadlineDate: '2026-08-03',
    daysLabel: '3d',
    status: 'pendente',
    statusLabel: 'Urgente',
    priority: 'urgente',
    responsible: 'Dra. Mariana Costa',
  },
  {
    id: 'ud-6',
    title: 'Manifestação sobre laudo pericial',
    clientName: 'Hospital Santa Clara',
    caseNumber: '0007788-11.2024.8.26.0050',
    deadlineDate: '2026-08-04',
    daysLabel: '4d',
    status: 'em_andamento',
    statusLabel: 'Em andamento',
    responsible: 'Dr. Ricardo Almeida',
  },
  {
    id: 'ud-7',
    title: 'Embargos de declaração',
    clientName: 'Ana Beatriz Costa',
    caseNumber: '0004412-33.2025.8.26.0100',
    deadlineDate: '2026-08-05',
    daysLabel: '5d',
    status: 'pendente',
    statusLabel: 'Revisão',
    priority: 'revisao',
    responsible: 'Dra. Camila Rocha',
  },
  {
    id: 'ud-8',
    title: 'Alegações finais',
    clientName: 'Carlos Andrade',
    caseNumber: '0002299-44.2024.8.26.0300',
    deadlineDate: '2026-08-06',
    daysLabel: '6d',
    status: 'concluido',
    statusLabel: 'Concluído',
    responsible: 'Dr. Lucas Andrade',
  },
  {
    id: 'ud-9',
    title: 'Contraminuta ao agravo',
    clientName: 'João Pereira',
    caseNumber: '0006655-22.2023.8.26.0400',
    deadlineDate: '2026-08-07',
    daysLabel: '7d',
    status: 'pendente',
    statusLabel: 'Pendente',
    responsible: 'Dr. Pedro Nunes',
  },
  {
    id: 'ud-10',
    title: 'Cumprimento de decisão liminar',
    clientName: 'Ricardo Almeida',
    caseNumber: '0008899-77.2025.8.26.0100',
    deadlineDate: '2026-08-08',
    daysLabel: '8d',
    status: 'vencido',
    statusLabel: 'Vencido',
    responsible: 'Dra. Fernanda Lima',
  },
  {
    id: 'ud-11',
    title: 'Audiência de conciliação — preparação',
    clientName: 'Maria Silva',
    caseNumber: '0001234-56.2024.8.26.0100',
    deadlineDate: '2026-08-09',
    daysLabel: '9d',
    status: 'em_andamento',
    statusLabel: 'Em andamento',
    responsible: 'Dra. Mariana Costa',
  },
  {
    id: 'ud-12',
    title: 'Revisão de minuta contratual',
    clientName: 'Tech Solutions Brasil',
    caseNumber: '0005544-78.2025.8.26.0220',
    deadlineDate: '2026-08-10',
    daysLabel: '10d',
    status: 'pendente',
    statusLabel: 'Revisão',
    priority: 'revisao',
    responsible: 'Dr. Ricardo Almeida',
  },
]

export const DASHBOARD_ACTIVITIES: DashboardActivity[] = [
  { id: 'a-1', text: 'Dra. Mariana Costa criou processo', relativeTime: 'há 2 min', initials: 'MC', actor: 'Mariana Costa', type: 'processo' },
  { id: 'a-2', text: 'Dr. Lucas Andrade concluiu prazo', relativeTime: 'há 18 min', initials: 'LA', actor: 'Lucas Andrade', type: 'prazo' },
  { id: 'a-3', text: 'Dra. Fernanda Lima analisou publicação', relativeTime: 'há 1 hora', initials: 'FL', actor: 'Fernanda Lima', type: 'publicacao' },
  { id: 'a-4', text: 'Carlos Henrique anexou documento', relativeTime: 'há 1 hora', initials: 'CH', actor: 'Carlos Henrique', type: 'documento' },
  { id: 'a-5', text: 'Grupo Oliveira adicionou cliente', relativeTime: 'há 2 horas', initials: 'GO', actor: 'Grupo Oliveira', type: 'cliente' },
  { id: 'a-6', text: 'Tech Solutions iniciou processo', relativeTime: 'há 3 horas', initials: 'TS', actor: 'Tech Solutions', type: 'processo' },
  { id: 'a-7', text: 'Banco Delta recebeu alerta', relativeTime: 'há 3 horas', initials: 'BD', actor: 'Banco Delta', type: 'alerta' },
  { id: 'a-8', text: 'Maria Silva concluiu manifestação', relativeTime: 'há 5 horas', initials: 'MS', actor: 'Maria Silva', type: 'prazo' },
]
