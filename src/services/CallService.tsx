import axios from "axios";
import { Call } from "@/types/Call";

export const getCalls = async () => {
  return await axios.get("/api/calls");
};

export const getCallById = async (id: number) => {
  return await axios.get(`/api/calls/${id}`);
};

export const createCall = async (call: Call) => {
  return await axios.post("/api/calls", call);
};

export const updateCall = async (id: number, call: Call) => {
  return axios.put(`/api/calls/${id}`, call);
};
export const deleteCall = async (id: number) => {
  return await axios.delete(`/api/calls/${id}`);
};
