import api from "@/lib/axios";
import { ApiResponse } from "@/types/advertisement/Advertisement";
import { Order } from "@/types/order/Order";

export const getAllOrders = async (): Promise<Order[]> => {
  const response = await api.get<ApiResponse<Order[]>>(
    "/orders/orders/"
  );

  return response.data?.results ?? response.data?.data ?? [];
};
export const deleteOrder = async (id: string): Promise<void> => {
  await api.delete(`api/orders/orders/${id}/`);
};
