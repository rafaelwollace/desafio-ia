import { Injectable } from '@nestjs/common';
import { Project } from '../projects/entities/project.entity';

export interface AiPromptPayload {
  systemPrompt: string;
  userPrompt: string;
}

export interface AiGeneratedAnalysis {
  summary: string;
  attentionPoints: string[];
  executiveRecommendation: string;
}

@Injectable()
export class ProjectAnalysisPromptBuilder {
  build(project: Project): AiPromptPayload {
    const startDate = project.startDate.toISOString().split('T')[0];
    const endDate = project.endDate.toISOString().split('T')[0];

    return {
      systemPrompt:
        'Você é um consultor executivo especializado em gestão de projetos. ' +
        'Responda em português brasileiro, de forma objetiva e profissional.',
      userPrompt: [
        'Analise o projeto abaixo e retorne um JSON com os campos:',
        'summary (string), attentionPoints (array de strings), executiveRecommendation (string).',
        '',
        `Nome: ${project.name}`,
        `Status: ${project.status}`,
        `Risco: ${project.risk}`,
        `Orçamento: R$ ${project.budget.toLocaleString('pt-BR')}`,
        `Período: ${startDate} a ${endDate}`,
        `Descrição: ${project.description}`,
      ].join('\n'),
    };
  }
}
