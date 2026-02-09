"use client";

import { useEffect, useState, useRef } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { XCircle, Upload, Image as ImageIcon, ChevronUp, ChevronDown } from "lucide-react";

import {
  getAllAdvertisements,
  deleteAdvertisement,
  enableAdvertisement,
  disableAdvertisement,
  getAdvertisementById,
  updateAdvertisement,
} from "@/services/advertisement/Advertisement";

import {
  Advertisement,
  ApiResponse,
} from "@/types/advertisement/Advertisement";
import { toast } from "react-toastify";
import { Edit, Trash2, Eye } from "lucide-react";

export default function AdvertisementTablePage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Server-side Pagination, Search, Sorting
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("");

  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const fetchAds = async () => {
    try {
      setLoading(true);

      const response: ApiResponse<Advertisement> = await getAllAdvertisements(
        page,
        pageSize,
        search,
        ordering
      );

      setAds(response.results ?? []);
      setTotalCount(response.count ?? 0);
    } catch {
      toast.error("Failed to load advertisements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [page, search, ordering]);

  const extractAd = (response: any): Advertisement | null => {
    if (!response) return null;
    if (response.data && typeof response.data === "object") return response.data;
    if (response.results && response.results.length > 0) return response.results[0];
    if (response.id) return response;
    return null;
  };

  const openViewModal = async (id: string) => {
    const response = await getAdvertisementById(id);
    const ad = extractAd(response);

    if (!ad) return toast.error("Failed to load advertisement");

    setSelectedAd(ad);
    setViewModal(true);
  };

  const openEditModal = async (id: string) => {
    const response = await getAdvertisementById(id);
    const ad = extractAd(response);

    if (!ad) return toast.error("Failed to load advertisement");

    setSelectedAd(ad);
    setSelectedFile(null);
    setPreviewUrl("");
    if (ad.photo) {
      setPreviewUrl(ad.photo);
    }
    setEditModal(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteAdvertisement(id);
        toast.success("Advertisement deleted");
        fetchAds();
      } catch {
        toast.error("Failed to delete advertisement");
      }
    }
  };

  const handleStatusToggle = async (id: string, status?: string) => {
    try {
      if (status === "active") {
        await disableAdvertisement(id);
        toast.info("Advertisement Disabled");
      } else {
        await enableAdvertisement(id);
        toast.success("Advertisement Enabled");
      }

      fetchAds();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleUpdate = async () => {
    if (!selectedAd) return;

    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      
      // Add text fields
      formData.append("title", selectedAd.title);
      formData.append("description", selectedAd.description);
      formData.append("contact_phone", selectedAd.contact_phone);
      formData.append("status", selectedAd.status);
      
      // Add file if selected
      if (selectedFile) {
        formData.append("photo", selectedFile);
      }

      await updateAdvertisement(String(selectedAd.id), formData);
      toast.success("Updated successfully");
      setEditModal(false);
      setSelectedFile(null);
      setPreviewUrl("");
      fetchAds();
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Advertisements" />

      <div className="mb-4 flex justify-between">
        <input
          className="w-88 rounded-xl border px-3 py-2"
          placeholder="Search ads..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="rounded-xl border px-3 py-2"
          value={ordering}
          onChange={(e) => {
            setOrdering(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Sort By</option>
          <option value="title">Title Asc</option>
          <option value="-title">Title Desc</option>
          <option value="status">Status Asc</option>
          <option value="-status">Status Desc</option>
        </select>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-md">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-100 text-base">
                  <th className="px-6 py-4 text-left">Photo</th>
                  <th className="px-6 py-4 text-left">Title</th>
                  <th className="px-6 py-4 text-left">Phone</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {ads.map((ad) => (
                  <tr key={ad.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {ad.photo ? (
                        <img
                          src={ad.photo}
                          className="h-12 w-12 rounded border object-cover"
                          alt={ad.title}
                        />
                      ) : (
                        <span>No image</span>
                      )}
                    </td>

                    <td className="p-3">{ad.title}</td>
                    <td className="p-3">{ad.contact_phone}</td>

                    <td className="p-3">
                      <div
                        onClick={() => handleStatusToggle(String(ad.id), ad.status)}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <div
                          className={`h-6 w-11 rounded-full transition-all ${
                            ad.status === "active" ? "bg-green-500" : "bg-gray-400"
                          }`}
                        >
                          <div
                            className={`mt-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                              ad.status === "active" ? "ml-5" : "ml-0.5"
                            }`}
                          ></div>
                        </div>
                        <span>{ad.status === "active" ? "Active" : "Inactive"}</span>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-500 text-blue-600 hover:bg-blue-100"
                          onClick={() => openEditModal(String(ad.id))}
                        >
                          <Edit className="mr-1 h-4 w-4" /> Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500 text-green-600 hover:bg-green-100"
                          onClick={() => openViewModal(String(ad.id))}
                        >
                          <Eye className="mr-1 h-4 w-4" /> View
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-600 hover:bg-red-100"
                          onClick={() => handleDelete(String(ad.id))}
                        >
                          <Trash2 className="mr-1 h-4 w-4" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm">
                Page {page} of {Math.ceil(totalCount / pageSize)}
              </p>

              <div className="flex gap-3">
                <Button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-xl bg-green-600 px-4 py-2 text-white"
                >
                  Prev
                </Button>

                <Button
                  disabled={page >= Math.ceil(totalCount / pageSize)}
                  onClick={() => setPage(page + 1)}
                  className="rounded-xl bg-green-600 px-4 py-2 text-white"
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {viewModal && selectedAd && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-[90%] max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-2xl font-bold">{selectedAd.title}</h2>
              <button
                onClick={() => setViewModal(false)}
                className="text-3xl text-gray-600 hover:text-black"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
              <div className="flex items-center justify-center rounded-xl bg-gray-100 p-4">
                <img
                  src={selectedAd.photo || ""}
                  className="h-[380px] w-full rounded-xl object-cover"
                  alt={selectedAd.title}
                />
              </div>

              <div className="space-y-2 text-[15px] leading-relaxed">
                <p><b>Description:</b> {selectedAd.description}</p>
                <p><b>Status:</b> {selectedAd.status_display || selectedAd.status}</p>
                <p><b>Phone:</b> {selectedAd.contact_phone}</p>
                <p><b>Created By:</b> {selectedAd.created_by_email}</p>
                <p>
                  <b>Created At:</b>{" "}
                  {new Date(selectedAd.created_at ?? "").toLocaleString()}
                </p>
                <p>
                  <b>Updated At:</b>{" "}
                  {new Date(selectedAd.updated_at ?? "").toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {editModal && selectedAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex h-[90vh] w-[90vw] max-w-[800px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header - Fixed */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-2xl font-semibold">Edit Advertisement</h2>
              <button
                onClick={() => {
                  setEditModal(false);
                  setSelectedFile(null);
                  setPreviewUrl("");
                }}
                className="text-3xl leading-none text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div 
              ref={modalContentRef}
              className="flex-1 overflow-y-auto px-6 py-4"
            >
              <div className="space-y-6 pb-4">
                {/* Image Upload Section */}
                <div>
                  <label className="mb-3 block text-lg font-medium">Advertisement Image</label>
                  <div className="flex flex-col items-center gap-6 md:flex-row">
                    {/* Image Preview */}
                    <div className="flex-1">
                      <div className="relative h-64 w-full overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
                        {previewUrl ? (
                          <>
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="h-full w-full object-contain"
                            />
                            <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                              {selectedFile ? "New Image" : "Current Image"}
                            </div>
                          </>
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center text-gray-500">
                            <ImageIcon className="mb-2 h-12 w-12" />
                            <p className="text-sm">No image selected</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upload Controls */}
                    <div className="flex-1">
                      <div className="space-y-4">
                        <div>
                          <p className="mb-2 text-sm font-medium">Upload New Image</p>
                          <p className="mb-3 text-xs text-gray-500">
                            Supported formats: JPG, PNG, GIF (Max 5MB)
                          </p>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*"
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={triggerFileInput}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white px-4 py-6 hover:border-green-500 hover:bg-green-50"
                          >
                            <Upload className="h-5 w-5" />
                            <span>Click to upload new image</span>
                          </button>
                        </div>

                        {selectedFile && (
                          <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                            <p className="text-sm font-medium text-green-800">Selected File:</p>
                            <p className="text-xs text-green-700 truncate">{selectedFile.name}</p>
                            <p className="text-xs text-green-600">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFile(null);
                                setPreviewUrl(selectedAd.photo || "");
                              }}
                              className="mt-2 text-xs text-red-600 hover:text-red-800"
                            >
                              Remove file
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Form Fields */}
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block font-medium">Title *</label>
                    <input
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                      value={selectedAd.title}
                      onChange={(e) =>
                        setSelectedAd({ ...selectedAd, title: e.target.value })
                      }
                      placeholder="Enter advertisement title"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-medium">Description *</label>
                    <textarea
                      className="min-h-[120px] w-full rounded-xl border border-gray-300 bg-gray-50 p-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                      value={selectedAd.description}
                      onChange={(e) =>
                        setSelectedAd({ ...selectedAd, description: e.target.value })
                      }
                      placeholder="Enter advertisement description"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block font-medium">Phone *</label>
                      <input
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                        value={selectedAd.contact_phone}
                        onChange={(e) =>
                          setSelectedAd({
                            ...selectedAd,
                            contact_phone: e.target.value,
                          })
                        }
                        placeholder="Enter contact phone number"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block font-medium">Status *</label>
                      <select
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                        value={selectedAd.status}
                        onChange={(e) =>
                          setSelectedAd({
                            ...selectedAd,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Fixed */}
            <div className="border-t border-gray-200 bg-white px-6 py-4">
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditModal(false);
                    setSelectedFile(null);
                    setPreviewUrl("");
                  }}
                  className="rounded-xl border-gray-300 px-6 py-3 hover:bg-gray-50"
                >
                  <XCircle className="mr-2 h-4 w-4" /> Cancel
                </Button>

                <Button
                  type="button"
                  onClick={handleUpdate}
                  className="rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700"
                >
                  Update Advertisement
                </Button>
              </div>
            </div>

            {/* Scroll Indicator (optional) */}
            <div className="absolute bottom-20 left-1/2 hidden -translate-x-1/2 transform items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs text-white md:flex">
              <ChevronUp className="h-3 w-3" />
              <span>Scroll</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}