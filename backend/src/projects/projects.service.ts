import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { ProjectStatus } from './enums/project-status.enum';
import { ProjectsRepository } from './projects.repository';
import { RiskCalculatorService } from './services/risk-calculator.service';
import { StatusTransitionService } from './services/status-transition.service';

@Injectable()
export class ProjectsService implements OnModuleInit {
  constructor(
    private readonly repository: ProjectsRepository,
    private readonly riskCalculator: RiskCalculatorService,
    private readonly statusTransition: StatusTransitionService,
  ) {}

  onModuleInit(): void {
    this.repository.seed();
  }

  findAll(): ProjectResponseDto[] {
    return this.repository.findAll().map((project) => this.toResponse(project));
  }

  findOne(id: string): ProjectResponseDto {
    const project = this.getProjectOrThrow(id);
    return this.toResponse(project);
  }

  create(dto: CreateProjectDto): ProjectResponseDto {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    this.validateDates(startDate, endDate);

    const project = this.repository.create({
      name: dto.name,
      startDate,
      endDate,
      budget: dto.budget,
      description: dto.description,
      status: ProjectStatus.EM_ANALISE,
      risk: this.riskCalculator.calculate(dto.budget, startDate, endDate),
    });

    return this.toResponse(project);
  }

  update(id: string, dto: UpdateProjectDto): ProjectResponseDto {
    const existing = this.getProjectOrThrow(id);

    const startDate = dto.startDate
      ? new Date(dto.startDate)
      : existing.startDate;
    const endDate = dto.endDate ? new Date(dto.endDate) : existing.endDate;
    this.validateDates(startDate, endDate);

    const budget = dto.budget ?? existing.budget;

    const updated = this.repository.update(id, {
      name: dto.name ?? existing.name,
      startDate,
      endDate,
      budget,
      description: dto.description ?? existing.description,
      risk: this.riskCalculator.calculate(budget, startDate, endDate),
    });

    return this.toResponse(updated!);
  }

  remove(id: string): void {
    const project = this.getProjectOrThrow(id);

    if (!this.statusTransition.canDelete(project.status)) {
      throw new BadRequestException(
        'Projetos com status "Em andamento" ou "Encerrado" não podem ser excluídos.',
      );
    }

    this.repository.delete(id);
  }

  updateStatus(id: string, targetStatus: ProjectStatus): ProjectResponseDto {
    const project = this.getProjectOrThrow(id);
    this.statusTransition.validateTransition(project.status, targetStatus);

    const updated = this.repository.update(id, { status: targetStatus });
    return this.toResponse(updated!);
  }

  getProjectEntity(id: string): Project {
    return this.getProjectOrThrow(id);
  }

  private getProjectOrThrow(id: string): Project {
    const project = this.repository.findById(id);
    if (!project) {
      throw new NotFoundException(`Projeto com ID "${id}" não encontrado.`);
    }
    return project;
  }

  private validateDates(startDate: Date, endDate: Date): void {
    if (endDate <= startDate) {
      throw new BadRequestException(
        'A previsão de término deve ser posterior à data de início.',
      );
    }
  }

  private toResponse(project: Project): ProjectResponseDto {
    return {
      id: project.id,
      name: project.name,
      startDate: project.startDate.toISOString().split('T')[0],
      endDate: project.endDate.toISOString().split('T')[0],
      budget: project.budget,
      description: project.description,
      status: project.status,
      risk: project.risk,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  }
}
