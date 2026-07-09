import { Inject, Injectable, Logger } from '@nestjs/common';
import { Project } from '../projects/entities/project.entity';
import { AiAnalysisResponseDto } from './dto/ai-analysis-response.dto';
import { AI_CLIENT, MockAiClient } from './ai.client';
import type { AiClient } from './ai.client';
import { ProjectAnalysisPromptBuilder } from './project-analysis-prompt-builder';

@Injectable()
export class AiAnalysisService {
  private readonly logger = new Logger(AiAnalysisService.name);
  private readonly fallbackClient = new MockAiClient();

  constructor(
    private readonly promptBuilder: ProjectAnalysisPromptBuilder,
    @Inject(AI_CLIENT) private readonly aiClient: AiClient,
  ) {}

  async analyze(project: Project): Promise<AiAnalysisResponseDto> {
    const payload = this.promptBuilder.build(project);

    try {
      const result = await this.aiClient.generateAnalysis(payload);
      return {
        summary: result.summary,
        attentionPoints: result.attentionPoints,
        executiveRecommendation: result.executiveRecommendation,
      };
    } catch (error) {
      this.logger.warn(
        `Falha na análise via IA, utilizando fallback mock: ${(error as Error).message}`,
      );

      const result = await this.fallbackClient.generateAnalysis(payload);

      return {
        summary: result.summary,
        attentionPoints: result.attentionPoints,
        executiveRecommendation: result.executiveRecommendation,
      };
    }
  }
}
