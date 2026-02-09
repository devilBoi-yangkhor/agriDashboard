"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const formatLocation = (loc: any) => {
  if (!loc || typeof loc !== "object" || Object.keys(loc).length === 0)
    return "No Location";

  const lat = loc.latitude ?? loc.lat ?? "";
  const lon = loc.longitude ?? loc.lng ?? "";

  return lat && lon ? `${lat}, ${lon}` : "No Location";
};

const ViewProductModal = ({ open, onClose, product, getImageUrl }: any) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl rounded-xl bg-white p-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex items-center justify-center bg-gray-50 p-6">
            {product.photos?.length ? (
              <img
                src={getImageUrl(product.photos[0])}
                className="h-auto w-full rounded-xl object-cover shadow-md"
              />
            ) : (
              <div
                className="flex h-72 w-full items-center justify-center 
              rounded-xl border border-dashed bg-gray-100 text-gray-400"
              >
                No Image Available
              </div>
            )}
          </div>

          <div className="p-8">
            <h2 className="text-3xl font-bold">{product.title}</h2>
            <p className="mt-2 text-gray-700">{product.description}</p>

            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <p>
                <strong>Category:</strong>{" "}
                {(product.category as any)?.name ?? "-"}
              </p>

              <p>
                <strong>Unit:</strong> {(product.unit as any)?.name ?? "-"}
              </p>

              <p>
                <strong>Status:</strong> {(product.status as any)?.name ?? "-"}
              </p>
              <p>
                <strong>Price:</strong> Nu. {product.price}
              </p>

              <p>
                <strong>Discount:</strong>{" "}
                {product.discount ? `Nu. ${product.discount}` : "None"}
              </p>

              <p>
                <strong>Discounted Price:</strong>{" "}
                {product.discounted_price
                  ? `Nu. ${product.discounted_price}`
                  : "-"}
              </p>
              <p>
                <strong>Organic:</strong> {product.organic ? "Yes" : "No"}
              </p>

              <p>
                <strong>Minimum Order Qty:</strong> {product.min_order_qty}
              </p>
              <p>
                <strong>Stock:</strong> {product.stock}
              </p>
              <p>
                <strong>Has Coordinates:</strong>{" "}
                {product.has_coordinates ? "Yes" : "No"}
              </p>

              <p>
                <strong>Location:</strong> {formatLocation(product.location)}
              </p>

              <p>
                <strong>Seller Name:</strong>{" "}
                {(product.seller as any)?.contact_person ?? "-"}
              </p>

              <p>
                <strong>Seller Email:</strong>{" "}
                {(product.seller as any)?.email ?? "-"}
              </p>
              <p className="text-xs text-gray-400">
                Created: {new Date(product.created_at || "").toLocaleString()}
              </p>

              <p className="text-xs text-gray-400">
                Updated: {new Date(product.updated_at || "").toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProductModal;
