import { Master } from "@/types/master/master";
import api from "@/lib/axios";
import axios from "axios";

interface ApiResponse<T> {
  flatMap(arg0: (gwItem: any) => any): unknown;
  data: T;
  message: string;
  status: string;
  statusCode: number;
  timestamp: number;
}

interface Results {
  results: Master[];
  count: number;
  next: number | null;
  previous: number | null;
}

export const getMastersByType = async (
  type: string,
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  ordering: string = "",
): Promise<ApiResponse<Results>> => {
  const queryParams = new URLSearchParams({
    type,
    page: page.toString(),
    page_size: pageSize.toString(),
    ...(search && { search }),
    ...(ordering && { ordering }),
  });

  const response = await api.get(
    `master-management/?${queryParams.toString()}`,
  );
  return response.data;
};

// export const getParentMastersByType = async (
// type: string, dz_id: string,
// ): Promise<ApiResponse<any[]>> => {
//   const response = await api.get(`master-management/parent/?type=${type}`);
//   return response.data;
// };
export const getParentMastersByType = async (
  type: string
): Promise<ApiResponse<any[]>> => {
  const response = await api.get(`master-management/parent/?type=${type}`);
  return response.data;
};

export const createMaster = async (data: Master) =>
  api.post("master-management/", data);

export const getMasterById = async (id: number) =>
  api.get(`master-management/${id}`);

export const updateMaster = async (id: number, data: Master) =>
  api.put(`master-management/${id}/`, data);

export const deleteMaster = async (id: number) =>
  api.delete(`master-management/${id}/`);
