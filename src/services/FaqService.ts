import api from "@/lib/axios";
import { FAQ } from "@/types/faq";

interface ApiResponse<T> {
  data: results;
  message: string;
  status: string;
  statusCode: number;
  timestamp: number;
}

interface results {
  [x: string]: any;
  results: FAQ[];
}

export const getFaqs = async (): Promise<ApiResponse<FAQ[]>> => {
  const response = await api.get("faq-management/");
  return response.data;
};
export const createFaq = async (data: FAQ) => {
  return api.post("faq-management/", data);
};
export const getFaq = async (id: number) => api.get(`/faq-management/${id}/`);

export const updateFaq = async (id: number, data: FAQ) => {
  return api.patch(`/faq-management/${id}/`, data);
};
export const deleteFaq = async (id: number) =>
  api.delete(`faq-management/${id}/`);
