// src/services/productService.ts
import axios from "@/lib/axios";
import api from "@/lib/axios";
import { Product } from "@/types/product/Product";

// Define a response type to match your API
interface ApiResponse<T> {
  data?: {
    results?: T;
  };
  results?: T;
}

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await api.get<ApiResponse<Product[]>>("/product/");
  // Handle different API response structures
  if (response.data?.data?.results) {
    return response.data.data.results;
  } else if (response.data?.results) {
    return response.data.results;
  } else if (Array.isArray(response.data)) {
    return response.data;
  }
  return [];
};

export const getProductsByUser = async (userId: string): Promise<Product[]> => {
  const response = await api.get<ApiResponse<Product[]>>(`/product/?seller=${userId}`);
  // Handle different API response structures
  if (response.data?.data?.results) {
    return response.data.data.results;
  } else if (response.data?.results) {
    return response.data.results;
  } else if (Array.isArray(response.data)) {
    return response.data;
  }
  return [];
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get<Product>(`/product/${id}/`);
  return response.data;
};

export const createProduct = async (data: FormData | Partial<Product>): Promise<Product> => {
  const isFormData = data instanceof FormData;
  const headers = isFormData
    ? { "Content-Type": "multipart/form-data" }
    : { "Content-Type": "application/json" };

  console.log("Creating product with:", data);
  const response = await api.post<Product>("/product/", data, { headers });
  return response.data;
};

// In your ProductService.ts file
export const updateProduct = async (productId: string, data: any): Promise<Product> => {
  console.log(`Updating product ${productId} with:`, data);
  const response = await api.put<Product>(`/product/${productId}/`, data);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  console.log(`Deleting product ${id}`);
  await api.delete(`/product/${id}/`);
};