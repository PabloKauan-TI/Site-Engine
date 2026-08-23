import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export function getApiBaseUrl(): string {
  // SSR / servidor Node (rodando dentro do container enginelab-frontend)
  if (typeof window === "undefined") {
    return import.meta.env.VITE_INTERNAL_API_URL || import.meta.env.VITE_API_URL || "http://enginelab-backend:8000/api";
  }

  // Browser (rodando no seu Windows ou no navegador do cliente)
  return import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
}

export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptador para garantir que a URL base correta (SSR ou Browser) seja usada em cada requisição
api.interceptors.request.use((config) => {
  if (!config.baseURL) {
    config.baseURL = getApiBaseUrl();
  }
  return config;
});

export async function apiRequest<T>(path: string, config: AxiosRequestConfig = {}): Promise<T> {
  try {
    const normalizedUrl = path.startsWith("/") ? path : `/${path}`;
    const response: AxiosResponse<T> = await api.request<T>({
      url: normalizedUrl,
      ...config,
    });

    if (response.status === 204) {
      return {} as T;
    }

    return response.data;
  } catch (err) {
    const error = err as AxiosError<{
      message?: string;
      error?: string;
      errors?: Record<string, string[]>;
    }>;

    const data = error.response?.data;

    // Check for Laravel validation error bag
    if (data?.errors && typeof data.errors === "object") {
      const firstField = Object.keys(data.errors)[0];
      if (firstField && Array.isArray(data.errors[firstField]) && data.errors[firstField].length > 0) {
        throw new Error(data.errors[firstField][0]);
      }
    }

    const message = data?.message || data?.error || error.message || "Erro na requisição";
    throw new Error(message);
  }
}
