import { useEffect, useState } from 'react';
import type { CreateProjectPayload, Project } from '../types/project';

interface ProjectFormProps {
  initialData?: Project | null;
  onSubmit: (payload: CreateProjectPayload) => Promise<void>;
  onCancel: () => void;
}

interface FormState {
  name: string;
  startDate: string;
  endDate: string;
  budget: string;
  description: string;
}

const emptyForm: FormState = {
  name: '',
  startDate: '',
  endDate: '',
  budget: '',
  description: '',
};

export function ProjectForm({
  initialData,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        budget: String(initialData.budget),
        description: initialData.description,
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleChange = (
    field: keyof FormState,
    value: string,
  ): void => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setError(null);

    if (!form.name.trim() || form.name.trim().length < 3) {
      setError('Informe um nome com pelo menos 3 caracteres.');
      return;
    }

    if (!form.startDate || !form.endDate) {
      setError('Informe as datas de início e término.');
      return;
    }

    if (form.endDate <= form.startDate) {
      setError('A previsão de término deve ser posterior à data de início.');
      return;
    }

    const budget = Number(form.budget);
    if (!budget || budget <= 0) {
      setError('Informe um orçamento válido maior que zero.');
      return;
    }

    if (!form.description.trim()) {
      setError('Informe a descrição do projeto.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        budget,
        description: form.description.trim(),
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Erro ao salvar projeto.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Nome
          <input
            value={form.name}
            onChange={(event) => handleChange('name', event.target.value)}
            placeholder="Nome do projeto"
          />
        </label>

        <label>
          Data de início
          <input
            type="date"
            value={form.startDate}
            onChange={(event) => handleChange('startDate', event.target.value)}
          />
        </label>

        <label>
          Previsão de término
          <input
            type="date"
            value={form.endDate}
            onChange={(event) => handleChange('endDate', event.target.value)}
          />
        </label>

        <label>
          Orçamento total (R$)
          <input
            type="number"
            min="1"
            step="0.01"
            value={form.budget}
            onChange={(event) => handleChange('budget', event.target.value)}
          />
        </label>
      </div>

      <label>
        Descrição
        <textarea
          rows={4}
          value={form.description}
          onChange={(event) => handleChange('description', event.target.value)}
          placeholder="Descreva o escopo e objetivos do projeto"
        />
      </label>

      {!initialData && (
        <p className="hint">
          O status inicial será definido automaticamente como <strong>Em análise</strong>.
        </p>
      )}

      {error && <p className="error-message">{error}</p>}

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Salvando...' : initialData ? 'Salvar alterações' : 'Criar projeto'}
        </button>
      </div>
    </form>
  );
}
