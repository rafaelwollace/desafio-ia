import { Injectable } from '@nestjs/common';
import { ProjectRisk } from '../enums/project-risk.enum';

const RISK_PRIORITY: Record<ProjectRisk, number> = {
  [ProjectRisk.BAIXO]: 1,
  [ProjectRisk.MEDIO]: 2,
  [ProjectRisk.ALTO]: 3,
};

@Injectable()
export class RiskCalculatorService {
  calculate(budget: number, startDate: Date, endDate: Date): ProjectRisk {
    const durationMonths = this.getDurationInMonths(startDate, endDate);
    const applicableRisks: ProjectRisk[] = [];

    if (budget <= 100_000) {
      applicableRisks.push(ProjectRisk.BAIXO);
    }

    if (durationMonths <= 3) {
      applicableRisks.push(ProjectRisk.BAIXO);
    }

    if (budget >= 100_001 && budget <= 500_000) {
      applicableRisks.push(ProjectRisk.MEDIO);
    }

    if (durationMonths > 3 && durationMonths <= 6) {
      applicableRisks.push(ProjectRisk.MEDIO);
    }

    if (budget > 500_000) {
      applicableRisks.push(ProjectRisk.ALTO);
    }

    if (durationMonths > 6) {
      applicableRisks.push(ProjectRisk.ALTO);
    }

    return applicableRisks.reduce(
      (highest, current) =>
        RISK_PRIORITY[current] > RISK_PRIORITY[highest] ? current : highest,
      ProjectRisk.BAIXO,
    );
  }

  private getDurationInMonths(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    const dayDiff = end.getDate() - start.getDate();
    return dayDiff > 0 ? months + 1 : months;
  }
}
