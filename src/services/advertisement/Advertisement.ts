import api from "@/lib/axios";
import { Advertisement, ApiResponse } from "@/types/advertisement/Advertisement";

export const getAllAdvertisements = async (
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  ordering: string = ""
): Promise<ApiResponse<Advertisement>> => {
  const params: any = {
    page,
    page_size: pageSize,
  };

  if (search) params.search = search;
  if (ordering) params.ordering = ordering;

  const response = await api.get<ApiResponse<Advertisement>>(
    "/advertisement/",
    { params }
  );

  return response.data;
};


export const getMyAdvertisements = async (): Promise<Advertisement[]> => {
  const response = await api.get<ApiResponse<Advertisement>>(
    "/advertisement/my_advertisements/"
  );

  const results = response.data?.results ?? response.data?.data ?? [];
  return Array.isArray(results) ? results : results ? [results] : [];
};


export const getAdvertisementById = async (
  id: string
): Promise<Advertisement> => {
  const response = await api.get<ApiResponse<Advertisement>>(
    `/advertisement/${id}/`
  );

  return response.data?.data as unknown as Advertisement;
};

export const createAdvertisement = async (
  data: FormData
): Promise<Advertisement> => {
  
  const response = await api.post<ApiResponse<Advertisement>>(
    "/advertisement/",
    data,
    {
      headers: { 
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data?.data as unknown as Advertisement;
};

export const updateAdvertisement = async (
  id: string,
  data: FormData | Partial<Advertisement>
): Promise<Advertisement> => {
  const response = await api.put<ApiResponse<Advertisement>>(
    `/advertisement/${id}/`,
    data,
    {
      headers:
        data instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
    }
  );

  return response.data?.data as unknown as Advertisement;
};

export const deleteAdvertisement = async (id: string): Promise<void> => {
  await api.delete(`/advertisement/${id}/`);
};

export const enableAdvertisement = async (
  id: string
): Promise<Advertisement> => {
  const response = await api.post<ApiResponse<Advertisement>>(
    `/advertisement/${id}/enable/`
  );

  return response.data?.data as unknown as Advertisement;
};

export const disableAdvertisement = async (
  id: string
): Promise<Advertisement> => {
  const response = await api.post<ApiResponse<Advertisement>>(
    `/advertisement/${id}/disable/`
  );

  return response.data?.data as unknown as Advertisement;
};
