import api from '@/lib/axios';
import { LabSite, ApiResponse } from '@/types/lab-site/labsite';


export const getLabSites = async (): Promise<ApiResponse> => {
  const response = await api.get('core/labSite/');
  return response.data;
};
export const createLabSite = async (data: LabSite) => {
  
  return api.post('core/labSite/', data)
};
export const getLabSite = async (id: number) => api.get(`core/labSite/id/${id}`);

export const updateLabSite = async (id: number, data: LabSite) => {
  
  return api.post(`core/labSite/${id}/update`, data);
}
export const deleteLabSite = async (id: number) => api.post(`core/labSite/${id}/delete`);
