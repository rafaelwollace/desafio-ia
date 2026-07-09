import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { ProjectsController } from './projects.controller';
import { ProjectsRepository } from './projects.repository';
import { ProjectsService } from './projects.service';
import { RiskCalculatorService } from './services/risk-calculator.service';
import { StatusTransitionService } from './services/status-transition.service';

@Module({
  imports: [AiModule],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    ProjectsRepository,
    RiskCalculatorService,
    StatusTransitionService,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
