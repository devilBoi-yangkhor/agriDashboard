import api from "@/lib/axios";
import { Role } from "@/types/Role";

interface ApiResponse<T> {
  data: results[];
  message: string;
  status: string;
  statusCode: number;
  timestamp: number;
  results: results[];
}

interface results {
  results: Role[];
}
export const getRoles = async (): Promise<ApiResponse<any[]>> => {
  const response = await api.get("/user-management/roles/");
  return response.data;
};
export const getRole = async (id: number) => {
  const response = await api.get(`/user-management/roles/${id}`);
  return response.data;
};
export const createRole = async (data: Role) =>
  api.post("/user-management/roles/", data);

export const updateRole = async (id: number, data: Role) =>
  api.put(`/user-management/roles/${id}/`, data);

export const deleteRole = async (id: number) =>
  api.delete(`/user-management/roles/${id}/`);

export const getRoleDropdowns = async () => {
  const response = await api.get(`/user-management/roles-dropdown/`);
  return response.data;
};
