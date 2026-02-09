import api from '@/lib/axios';
import { Organisation, ApiResponse } from '@/types/organisation/Organisation';


export const getOrganisations = async (): Promise<ApiResponse> => {
  const response = await api.get('core/public/clientList');
  return response.data;
};
export const createOrganisation = async (data: Organisation) => {
  
  return api.post('core/public/clientList/', data)
};
export const getOrganisation = async (id: number) => api.get(`core/public/clientList/${id}`);

export const updateOrganisation = async (id: number, data: Organisation) => {
  
  return api.post(`core/public/clientList/${id}/update`, data);
}
export const deleteOrganisation = async (id: number) => api.post(`core/public/clientList/${id}/delete`);
