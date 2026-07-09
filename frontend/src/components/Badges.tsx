import type { ProjectRisk, ProjectStatus } from '../types/project';

const STATUS_CLASS: Record<ProjectStatus, string> = {
  'Em análise': 'badge badge-analysis',
  Aprovado: 'badge badge-approved',
  'Em andamento': 'badge badge-progress',
  Encerrado: 'badge badge-closed',
  Cancelado: 'badge badge-cancelled',
};

interface StatusBadgeProps {
  status: ProjectStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={STATUS_CLASS[status]}>{status}</span>;
}

const RISK_CLASS: Record<ProjectRisk, string> = {
  Baixo: 'badge badge-risk-low',
  Médio: 'badge badge-risk-medium',
  Alto: 'badge badge-risk-high',
};

interface RiskBadgeProps {
  risk: ProjectRisk;
}

export function RiskBadge({ risk }: RiskBadgeProps) {
  return <span className={RISK_CLASS[risk]}>{risk}</span>;
}
