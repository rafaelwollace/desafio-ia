import { ApiProperty } from '@nestjs/swagger';
import { ProjectRisk } from '../enums/project-risk.enum';
import { ProjectStatus } from '../enums/project-status.enum';

export class ProjectResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  startDate: string;

  @ApiProperty()
  endDate: string;

  @ApiProperty()
  budget: number;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: ProjectStatus })
  status: ProjectStatus;

  @ApiProperty({ enum: ProjectRisk })
  risk: ProjectRisk;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
