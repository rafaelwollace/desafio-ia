import { ProjectRisk } from '../enums/project-risk.enum';
import { ProjectStatus } from '../enums/project-status.enum';

export class Project {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  description: string;
  status: ProjectStatus;
  risk: ProjectRisk;
  createdAt: Date;
  updatedAt: Date;
}
