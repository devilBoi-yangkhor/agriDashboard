"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XCircle, Upload } from "lucide-react";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  formData: any;
  setFormData: any;
  handleSubmit: (e: any) => void;
  isSaving: boolean;
  imagePreview: string | null;
  handleFileChange: (e: any) => void;

  dzongkhagList: any[];
  gewogList: any[];
  chiwogList: any[];
  categoryList: any[];
  unitList: any[];
  statusList: any[];

  filteredGewogs: any[];
  filteredChiwogs: any[];

  selectedDzongkhag: string;
  setSelectedDzongkhag: (v: string) => void;
  selectedGewog: string;
  setSelectedGewog: (v: string) => void;
}

const AddProductModal = ({
  open,
  onClose,
  formData,
  setFormData,
  handleSubmit,
  isSaving,
  imagePreview,
  handleFileChange,

  dzongkhagList,
  // gewogList,
  // chiwogList,
  categoryList,
  unitList,
  statusList,

  filteredGewogs,
  filteredChiwogs,

  selectedDzongkhag,
  setSelectedDzongkhag,
  selectedGewog,
  setSelectedGewog,
}: AddProductModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] max-w-4xl overflow-hidden rounded-2xl bg-white p-0 shadow-xl">
        <div className="sticky top-0 z-10 border-b bg-white p-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-900">
              Add New Product
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-10">
          <form onSubmit={handleSubmit} className="mt-6 space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter product title"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Price *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Category *
                </label>
                <select
                  required
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2"
                  value={formData.category || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  {categoryList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Unit *
                </label>
                <select
                  required
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2"
                  value={formData.unit || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                >
                  <option value="">Select Unit</option>
                  {unitList.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2"
                  value={formData.stock || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: Number(e.target.value) })
                  }
                />
              </div>

              {/* Seller */}
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Seller ID *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2"
                  value={formData.seller || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, seller: Number(e.target.value) })
                  }
                />
              </div>

              {/* Status (required) */}
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Status *
                </label>
                <select
                  required
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2"
                  value={formData.status || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="">Select Status</option>
                  {statusList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dzongkhag */}
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Dzongkhag
                </label>
                <select
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2"
                  value={selectedDzongkhag}
                  onChange={(e) => {
                    setSelectedDzongkhag(e.target.value);
                    setFormData({ ...formData, dzongkhag: e.target.value });
                  }}
                >
                  <option value="">Select Dzongkhag</option>
                  {dzongkhagList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gewog */}
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Gewog
                </label>
                <select
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2"
                  value={selectedGewog}
                  onChange={(e) => {
                    setSelectedGewog(e.target.value);
                    setFormData({ ...formData, gewog: e.target.value });
                  }}
                >
                  <option value="">Select Gewog</option>
                  {filteredGewogs.map((g: any) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chiwog / Village */}
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Chiwog / Village
                </label>
                <select
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2"
                  value={formData.chiwog || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, chiwog: e.target.value })
                  }
                >
                  <option value="">Select Chiwog</option>
                  {filteredChiwogs.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Latitude */}
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2"
                  value={formData.latitude || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                />
              </div>

              {/* Longitude */}
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2"
                  value={formData.longitude || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="mb-1 block font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  required
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Image */}
              <div className="col-span-2">
                <label className="mb-2 block font-medium text-gray-700">
                  Product Photo
                </label>
                <div className="flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                  <label className="flex cursor-pointer flex-col items-center text-green-600">
                    <Upload className="mb-3 h-8 w-8" />
                    <span>Upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {imagePreview && (
                    <img
                      src={imagePreview}
                      className="mt-4 h-40 w-40 rounded-xl border object-cover shadow"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-xl px-6 py-3"
              >
                <XCircle className="mr-2 h-4 w-4" /> Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-green-600 px-6 py-3 text-white"
              >
                {isSaving ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
