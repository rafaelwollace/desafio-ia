import { ApiProperty } from '@nestjs/swagger';

export class AiAnalysisResponseDto {
  @ApiProperty()
  summary: string;

  @ApiProperty({ type: [String] })
  attentionPoints: string[];

  @ApiProperty()
  executiveRecommendation: string;
}
