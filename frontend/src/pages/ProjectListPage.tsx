import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AiAnalysis, CreateProjectPayload, Project } from '../types/project';
import { projectsApi } from '../services/api';
import { AiAnalysisModal } from '../components/AiAnalysisModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { ProjectDetailModal } from '../components/ProjectDetailModal';
import { ProjectForm } from '../components/ProjectForm';
import { RiskBadge, StatusBadge } from '../components/Badges';

type ModalMode = 'create' | 'edit' | 'detail' | null;

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatDate(value: string): string {
  return new Date(value + 'T00:00:00').toLocaleDateString('pt-BR');
}

function canDelete(status: Project['status']): boolean {
  return status !== 'Em andamento' && status !== 'Encerrado';
}

export function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [aiModal, setAiModal] = useState<{
    project: Project;
    analysis: AiAnalysis | null;
    loading: boolean;
    error: string | null;
  } | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const stats = useMemo(
    () => ({
      total: projects.length,
      active: projects.filter((p) => p.status === 'Em andamento').length,
      highRisk: projects.filter((p) => p.risk === 'Alto').length,
    }),
    [projects],
  );

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await projectsApi.list();
      setProjects(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Erro ao carregar projetos.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const handleCreate = async (payload: CreateProjectPayload): Promise<void> => {
    await projectsApi.create(payload);
    setModalMode(null);
    await loadProjects();
  };

  const handleUpdate = async (payload: CreateProjectPayload): Promise<void> => {
    if (!selectedProject) return;
    await projectsApi.update(selectedProject.id, payload);
    setModalMode(null);
    setSelectedProject(null);
    await loadProjects();
  };

  const handleDelete = async (): Promise<void> => {
    if (!deleteTarget) return;

    setActionLoading(deleteTarget.id);
    setDeleteError(null);

    try {
      await projectsApi.remove(deleteTarget.id);
      setDeleteTarget(null);
      await loadProjects();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Erro ao excluir projeto.',
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleQuickAiAnalysis = async (project: Project): Promise<void> => {
    setAiModal({ project, analysis: null, loading: true, error: null });

    try {
      const analysis = await projectsApi.getAiAnalysis(project.id);
      setAiModal({ project, analysis, loading: false, error: null });
    } catch (err) {
      setAiModal({
        project,
        analysis: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Erro ao gerar análise.',
      });
    }
  };

  const handleProjectUpdated = (updated: Project): void => {
    setProjects((current) =>
      current.map((item) => (item.id === updated.id ? updated : item)),
    );
    setSelectedProject(updated);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-icon">◆</span>
            <div>
              <strong>RafaProject</strong>
              <small>Gestão de Projetos</small>
            </div>
          </div>
          <nav className="topbar-nav">
            <span className="nav-item active">Projetos</span>
          </nav>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => {
              setSelectedProject(null);
              setModalMode('create');
            }}
          >
            + Novo projeto
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div>
            <h1>Projetos</h1>
            <p>Cadastro, acompanhamento e análise inteligente de todos os seus projetos.</p>
          </div>
          {!loading && !error && projects.length > 0 && (
            <div className="hero-badge">{stats.total} projetos cadastrados</div>
          )}
        </div>
      </section>

      <main className="page-content">

        {!loading && !error && projects.length > 0 && (
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon stat-icon-total">📊</div>
              <div>
                <span>Total de projetos</span>
                <strong>{stats.total}</strong>
              </div>
            </div>
            <div className="stat-card stat-card-blue">
              <div className="stat-icon stat-icon-blue">🚀</div>
              <div>
                <span>Em andamento</span>
                <strong>{stats.active}</strong>
              </div>
            </div>
            <div className="stat-card stat-card-red">
              <div className="stat-icon stat-icon-red">⚠️</div>
              <div>
                <span>Alto risco</span>
                <strong>{stats.highRisk}</strong>
              </div>
            </div>
            <div className="stat-card stat-card-purple">
              <div className="stat-icon stat-icon-purple">✨</div>
              <div>
                <span>Análise IA</span>
                <strong>Disponível</strong>
              </div>
            </div>
          </section>
        )}

        {loading && (
          <div className="loading-block">
            <div className="spinner" />
            <p>Carregando projetos...</p>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        {!loading && !error && projects.length === 0 && (
          <div className="empty-card">
            <div className="empty-icon">📁</div>
            <h2>Nenhum projeto cadastrado</h2>
            <p>Crie o primeiro projeto para começar o acompanhamento.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setModalMode('create')}
            >
              Criar projeto
            </button>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <section className="table-section">
            <div className="table-section-header">
              <h2>Lista de projetos</h2>
              <p>Visualize, edite e analise todos os projetos cadastrados.</p>
            </div>
            <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Projeto</th>
                  <th>Status</th>
                  <th>Risco</th>
                  <th>Orçamento</th>
                  <th>Período</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div className="project-name-cell">
                        <strong>{project.name}</strong>
                        <small>
                          {project.description.length > 60
                            ? `${project.description.slice(0, 60)}...`
                            : project.description}
                        </small>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={project.status} />
                    </td>
                    <td>
                      <RiskBadge risk={project.risk} />
                    </td>
                    <td className="nowrap">{formatCurrency(project.budget)}</td>
                    <td className="nowrap date-cell">
                      {formatDate(project.startDate)}
                      <span>→ {formatDate(project.endDate)}</span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          type="button"
                          className="btn btn-action"
                          onClick={() => {
                            setSelectedProject(project);
                            setModalMode('detail');
                          }}
                        >
                          Detalhes
                        </button>
                        <button
                          type="button"
                          className="btn btn-action"
                          onClick={() => {
                            setSelectedProject(project);
                            setModalMode('edit');
                          }}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-action btn-ai-small"
                          onClick={() => void handleQuickAiAnalysis(project)}
                          disabled={
                            aiModal?.project.id === project.id && aiModal.loading
                          }
                        >
                          ✨ IA
                        </button>
                        <button
                          type="button"
                          className="btn btn-action btn-action-danger"
                          onClick={() => {
                            if (!canDelete(project.status)) {
                              setDeleteError(
                                'Projetos em andamento ou encerrados não podem ser excluídos.',
                              );
                              setDeleteTarget(project);
                              return;
                            }
                            setDeleteTarget(project);
                          }}
                          disabled={actionLoading === project.id}
                          title={
                            !canDelete(project.status)
                              ? 'Não é possível excluir'
                              : undefined
                          }
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </section>
        )}
      </main>

      {modalMode === 'create' && (
        <div className="modal-overlay" onClick={() => setModalMode(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>Novo projeto</h2>
              <button type="button" className="btn-icon" onClick={() => setModalMode(null)} aria-label="Fechar">×</button>
            </header>
            <ProjectForm onSubmit={handleCreate} onCancel={() => setModalMode(null)} />
          </div>
        </div>
      )}

      {modalMode === 'edit' && selectedProject && (
        <div className="modal-overlay" onClick={() => setModalMode(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>Editar projeto</h2>
              <button type="button" className="btn-icon" onClick={() => setModalMode(null)} aria-label="Fechar">×</button>
            </header>
            <ProjectForm
              initialData={selectedProject}
              onSubmit={handleUpdate}
              onCancel={() => setModalMode(null)}
            />
          </div>
        </div>
      )}

      {modalMode === 'detail' && selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => {
            setModalMode(null);
            setSelectedProject(null);
          }}
          onUpdated={handleProjectUpdated}
        />
      )}

      {aiModal && (
        <AiAnalysisModal
          projectName={aiModal.project.name}
          analysis={aiModal.analysis}
          loading={aiModal.loading}
          error={aiModal.error}
          onClose={() => setAiModal(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title={
            canDelete(deleteTarget.status)
              ? 'Excluir projeto'
              : 'Exclusão não permitida'
          }
          message={
            deleteError ??
            (canDelete(deleteTarget.status)
              ? `Deseja realmente excluir o projeto "${deleteTarget.name}"?`
              : 'Projetos em andamento ou encerrados não podem ser excluídos.')
          }
          confirmLabel={canDelete(deleteTarget.status) ? 'Excluir' : 'Entendi'}
          variant={canDelete(deleteTarget.status) ? 'danger' : 'default'}
          loading={actionLoading === deleteTarget.id}
          onConfirm={() => {
            if (!canDelete(deleteTarget.status) || deleteError) {
              setDeleteTarget(null);
              setDeleteError(null);
              return;
            }
            void handleDelete();
          }}
          onCancel={() => {
            setDeleteTarget(null);
            setDeleteError(null);
          }}
        />
      )}
    </div>
  );
}
