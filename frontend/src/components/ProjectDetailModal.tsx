import { useState } from 'react';
import type { Project, ProjectStatus } from '../types/project';
import { projectsApi } from '../services/api';
import { AiAnalysisPanel } from './AiAnalysisPanel';
import { RiskBadge, StatusBadge } from './Badges';

const NEXT_STATUS: Partial<Record<ProjectStatus, ProjectStatus>> = {
  'Em análise': 'Aprovado',
  Aprovado: 'Em andamento',
  'Em andamento': 'Encerrado',
};

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
  onUpdated: (project: Project) => void;
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatDate(value: string): string {
  return new Date(value + 'T00:00:00').toLocaleDateString('pt-BR');
}

export function ProjectDetailModal({
  project,
  onClose,
  onUpdated,
}: ProjectDetailModalProps) {
  const [current, setCurrent] = useState(project);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const nextStatus = NEXT_STATUS[current.status];
  const canCancel = current.status !== 'Encerrado' && current.status !== 'Cancelado';

  const handleAdvanceStatus = async (): Promise<void> => {
    if (!nextStatus) return;

    setLoadingAction('advance');
    setError(null);

    try {
      const updated = await projectsApi.updateStatus(current.id, nextStatus);
      setCurrent(updated);
      onUpdated(updated);
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : 'Erro ao avançar status.',
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCancel = async (): Promise<void> => {
    setLoadingAction('cancel');
    setError(null);

    try {
      const updated = await projectsApi.updateStatus(current.id, 'Cancelado');
      setCurrent(updated);
      onUpdated(updated);
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : 'Erro ao cancelar projeto.',
      );
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <div>
            <h2>{current.name}</h2>
            <div className="badge-row">
              <StatusBadge status={current.status} />
              <RiskBadge risk={current.risk} />
            </div>
          </div>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </header>

        <div className="detail-grid">
          <div>
            <span>Orçamento</span>
            <strong>{formatCurrency(current.budget)}</strong>
          </div>
          <div>
            <span>Início</span>
            <strong>{formatDate(current.startDate)}</strong>
          </div>
          <div>
            <span>Término previsto</span>
            <strong>{formatDate(current.endDate)}</strong>
          </div>
        </div>

        <section className="detail-section">
          <h3>Descrição</h3>
          <p>{current.description}</p>
        </section>

        {error && <p className="error-message">{error}</p>}

        <div className="detail-actions">
          {nextStatus && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAdvanceStatus}
              disabled={loadingAction !== null}
            >
              {loadingAction === 'advance'
                ? 'Processando...'
                : `Avançar para "${nextStatus}"`}
            </button>
          )}

          {canCancel && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleCancel}
              disabled={loadingAction !== null}
            >
              {loadingAction === 'cancel' ? 'Processando...' : 'Cancelar projeto'}
            </button>
          )}
        </div>

        <AiAnalysisPanel projectId={current.id} projectName={current.name} />
      </div>
    </div>
  );
}
