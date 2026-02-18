import type { ApiError, ApiResponse } from '../types';

// Base API configuration - easy to update for backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Generic fetch wrapper
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        code: response.status.toString(),
        message: data.message || 'An error occurred',
      } as ApiError;
    }

    return {
      data,
      success: true,
    };
  } catch (error) {
    if ((error as ApiError).code) {
      throw error;
    }
    throw {
      code: 'NETWORK_ERROR',
      message: 'Failed to connect to server',
    } as ApiError;
  }
}

// API methods - replace mock calls with these when backend is ready

export const api = {
  // User endpoints
  user: {
    get: () => fetchApi('/user'),
    update: (data: unknown) => fetchApi('/user', { method: 'PUT', body: JSON.stringify(data) }),
  },

  // Jobs endpoints
  jobs: {
    list: () => fetchApi('/jobs'),
    get: (id: string) => fetchApi(`/jobs/${id}`),
  },

  // Fellows endpoints
  fellows: {
    list: () => fetchApi('/fellows'),
    connect: (id: string) => fetchApi(`/fellows/${id}/connect`, { method: 'POST' }),
  },

  // CV endpoints
  cv: {
    get: () => fetchApi('/cv'),
    save: (data: unknown) => fetchApi('/cv', { method: 'PUT', body: JSON.stringify(data) }),
  },

  // Awareness Test endpoints
  awarenessTest: {
    getQuestions: () => fetchApi('/awareness-test/questions'),
    submit: (answers: Record<number, number>) => 
      fetchApi('/awareness-test/submit', { method: 'POST', body: JSON.stringify(answers) }),
    getResults: () => fetchApi('/awareness-test/results'),
  },

  // Chat endpoints
  chat: {
    send: (message: string) => 
      fetchApi('/chat', { method: 'POST', body: JSON.stringify({ message }) }),
  },

  // Settings endpoints
  settings: {
    get: () => fetchApi('/settings'),
    update: (data: unknown) => fetchApi('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  },
};

export default api;
