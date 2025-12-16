// ==========================================
// Cliente HTTP base
// ==========================================

import { API_BASE_URL, DEFAULT_HEADERS, REQUEST_TIMEOUT } from '@/config/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = REQUEST_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new ApiError(
      errorData?.message || `HTTP Error: ${response.status}`,
      response.status,
      errorData
    );
  }
  return response.json();
}

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: DEFAULT_HEADERS,
    });
    return handleResponse<T>(response);
  },

  async post<T, D = unknown>(endpoint: string, data: D): Promise<T> {
    const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  async put<T, D = unknown>(endpoint: string, data: D): Promise<T> {
    const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: DEFAULT_HEADERS,
    });
    return handleResponse<T>(response);
  },
};

export { ApiError };
