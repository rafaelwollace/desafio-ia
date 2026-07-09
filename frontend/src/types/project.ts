export type ProjectStatus =
  | 'Em análise'
  | 'Aprovado'
  | 'Em andamento'
  | 'Encerrado'
  | 'Cancelado';

export type ProjectRisk = 'Baixo' | 'Médio' | 'Alto';

export interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  budget: number;
  description: string;
  status: ProjectStatus;
  risk: ProjectRisk;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  name: string;
  startDate: string;
  endDate: string;
  budget: number;
  description: string;
}

export interface AiAnalysis {
  summary: string;
  attentionPoints: string[];
  executiveRecommendation: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  timestamp: string;
}
