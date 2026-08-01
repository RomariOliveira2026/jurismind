export const DEADLINE_STATUS_LABELS: Record<string, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  vencido: 'Vencido',
  cancelado: 'Cancelado',
}

export const DEADLINE_PRIORITY_LABELS: Record<string, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  critica: 'Crítica',
}

export const CASE_STATUS_LABELS: Record<string, string> = {
  ativo: 'Ativo',
  suspenso: 'Suspenso',
  arquivado: 'Arquivado',
  encerrado: 'Encerrado',
}

export const CASE_PHASE_LABELS: Record<string, string> = {
  inicial: 'Inicial',
  instrucao: 'Instrução',
  recursal: 'Recursal',
  execucao: 'Execução',
  arquivado: 'Arquivado',
}

export const CLIENT_STATUS_LABELS: Record<string, string> = {
  ativo: 'Ativo',
  arquivado: 'Arquivado',
}

export const PUBLICATION_STATUS_LABELS: Record<string, string> = {
  aguardando: 'Aguardando',
  analisando: 'Analisando',
  analisada: 'Analisada',
  revisada: 'Revisada',
  erro: 'Erro',
}

export const TASK_STATUS_LABELS: Record<string, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
}

export function deadlineStatusVariant(status: string) {
  const map: Record<string, 'urgente' | 'proximo' | 'futuro' | 'concluido' | 'default'> = {
    vencido: 'urgente',
    pendente: 'proximo',
    em_andamento: 'futuro',
    concluido: 'concluido',
    cancelado: 'default',
  }
  return map[status] || 'default'
}

export function priorityVariant(p: string) {
  const map: Record<string, 'urgente' | 'proximo' | 'futuro' | 'default'> = {
    critica: 'urgente',
    alta: 'urgente',
    media: 'proximo',
    baixa: 'default',
  }
  return map[p] || 'default'
}
