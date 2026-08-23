import { apiRequest } from "./api-client";

export interface UserPayload {
  name: string;
  email: string;
  password?: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
}

export async function loginUser(credentials: { email: string; password: string }) {
  return apiRequest<{ user: UserResponse }>("/users/login", {
    method: "POST",
    data: credentials,
  });
}

export async function logoutUser() {
  return apiRequest<void>("/users/logout", {
    method: "POST",
  });
}

export async function fetchUsers(): Promise<UserResponse[]> {
  return apiRequest<UserResponse[]>("/users");
}

export async function fetchUser(id: string): Promise<UserResponse> {
  return apiRequest<UserResponse>(`/users/${id}`);
}

export async function createUser(data: UserPayload): Promise<UserResponse> {
  return apiRequest<UserResponse>("/users", {
    method: "POST",
    data,
  });
}

export async function updateUser(id: string, data: UserPayload): Promise<UserResponse> {
  return apiRequest<UserResponse>(`/users/${id}`, {
    method: "PUT",
    data,
  });
}

export async function deleteUser(id: string) {
  return apiRequest<void>(`/users/${id}`, {
    method: "DELETE",
  });
}
