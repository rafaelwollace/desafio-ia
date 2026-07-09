import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Project } from './entities/project.entity';
import { ProjectRisk } from './enums/project-risk.enum';
import { ProjectStatus } from './enums/project-status.enum';

@Injectable()
export class ProjectsRepository {
  private readonly projects = new Map<string, Project>();

  findAll(): Project[] {
    return Array.from(this.projects.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  findById(id: string): Project | undefined {
    return this.projects.get(id);
  }

  create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const now = new Date();
    const project: Project = {
      id: randomUUID(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    this.projects.set(project.id, project);
    return project;
  }

  update(id: string, data: Partial<Project>): Project | undefined {
    const existing = this.projects.get(id);
    if (!existing) {
      return undefined;
    }

    const updated: Project = {
      ...existing,
      ...data,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    };

    this.projects.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.projects.delete(id);
  }

  seed(): void {
    if (this.projects.size > 0) {
      return;
    }

    const samples: Array<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>> = [
      {
        name: 'Portal do Cliente',
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-04-30'),
        budget: 85000,
        description: 'Portal self-service para clientes corporativos.',
        status: ProjectStatus.EM_ANALISE,
        risk: ProjectRisk.BAIXO,
      },
      {
        name: 'Migração de Infraestrutura',
        startDate: new Date('2026-01-10'),
        endDate: new Date('2026-08-15'),
        budget: 320000,
        description: 'Migração gradual para ambiente cloud híbrido.',
        status: ProjectStatus.APROVADO,
        risk: ProjectRisk.MEDIO,
      },
    ];

    samples.forEach((sample) => this.create(sample));
  }
}
