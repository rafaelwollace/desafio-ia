import { Injectable, Logger } from '@nestjs/common';
import {
  AiGeneratedAnalysis,
  AiPromptPayload,
} from './project-analysis-prompt-builder';

export interface AiClient {
  generateAnalysis(payload: AiPromptPayload): Promise<AiGeneratedAnalysis>;
}

@Injectable()
export class MockAiClient implements AiClient {
  async generateAnalysis(payload: AiPromptPayload): Promise<AiGeneratedAnalysis> {
    const projectLine = payload.userPrompt
      .split('\n')
      .find((line) => line.startsWith('Nome:'));

    const projectName = projectLine?.replace('Nome: ', '') ?? 'Projeto';

    return {
      summary: `O projeto "${projectName}" apresenta características que exigem acompanhamento estruturado. A análise considera orçamento, prazo e status atual para orientar decisões executivas.`,
      attentionPoints: [
        'Monitorar aderência ao cronograma definido.',
        'Validar alocação de recursos conforme o orçamento aprovado.',
        'Acompanhar indicadores de risco ao longo das fases do projeto.',
      ],
      executiveRecommendation:
        'Recomenda-se manter checkpoints quinzenais com stakeholders, revisar o plano de mitigação de riscos e garantir governança clara para avanço de status.',
    };
  }
}

@Injectable()
export class OpenAiClient implements AiClient {
  private readonly logger = new Logger(OpenAiClient.name);
  private readonly apiKey = process.env.OPENAI_API_KEY;
  private readonly model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

  async generateAnalysis(payload: AiPromptPayload): Promise<AiGeneratedAnalysis> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY não configurada.');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: payload.systemPrompt },
          { role: 'user', content: payload.userPrompt },
        ],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      this.logger.error(`OpenAI API error: ${errorBody}`);
      throw new Error('Falha ao consultar serviço de IA.');
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };

    const content = data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Resposta vazia do serviço de IA.');
    }

    const parsed = JSON.parse(content) as AiGeneratedAnalysis;
    return {
      summary: parsed.summary,
      attentionPoints: parsed.attentionPoints ?? [],
      executiveRecommendation: parsed.executiveRecommendation,
    };
  }
}

export const AI_CLIENT = Symbol('AI_CLIENT');
