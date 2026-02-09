// EditProductModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XCircle, X } from "lucide-react";
import { updateProduct } from "../../../services/product/ProductService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getParentMastersByType } from "../../../services/master/MasterService";

type EditProductModalProps = {
  open: boolean;
  onClose: () => void;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e?: any) => Promise<void>;
  isSaving: boolean;
  imagePreview: string | null;
  onSuccess: () => void;
  categoryList: any[];
  unitList: any[];
  statusList: any[];
};

// Helper function to safely get value
const getSafeValue = (value: any): string => {
  if (value === null || value === undefined) return "";
  
  // If it's an object with id property
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return value.id.toString();
  }
  
  // If it's already a string or number
  return value.toString();
};

const getImageUrl = (path?: string | any) => {
  if (!path) return "/images/placeholder.jpg";
  
  // If it's already a full URL
  if (typeof path === 'string' && path.startsWith("http")) {
    return path;
  }
  
  // If it's an object, try to extract the path
  if (typeof path === 'object' && path !== null) {
    path = path.image || path.url || path;
  }
  
  // If we still don't have a string, return placeholder
  if (typeof path !== 'string') {
    return "/images/placeholder.jpg";
  }
  
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/v1$/, "") || "http://localhost:8000";
  return `${base}${path}`;
};

// Helper for boolean values
const getBooleanValue = (value: any): "true" | "false" => {
  if (typeof value === 'boolean') {
    return value ? "true" : "false";
  }
  if (value === "true" || value === true || value === 1 || value === "1") {
    return "true";
  }
  return "false";
};

// Function to remove an image
const removeImage = (photos: any[], index: number) => {
  return photos.filter((_, i) => i !== index);
};

