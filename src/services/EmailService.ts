import axios from "axios";
import { Email } from "@/types/Email";

export const getEmails = async () => {
  return await axios.get("/api/emails");
};

export const getEmailById = async (id: number) => {
  return await axios.get(`/api/emails/${id}`);
};

export const createEmail = async (email: Email) => {
  return await axios.post("/api/emails", email);
};

export const updateEmail = async (id: number, email: Email) => {
  return axios.put(`/api/emails/${id}`, email);
};
export const deleteEmail = async (id: number) => {
  return await axios.delete(`/api/emails/${id}`);
};
