import api from "@/lib/axios";
import { G2C } from "@/types/g2c";

interface ApiResponse<T> {
  data: results;
  message: string;
  status: string;
  statusCode: number;
  timestamp: number;
}

interface results {
  [x: string]: any;
  results: G2C[];
}

export const getG2Cs = async (): Promise<ApiResponse<G2C[]>> => {
  const response = await api.get("api-management/");
  return response.data;
};
export const createG2C = async (data: G2C) => {
  return api.post("api-management/", data);
};
export const getG2C = async (id: number) => api.get(`/api-management/${id}/`);

export const updateG2C = async (id: number, data: G2C) => {
  return api.put(`/api-management/${id}/`, data);
};

// export const updateG2C = async (id: number, data: G2C) =>
//   api.put(`/api-management/${id}/`, data);

export const deleteG2C = async (id: number) =>
  api.delete(`api-management/${id}/`);
