import api from "@/lib/axios";
import { Privilege } from "@/types/Privilege";

interface ApiResponse {
  data: Privilege[];
}
export const getPrivileges = async (): Promise<ApiResponse> => {
  const response = await api.get("/user-management/permissions/");
  return response.data;
};

export const getPrivilegeList = async (): Promise<ApiResponse> => {
  const response = await api.get("/user-management/permission-list/");
  return response.data;
};
