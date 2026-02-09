import api from '@/lib/axios';
import { SampleType, ApiResponse } from '@/types/sample/sample';


export const getSampleTypes = async (): Promise<ApiResponse> => {
  const response = await api.get('core/SampleTestType/');
  return response.data;
};
export const createSampleType = async (data: SampleType) => {
  
  return api.post('core/SampleTestType/', data)
};
export const getSampleType = async (id: number) => api.get(`core/SampleTestType/id/${id}`);

export const updateSampleType = async (id: number, data: SampleType) => {
  
  return api.post(`core/SampleTestType/${id}/update`, data);
}
export const deleteSampleType = async (id: number) => api.post(`core/SampleTestType/${id}/delete`);
