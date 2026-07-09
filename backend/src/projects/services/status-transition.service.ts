import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ProjectStatus,
  STATUS_TRANSITIONS,
} from '../enums/project-status.enum';

@Injectable()
export class StatusTransitionService {
  validateTransition(
    currentStatus: ProjectStatus,
    targetStatus: ProjectStatus,
  ): void {
    if (currentStatus === targetStatus) {
      throw new BadRequestException('O projeto já possui este status.');
    }

    if (targetStatus === ProjectStatus.CANCELADO) {
      return;
    }

    const expectedNext = STATUS_TRANSITIONS[currentStatus];

    if (expectedNext !== targetStatus) {
      throw new BadRequestException(
        `Transição inválida: não é permitido alterar de "${currentStatus}" para "${targetStatus}".`,
      );
    }
  }

  getNextStatus(currentStatus: ProjectStatus): ProjectStatus | null {
    return STATUS_TRANSITIONS[currentStatus];
  }

  canDelete(status: ProjectStatus): boolean {
    return (
      status !== ProjectStatus.EM_ANDAMENTO &&
      status !== ProjectStatus.ENCERRADO
    );
  }
}
