import { useState } from 'react';
import type { AiAnalysis } from '../types/project';
import { projectsApi } from '../services/api';
import { AiAnalysisModal } from './AiAnalysisModal';

interface AiAnalysisPanelProps {
  projectId: string;
  projectName: string;
}

export function AiAnalysisPanel({
  projectId,
  projectName,
}: AiAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<AiAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleGenerate = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setShowModal(true);

    try {
      const result = await projectsApi.getAiAnalysis(projectId);
      setAnalysis(result);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Erro ao gerar análise.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="ai-panel">
        <div className="ai-panel-header">
          <div>
            <h3>Análise com IA</h3>
            <p className="ai-panel-subtitle">
              Gere insights automáticos sobre riscos e recomendações.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ai"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Gerando...' : '✨ Gerar análise'}
          </button>
        </div>

        {analysis && !showModal && (
          <div className="ai-preview" onClick={() => setShowModal(true)}>
            <p>{analysis.summary}</p>
            <span>Clique para ver análise completa →</span>
          </div>
        )}
      </section>

      {showModal && (
        <AiAnalysisModal
          projectName={projectName}
          analysis={analysis}
          loading={loading}
          error={error}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
