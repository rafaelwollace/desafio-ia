export enum ProjectStatus {
  EM_ANALISE = 'Em análise',
  APROVADO = 'Aprovado',
  EM_ANDAMENTO = 'Em andamento',
  ENCERRADO = 'Encerrado',
  CANCELADO = 'Cancelado',
}

export const STATUS_TRANSITIONS: Record<ProjectStatus, ProjectStatus | null> = {
  [ProjectStatus.EM_ANALISE]: ProjectStatus.APROVADO,
  [ProjectStatus.APROVADO]: ProjectStatus.EM_ANDAMENTO,
  [ProjectStatus.EM_ANDAMENTO]: ProjectStatus.ENCERRADO,
  [ProjectStatus.ENCERRADO]: null,
  [ProjectStatus.CANCELADO]: null,
};
