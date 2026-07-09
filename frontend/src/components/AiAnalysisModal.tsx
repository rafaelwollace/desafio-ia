import type { AiAnalysis } from '../types/project';

interface AiAnalysisModalProps {
  projectName: string;
  analysis: AiAnalysis | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

export function AiAnalysisModal({
  projectName,
  analysis,
  loading,
  error,
  onClose,
}: AiAnalysisModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal-ai"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <div>
            <span className="modal-label">Análise com IA</span>
            <h2>{projectName}</h2>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </header>

        {loading && (
          <div className="loading-block">
            <div className="spinner" />
            <p>Gerando análise inteligente...</p>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        {analysis && !loading && (
          <div className="ai-results">
            <article className="ai-card ai-card-summary">
              <div className="ai-card-icon">📋</div>
              <div>
                <h4>Resumo do projeto</h4>
                <p>{analysis.summary}</p>
              </div>
            </article>

            <article className="ai-card ai-card-attention">
              <div className="ai-card-icon">⚠️</div>
              <div>
                <h4>Pontos de atenção</h4>
                <ul>
                  {analysis.attentionPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>

            <article className="ai-card ai-card-recommendation">
              <div className="ai-card-icon">💡</div>
              <div>
                <h4>Recomendação executiva</h4>
                <p>{analysis.executiveRecommendation}</p>
              </div>
            </article>
          </div>
        )}

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
