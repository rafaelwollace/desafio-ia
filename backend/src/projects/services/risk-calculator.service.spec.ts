import { Test, TestingModule } from '@nestjs/testing';
import { ProjectRisk } from '../enums/project-risk.enum';
import { RiskCalculatorService } from './risk-calculator.service';

describe('RiskCalculatorService', () => {
  let service: RiskCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RiskCalculatorService],
    }).compile();

    service = module.get(RiskCalculatorService);
  });

  it('deve classificar como baixo risco', () => {
    const risk = service.calculate(
      80000,
      new Date('2026-01-01'),
      new Date('2026-03-01'),
    );
    expect(risk).toBe(ProjectRisk.BAIXO);
  });

  it('deve classificar como médio risco por orçamento', () => {
    const risk = service.calculate(
      200000,
      new Date('2026-01-01'),
      new Date('2026-02-01'),
    );
    expect(risk).toBe(ProjectRisk.MEDIO);
  });

  it('deve classificar como alto risco por prazo', () => {
    const risk = service.calculate(
      50000,
      new Date('2026-01-01'),
      new Date('2026-09-01'),
    );
    expect(risk).toBe(ProjectRisk.ALTO);
  });

  it('deve prevalecer o maior risco quando múltiplas regras se aplicam', () => {
    const risk = service.calculate(
      600000,
      new Date('2026-01-01'),
      new Date('2026-08-01'),
    );
    expect(risk).toBe(ProjectRisk.ALTO);
  });
});
