import { api, apiRequest } from "./api-client";
import type { ApiMember, ApiNews, ApiProject, ApiPublication } from "./engine-api";
import { fetchMembers, fetchNews, fetchProjects, fetchPublications } from "./engine-api";
import { fetchUsers, type UserResponse } from "./user-api";

export interface DashboardStats {
  membersCount: number;
  projectsCount: number;
  newsCount: number;
  publicationsCount: number;
  usersCount: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [members, projects, news, publications, users] = await Promise.all([
    fetchMembers().catch(() => []),
    fetchProjects().catch(() => []),
    fetchNews().catch(() => []),
    fetchPublications().catch(() => []),
    fetchUsers().catch(() => []),
  ]);

  return {
    membersCount: members.length,
    projectsCount: projects.length,
    newsCount: news.length,
    publicationsCount: publications.length,
    usersCount: users.length,
  };
}

// ---------------- Members CRUD ----------------
export async function getAdminMembers(): Promise<ApiMember[]> {
  return apiRequest<ApiMember[]>("/members");
}

export async function createMember(data: FormData | Record<string, unknown>): Promise<ApiMember> {
  if (data instanceof FormData) {
    const response = await api.postForm<ApiMember>("/members", data);
    return response.data;
  }
  return apiRequest<ApiMember>("/members", {
    method: "POST",
    data,
  });
}

export async function updateMember(id: number | string, data: FormData | Record<string, unknown>): Promise<ApiMember> {
  if (data instanceof FormData) {
    // Add _method=PUT to support Laravel's form method spoofing if the route requires it.
    data.append("_method", "PUT");
    const response = await api.postForm<ApiMember>(`/members/${id}`, data);
    return response.data;
  }
  return apiRequest<ApiMember>(`/members/${id}`, {
    method: "PUT",
    data,
  });
}

export async function deleteMember(id: number | string): Promise<void> {
  return apiRequest<void>(`/members/${id}`, {
    method: "DELETE",
  });
}

export interface CsvImportResult {
  message: string;
  criados: number;
  ignorados: number;
  erros: string[];
  membros: ApiMember[];
}

export async function importMembersCsv(file: File): Promise<CsvImportResult> {
  const formData = new FormData();
  formData.append("csv", file);
  const response = await api.post<CsvImportResult>("/members/import-csv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

// ---------------- Projects CRUD ----------------
export async function getAdminProjects(): Promise<ApiProject[]> {
  return apiRequest<ApiProject[]>("/projects");
}

export async function createProject(data: Partial<ApiProject>): Promise<ApiProject> {
  return apiRequest<ApiProject>("/projects", {
    method: "POST",
    data,
  });
}

export async function updateProject(id: number | string, data: Partial<ApiProject>): Promise<ApiProject> {
  return apiRequest<ApiProject>(`/projects/${id}`, {
    method: "PUT",
    data,
  });
}

export async function deleteProject(id: number | string): Promise<void> {
  return apiRequest<void>(`/projects/${id}`, {
    method: "DELETE",
  });
}

// ---------------- News CRUD ----------------
export async function getAdminNews(): Promise<ApiNews[]> {
  return apiRequest<ApiNews[]>("/news");
}

export async function createNews(data: FormData | Partial<ApiNews>): Promise<ApiNews> {
  if (data instanceof FormData) {
    const response = await api.postForm<ApiNews>("/news", data);
    return response.data;
  }
  return apiRequest<ApiNews>("/news", {
    method: "POST",
    data,
  });
}

export async function updateNews(id: number | string, data: FormData | Partial<ApiNews>): Promise<ApiNews> {
  if (data instanceof FormData) {
    // Add _method=PUT to support Laravel's form method spoofing if the route requires it.
    data.append("_method", "PUT");
    const response = await api.postForm<ApiNews>(`/news/${id}`, data);
    return response.data;
  }
  return apiRequest<ApiNews>(`/news/${id}`, {
    method: "PUT",
    data,
  });
}

export async function deleteNews(id: number | string): Promise<void> {
  return apiRequest<void>(`/news/${id}`, {
    method: "DELETE",
  });
}

// ---------------- Publications CRUD ----------------
export async function getAdminPublications(): Promise<ApiPublication[]> {
  return apiRequest<ApiPublication[]>("/publications");
}

export async function createPublication(data: Partial<ApiPublication>): Promise<ApiPublication> {
  return apiRequest<ApiPublication>("/publications", {
    method: "POST",
    data,
  });
}

export async function updatePublication(id: number | string, data: Partial<ApiPublication>): Promise<ApiPublication> {
  return apiRequest<ApiPublication>(`/publications/${id}`, {
    method: "PUT",
    data,
  });
}

export async function deletePublication(id: number | string): Promise<void> {
  return apiRequest<void>(`/publications/${id}`, {
    method: "DELETE",
  });
}
