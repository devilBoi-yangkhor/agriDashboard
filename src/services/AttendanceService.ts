import api from "@/lib/axios";
import { Attendance } from "@/types/Attendance";

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
  results: Attendance[];
}
export const getAttendances = async (): Promise<ApiResponse<results[]>> => {
  const response = await api.get("/attendance-management/");
  return response.data;
};

export const getAttendance = async (id: number) => {
  const response = await api.get(`/attendance-management/${id}`);
  return response.data;
};
export const createAttendance = async (data: Attendance) =>
  api.post("/attendance-management/", data);

export const updateAttendance = async (id: number, data: Attendance) =>
  api.put(`/attendance-management/${id}/`, data);

export const deleteAttendance = async (id: number) =>
  api.delete(`/attendance-management/${id}/`);

export const getAttendanceDropdowns = async () => {
  const response = await api.get(`/attendance-management/roles-dropdown/`);
  return response.data;
};
