import api from "@/lib/axios";
import { Query, HistoryItem } from "@/types/Query";

interface ApiResponse<T> {
  data: T;
  message: string;
  status: string;
  statusCode: number;
  timestamp: number;
}

interface Results {
  results: Query[];
  count: number;
  next: number | null;
  previous: number | null;
}
export const getQuerysByType = async (
  type: string = '',
  page: number,
  pageSize: number,
  search: string = '',
  ordering: string = '',
  filters: Record<string, string> = {}
) => {
  // Start with base parameters
  const params: Record<string, string> = {
    type: type,
    page: page.toString(),
    page_size: pageSize.toString(),
  };

  // Add optional parameters if they have values
  if (search) params.search = search;
  if (ordering) params.ordering = ordering;

  // Add filter parameters (only non-empty ones)
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params[key] = value;
    }
  });

  // Convert to URLSearchParams
  const queryString = new URLSearchParams(params).toString();
  
  const response = await api.get(`query-management/?${queryString.toString()}`);
  return response.data;
};

export const getQueriesByTypeAndNumberOrEmail = async(type: string, numberOrEmail: string): Promise<ApiResponse<[]>> => {
  const queryParams = new URLSearchParams({
    type,
    number_or_email: numberOrEmail,
  });

  const response = await api.get(`query-management/${type}/${numberOrEmail}`);
  return response.data;
}

// export const getParentQuerysByType = async (
//   type: string,
// ): Promise<ApiResponse<any[]>> => {
//   const response = await api.get(`query-management/parent/?type=${type}`);
//   return response.data;
// };
export const getEnquiryHistory = async (id: number): Promise<HistoryItem[]> => {
  const response = await api.get(`core/auditlog/?object_pk=${id}`);
  return response.data;
};

export const createQuery = async (data: Query) =>
  api.post("query-management/", data);

export const getQueryById = async (id: number) =>
  api.get(`query-management/${id}`);

export const updateQuery = async (id: number, data: Query) =>
  api.put(`query-management/${id}/`, data);

export const deleteQuery = async (id: number) =>
  api.delete(`query-management/${id}/`);