const EditProductModal = ({
  open,
  onClose,
  formData,
  setFormData,
  onSuccess,
  categoryList,
  unitList,
  statusList,
}: EditProductModalProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removedPhotos, setRemovedPhotos] = useState<number[]>([]);
  const [uomData, setUomData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loadingUom, setLoadingUom] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);

  // Fetch UOM data from MasterService when modal opens
  useEffect(() => {
    const fetchUomData = async () => {
      if (open) {
        setLoadingUom(true);
        try {
          console.log("📡 Fetching UOM data from MasterService...");
          
          // Call MasterService API
          const response = await getParentMastersByType("uom");
          console.log("✅ UOM API Response:", response);
          
          // Extract data from response
          if (response && response.data) {
            setUomData(response.data);
            console.log(`✅ Loaded ${response.data.length} UOM items`);
          } else {
            console.warn("⚠️ Unexpected UOM response format:", response);
            setUomData(unitList || []);
          }
        } catch (error) {
          console.error("❌ Failed to fetch UOM data:", error);
          toast.error("Failed to load unit options");
          setUomData(unitList || []);
        } finally {
          setLoadingUom(false);
        }
      }
    };

    fetchUomData();
  }, [open, unitList]);

  // Fetch Category data from MasterService when modal opens
  useEffect(() => {
    const fetchCategoryData = async () => {
      if (open) {
        setLoadingCategory(true);
        try {
          console.log("📡 Fetching Category data from MasterService...");
          
          // Call MasterService API
          const response = await getParentMastersByType("category");
          console.log("✅ Category API Response:", response);
          
          // Extract data from response
          if (response && response.data) {
            setCategoryData(response.data);
            console.log(`✅ Loaded ${response.data.length} Category items`);
          } else {
            console.warn("⚠️ Unexpected Category response format:", response);
            setCategoryData(categoryList || []);
          }
        } catch (error) {
          console.error("❌ Failed to fetch Category data:", error);
          toast.error("Failed to load category options");
          setCategoryData(categoryList || []);
        } finally {
          setLoadingCategory(false);
        }
      }
    };

    fetchCategoryData();
  }, [open, categoryList]);

  // Handle image preview when file is selected
  useEffect(() => {
    if (formData.file && formData.file instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(formData.file);
    } else {
      setImagePreview(null);
    }
  }, [formData.file]);

  // Handle image removal
  const handleRemoveImage = (index: number) => {
    if (formData.photos && formData.photos.length > 0) {
      const updatedPhotos = removeImage(formData.photos, index);
      setFormData({ ...formData, photos: updatedPhotos });
      setRemovedPhotos([...removedPhotos, index]);
    }
  };

  // THE MAIN SUBMIT HANDLER
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id) {
      toast.error("🚫 Product ID is required");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Updating product...");

    try {
      const requestBody = {
        data: {
          title: formData.title,
          description: formData.description,
          category: parseInt(getSafeValue(formData.category)) || 0,
          price: parseFloat(formData.price) || 0,
          stock: parseInt(formData.stock) || 0,
          status: parseInt(getSafeValue(formData.status)) || 0,
          unit: parseInt(getSafeValue(formData.unit)) || 0,
          organic: getBooleanValue(formData.organic) === "true",
          min_order_qty: parseInt(formData.min_order_qty) || 1,
          discount: parseFloat(formData.discount) || 0.00,
          discounted_price: formData.price ? 
            (parseFloat(formData.price) * (1 - (parseFloat(formData.discount || 0) / 100))) : 
            0,
          photos: formData.photos ? 
            formData.photos.filter((_: any, index: number) => !removedPhotos.includes(index)) : 
            []
        }
      };

      await updateProduct(formData.id.toString(), requestBody);

      toast.update(toastId, {
        render: "✅ Product updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      if (onSuccess) {
        onSuccess();
      }

      handleModalClose();
      
    } catch (error: any) {
      console.error("❌ Update error:", error);
      
      const errorMessage = getErrorMessage(error);
      
      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function for error messages
  const getErrorMessage = (error: any): string => {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 400) {
        return `Validation Error: ${typeof data === 'object' 
          ? Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(', ')
          : data}`;
      }
      if (status === 404) return "Product not found";
      if (status === 401 || status === 403) return "Permission denied";
      return `Error ${status}: ${error.response.statusText}`;
    }
    if (error.request) return "No server response";
    return error.message || "Update failed";
  };

  // Separate function to handle modal closing
  const handleModalClose = () => {
    setRemovedPhotos([]);
    setImagePreview(null);
    setFormData({});
    onClose();
  };

  // Debug log
  useEffect(() => {
    if (open) {
      console.log("EditProductModal opened with formData:", formData);
      console.log("Product ID:", formData.id);
      console.log("Category value:", formData.category, "Type:", typeof formData.category);
      console.log("Unit value:", formData.unit, "Type:", typeof formData.unit);
      console.log("Status value:", formData.status, "Type:", typeof formData.status);
      console.log("Organic value:", formData.organic, "Type:", typeof formData.organic);
      console.log("Category Data loaded:", categoryData.length, "items");
      console.log("UOM Data loaded:", uomData.length, "items");
      console.log("Removed photos indices:", removedPhotos);
    }
  }, [open, formData, removedPhotos, categoryData, uomData]);

  // Handle modal close - reset everything
  const handleClose = () => {
    setRemovedPhotos([]);
    setImagePreview(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[85vh] max-w-4xl overflow-hidden rounded-2xl bg-white p-0 shadow-xl">
        {/* Header section */}
        <div className="sticky top-0 z-50 border-b bg-white px-6 py-4">
          <DialogHeader className="space-y-0">
            <DialogTitle className="text-2xl font-semibold text-gray-900">
              Edit Product
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              Product ID: {formData.id || "N/A"}
            </p>
          </DialogHeader>
        </div>

        {/* Form section */}
        <div className="max-h-[calc(85vh-80px)] overflow-y-auto px-6 py-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Product Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Title *
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  disabled={isSaving}
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  value={getSafeValue(formData.category)}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                  disabled={isSaving || loadingCategory}
                >
                  <option value="">
                    {loadingCategory ? "Loading categories..." : "Select Category"}
                  </option>
                  {categoryData.map((category) => (
                    <option key={category.id} value={String(category.id)}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {loadingCategory && (
                  <p className="mt-1 text-xs text-gray-500">
                    Fetching category options...
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                  disabled={isSaving}
                />
              </div>

              {/* Stock */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Stock *
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  value={formData.stock || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  required
                  disabled={isSaving}
                />
              </div>

              {/* Unit */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Unit *
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  value={getSafeValue(formData.unit)}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  required
                  disabled={isSaving || loadingUom}
                >
                  <option value="">
                    {loadingUom ? "Loading units..." : "Select Unit"}
                  </option>
                  {uomData.map((uom) => (
                    <option key={uom.id} value={String(uom.id)}>
                      {uom.name} {uom.code ? `(${uom.code})` : ''}
                    </option>
                  ))}
                </select>
                {loadingUom && (
                  <p className="mt-1 text-xs text-gray-500">
                    Fetching unit of measurement options...
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status *
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  value={getSafeValue(formData.status)}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  required
                  disabled={isSaving}
                >
                  <option value="">Select Status</option>
                  {statusList.map((status) => (
                    <option key={status.id} value={String(status.id)}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Organic */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Organic
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  value={getBooleanValue(formData.organic)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      organic: e.target.value === "true",
                    })
                  }
                  disabled={isSaving}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              {/* Minimum Order Quantity */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Minimum Order Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  value={formData.min_order_qty || "1"}
                  onChange={(e) =>
                    setFormData({ ...formData, min_order_qty: e.target.value })
                  }
                  disabled={isSaving}
                />
              </div>

              {/* Discount */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Discount (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  value={formData.discount || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                className="min-h-[120px] w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                disabled={isSaving}
              />
            </div>

            {/* Image upload section */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Product Images
              </label>
              
              {/* Show existing photos if available */}
              {formData.photos && formData.photos.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">Current images:</p>
                    {removedPhotos.length > 0 && (
                      <p className="text-sm text-red-500">
                        {removedPhotos.length} image(s) marked for removal
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-5">
                    {formData.photos.map((photo: string, index: number) => {
                      const photoUrl = getImageUrl(photo);
                      const isRemoved = removedPhotos.includes(index);
                      
                      return (
                        <div 
                          key={index} 
                          className={`relative aspect-square h-32 w-full ${isRemoved ? 'opacity-50' : ''}`}
                        >
                          <img
                            src={photoUrl}
                            alt={`Product ${index + 1}`}
                            className="h-full w-full rounded-lg border object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                            }}
                          />
                          {/* Remove button - cross icon */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                            aria-label={`Remove image ${index + 1}`}
                            disabled={isSaving}
                          >
                            <X size={14} />
                          </button>
                          {/* Image number badge */}
                          <span className={`absolute bottom-1 left-1 rounded px-2 py-0.5 text-xs ${isRemoved ? 'bg-red-500 text-white' : 'bg-black/70 text-white'}`}>
                            {index + 1} {isRemoved ? '(Removed)' : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* File upload */}
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload New Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      setFormData({ ...formData, file: files[0] });
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  disabled={isSaving}
                />
                <p className="mt-2 text-sm text-gray-500">
                  {formData.file 
                    ? `Selected: ${formData.file.name} (${Math.round(formData.file.size / 1024)} KB)`
                    : "Upload new image to replace existing ones"}
                </p>
              </div>
            </div>

            {/* Image preview */}
            {imagePreview && (
              <div className="flex flex-col items-center">
                <p className="text-sm font-medium text-gray-700 mb-2">New Image Preview:</p>
                <img
                  src={imagePreview}
                  alt="New product preview"
                  className="h-40 w-40 rounded-lg border object-cover shadow"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                  }}
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 pb-8 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="rounded-lg border-gray-300 px-6 py-2.5 hover:bg-gray-50"
                disabled={isSaving}
              >
                <XCircle className="mr-2 h-4 w-4" /> Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-green-600 px-6 py-2.5 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Updating...
                  </>
                ) : (
                  "Update Product"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;