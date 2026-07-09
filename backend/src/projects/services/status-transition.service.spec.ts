import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectStatus } from '../enums/project-status.enum';
import { StatusTransitionService } from './status-transition.service';

describe('StatusTransitionService', () => {
  let service: StatusTransitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusTransitionService],
    }).compile();

    service = module.get(StatusTransitionService);
  });

  it('deve permitir transição válida Em análise → Aprovado', () => {
    expect(() =>
      service.validateTransition(
        ProjectStatus.EM_ANALISE,
        ProjectStatus.APROVADO,
      ),
    ).not.toThrow();
  });

  it('deve bloquear transição inválida Em análise → Em andamento', () => {
    expect(() =>
      service.validateTransition(
        ProjectStatus.EM_ANALISE,
        ProjectStatus.EM_ANDAMENTO,
      ),
    ).toThrow(BadRequestException);
  });

  it('deve permitir cancelamento de qualquer status', () => {
    expect(() =>
      service.validateTransition(
        ProjectStatus.APROVADO,
        ProjectStatus.CANCELADO,
      ),
    ).not.toThrow();
  });

  it('deve bloquear exclusão de projetos em andamento', () => {
    expect(service.canDelete(ProjectStatus.EM_ANDAMENTO)).toBe(false);
  });

  it('deve permitir exclusão de projetos em análise', () => {
    expect(service.canDelete(ProjectStatus.EM_ANALISE)).toBe(true);
  });
});
