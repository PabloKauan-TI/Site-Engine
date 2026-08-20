import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export function getApiBaseUrl(): string {
  // SSR / servidor Node
  if (typeof window === "undefined") {
    const internalUrl =
      (typeof process !== "undefined" &&
        (process.env.INTERNAL_API_URL || process.env.API_URL)) ||
      "http://enginelab.ufc.br/back/api";

    return internalUrl.replace(/\/$/, "");
  }

  // Browser
  // Usa a mesma origem do site.
  // Exemplo:
  // https://enginelab.ufc.br/back/api/projects
  return "/back/api";
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
