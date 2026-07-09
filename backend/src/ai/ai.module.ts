import { Module } from '@nestjs/common';
import { AiAnalysisService } from './ai-analysis.service';
import {
  AI_CLIENT,
  MockAiClient,
  OpenAiClient,
} from './ai.client';
import { ProjectAnalysisPromptBuilder } from './project-analysis-prompt-builder';

const aiClientProvider = {
  provide: AI_CLIENT,
  useFactory: (): MockAiClient | OpenAiClient => {
    if (process.env.OPENAI_API_KEY) {
      return new OpenAiClient();
    }
    return new MockAiClient();
  },
};

@Module({
  providers: [
    AiAnalysisService,
    ProjectAnalysisPromptBuilder,
    aiClientProvider,
  ],
  exports: [AiAnalysisService],
})
export class AiModule {}
