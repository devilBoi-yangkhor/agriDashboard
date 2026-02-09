import api from "@/lib/axios";
import { Contact } from "@/types/Contact";

interface ApiResponse<T> {
  data: {
    results: results[];
  };
  message: string;
  status: string;
  statusCode: number;
  timestamp: number;
  results: results[];
}

interface results {
  results: Contact[];
}
export const getContacts = async (): Promise<ApiResponse<results[]>> => {
  const response = await api.get("/contact-management/");
  return response.data;
};
export const getContact = async (id: number) => {
  const response = await api.get(`/contact-management/${id}`);
  return response.data;
};
export const createContact = async (data: Contact) =>
  api.post("/contact-management/", data);

export const updateContact = async (id: number, data: Contact) =>
  api.put(`/contact-management/${id}/`, data);

export const deleteContact = async (id: number) =>
  api.delete(`/contact-management/${id}/`);
