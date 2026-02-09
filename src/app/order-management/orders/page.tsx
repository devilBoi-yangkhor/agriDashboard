"use client";

import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { getAllOrders, deleteOrder } from "@/services/order/Order";
import { Order } from "@/types/order/Order";
import { toast } from "react-toastify";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        console.error("Error loading orders:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  /** DELETE ORDER */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      await deleteOrder(id);

      // Remove from UI instantly
      setOrders((prev) => prev.filter((order) => order.id !== id));

      toast.success("Order deleted successfully");
    } catch (err) {
      console.error("Error deleting order:", err);
      toast.error("Failed to delete order");
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Order Management" parentPage="Orders" />

      <div className="rounded-lg border bg-white p-4 shadow">
        <h1 className="mb-4 text-xl font-semibold">All Orders</h1>

        {/* LOADING */}
        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading...</div>
        ) : orders.length === 0 ? (
          /* NO DATA */
          <div className="py-8 text-center text-gray-500">No Orders Found</div>
        ) : (
          /* TABLE */
          <table className="w-full table-auto border-collapse text-left">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-3">#</th>
                <th className="p-3">Buyer Name</th>
                <th className="p-3">Buyer Phone</th>
                <th className="p-3">Product</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Dzongkhag</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>

                  {/* Buyer Name */}
                  <td className="p-3">
                    {order.shipping_address?.full_name ?? "N/A"}
                  </td>

                  {/* Buyer Phone */}
                  <td className="p-3">
                    {order.shipping_address?.phone ?? "N/A"}
                  </td>

                  {/* Product Name */}
                  <td className="p-3">{order.product_name ?? "N/A"}</td>

                  {/* Quantity */}
                  <td className="p-3">{order.quantity ?? 0}</td>

                  {/* Dzongkhag */}
                  <td className="p-3">
                    {order.shipping_address?.dzongkhag ?? "N/A"}
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    <span
                      className={`rounded px-3 py-1 text-sm ${
                        order.order_status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.order_status ?? "Pending"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(order.id!)}
                      className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DefaultLayout>
  );
};

export default OrdersPage;
