import type {
  AiAnalysis,
  ApiError,
  CreateProjectPayload,
  Project,
  ProjectStatus,
} from '../types/project';

const API_BASE_URL =
  import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:3000';

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as ApiError | null;
    throw new Error(error?.message ?? 'Erro ao comunicar com a API.');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const projectsApi = {
  list: () => request<Project[]>('/projects'),

  getById: (id: string) => request<Project>(`/projects/${id}`),

  create: (payload: CreateProjectPayload) =>
    request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: Partial<CreateProjectPayload>) =>
    request<Project>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  remove: (id: string) =>
    request<void>(`/projects/${id}`, { method: 'DELETE' }),

  updateStatus: (id: string, status: ProjectStatus) =>
    request<Project>(`/projects/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getAiAnalysis: (id: string) =>
    request<AiAnalysis>(`/projects/${id}/ai-analysis`),
};
