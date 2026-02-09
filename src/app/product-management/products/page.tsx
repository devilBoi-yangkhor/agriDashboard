"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Edit, 
  Trash2, 
  PlusCircle, 
  Eye,
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  Grid,
  List,
  SortAsc,
  SortDesc,
  MoreVertical,
  Download,
  RefreshCw
} from "lucide-react";
import Swal from "sweetalert2";
import api from "@/lib/axios";

import { Product } from "@/types/product/Product";
import { getParentMastersByType } from "@/services/master/MasterService";
import {
  getProductById,
  deleteProduct,
} from "@/services/product/ProductService";

import AddProductModal from "../create/create";
import EditProductModal from "../edit/page";
import ViewProductModal from "../view/page";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const emptyForm = () => ({
  id: undefined,
  title: "",
  description: "",
  category: "",
  price: "",
  stock: 0,
  unit: "",
  dzongkhag: "",
  gewog: "",
  chiwog: "",
  organic: false,
  min_order_qty: 1,
  discount: "",
  discounted_price: "",
  location: "",
  latitude: "",
  longitude: "",
  seller: "",
  seller_name: "",
  photos: [],
  file: null,
  status: "",
});

const ProductsPage: React.FC = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<any>(emptyForm());
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [dzongkhagList, setDzongkhagList] = useState<any[]>([]);
  const [gewogList, setGewogList] = useState<any[]>([]);
  const [chiwogList, setChiwogList] = useState<any[]>([]);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [unitList, setUnitList] = useState<any[]>([]);
  const [statusList, setStatusList] = useState<any[]>([]);
  const [filteredGewogs, setFilteredGewogs] = useState<any[]>([]);
  const [filteredChiwogs, setFilteredChiwogs] = useState<any[]>([]);
  const [selectedDzongkhag, setSelectedDzongkhag] = useState<string>("");
  const [selectedGewog, setSelectedGewog] = useState<string>("");

  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration issue by only rendering on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params: any = {
        page,
        page_size: pageSize,
        ordering,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (categoryFilter && categoryFilter !== "all") {
        params.category = categoryFilter;
      }

      const response = await api.get("/product/", { params });
      setProductList(response.data.data?.results ?? []);
      setTotalCount(response.data.data?.count ?? 0);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isMounted) return;

    const delayDebounceFn = setTimeout(() => {
      if (page === 1) {
        fetchProducts();
      } else {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, ordering, categoryFilter, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    fetchProducts();
  }, [page, pageSize, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    fetchMasters();
  }, [isMounted]);

  const fetchMasters = async () => {
    try {
      const [dzRes, gwRes, vRes, catRes, uomRes, statusRes] = await Promise.all(
        [
          getParentMastersByType("dzongkhag"),
          getParentMastersByType("gewog"),
          getParentMastersByType("village"),
          getParentMastersByType("category"),
          getParentMastersByType("uom"),
          getParentMastersByType("status"),
        ],
      );

      setDzongkhagList(dzRes?.data ?? []);
      setCategoryList(catRes?.data ?? []);
      setUnitList(uomRes?.data ?? []);
      setStatusList(statusRes?.data ?? []);

      setGewogList(
        (gwRes?.data ?? []).map((g: any) => ({
          id: g.id,
          name: g.name,
          parent_id: g.parent?.id ?? null,
        })),
      );

      setChiwogList(
        (vRes?.data ?? []).map((c: any) => ({
          id: c.id,
          name: c.name,
          parent_id: c.parent?.id ?? null,
        })),
      );
    } catch (err) {
      console.error("fetchMasters error:", err);
      toast.error("Failed to load masters");
    }
  };

  useEffect(() => {
    if (!isMounted) return;
    
    if (!selectedDzongkhag) {
      setFilteredGewogs([]);
      setSelectedGewog("");
      setFilteredChiwogs([]);
      return;
    }
    const dzId = Number(selectedDzongkhag);
    setFilteredGewogs(gewogList.filter((g) => Number(g.parent_id) === dzId));
    setFilteredChiwogs([]);
  }, [selectedDzongkhag, gewogList, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    
    if (!selectedGewog) {
      setFilteredChiwogs([]);
      return;
    }
    const gwId = Number(selectedGewog);
    setFilteredChiwogs(chiwogList.filter((c) => Number(c.parent_id) === gwId));
  }, [selectedGewog, chiwogList, isMounted]);

  const handleEdit = async (id: string) => {
    try {
      console.log("🔄 Editing product ID:", id);
      
      // Call API directly to avoid type issues
      const response = await api.get(`/product/${id}/`);
      const apiResponse = response.data; // {status, message, data}
      
      console.log("✅ API Response:", apiResponse);
      
      // Extract product from the nested data property
      const product = apiResponse.data;
      
      if (!product) {
        toast.error("No product data found");
        return;
      }
      
      console.log("📊 Extracted product:", product);
      
      // Create form data
      setFormData({
        id: product.id,
        title: product.title || "",
        description: product.description || "",
        category: product.category?.id?.toString() || "",
        unit: product.unit?.id?.toString() || "",
        status: product.status?.id?.toString() || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || "",
        organic: Boolean(product.organic),
        min_order_qty: product.min_order_qty?.toString() || "1",
        discount: product.discount?.toString() || "",
        seller: product.seller?.id?.toString() || "",
        photos: product.photos || [],
        file: null
      });

      // Set image preview
      if (product.photos && product.photos.length > 0) {
        setImagePreview(getImageUrl(product.photos[0]));
      } else {
        setImagePreview(null);
      }

      setShowEditModal(true);
    } catch (err) {
      console.error("Edit error:", err);
      toast.error("Failed to load product");
    }
  };

  const handleView = (p: Product) => {
    setSelectedProduct(p);
    setShowViewModal(true);
  };

  const handleCardClick = (e: React.MouseEvent, product: Product) => {
    // Prevent click if user clicked on a button inside the card
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'BUTTON' || 
      target.closest('button') || 
      target.closest('[role="button"]') ||
      target.closest('.dropdown-menu') ||
      target.closest('[data-radix-collection-item]')
    ) {
      return; // Don't trigger view modal if clicking on a button
    }
    handleView(product);
  };

  const handleSubmit = async (e?: any) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    setIsSaving(true);

    try {
      if (!formData.category) {
        Swal.fire({
          icon: "error",
          title: "Validation",
          text: "Category is required",
        });
        setIsSaving(false);
        return;
      }
      if (!formData.seller) {
        Swal.fire({
          icon: "error",
          title: "Validation",
          text: "Seller is required",
        });
        setIsSaving(false);
        return;
      }
      if (!formData.status) {
        Swal.fire({
          icon: "error",
          title: "Validation",
          text: "Status is required",
        });
        setIsSaving(false);
        return;
      }

      const fd = new FormData();

      if (formData.title !== undefined)
        fd.append("title", String(formData.title));
      if (formData.description !== undefined)
        fd.append("description", String(formData.description));
      if (formData.price !== undefined)
        fd.append("price", String(formData.price));
      if (formData.stock !== undefined)
        fd.append("stock", String(formData.stock));

      if (formData.unit !== undefined && formData.unit !== "")
        fd.append("unit", String(Number(formData.unit)));
      if (formData.category !== undefined && formData.category !== "")
        fd.append("category", String(Number(formData.category)));
      if (formData.status !== undefined && formData.status !== "")
        fd.append("status", String(Number(formData.status)));

      if (formData.dzongkhag !== undefined && formData.dzongkhag !== "")
        fd.append("dzongkhag", String(Number(formData.dzongkhag)));
      if (formData.gewog !== undefined && formData.gewog !== "")
        fd.append("gewog", String(Number(formData.gewog)));
      if (formData.chiwog !== undefined && formData.chiwog !== "")
        fd.append("chiwog", String(Number(formData.chiwog)));

      if (formData.organic !== undefined)
        fd.append("organic", formData.organic ? "true" : "false");
      if (formData.min_order_qty !== undefined)
        fd.append("min_order_qty", String(formData.min_order_qty));
      if (formData.discount !== undefined)
        fd.append("discount", String(formData.discount));
      if (formData.discounted_price !== undefined)
        fd.append("discounted_price", String(formData.discounted_price ?? ""));

      if (formData.seller !== undefined && formData.seller !== "")
        fd.append("seller", String(Number(formData.seller)));
      if (formData.seller_name !== undefined)
        fd.append("seller_name", String(formData.seller_name ?? ""));

      if (
        formData.latitude !== undefined &&
        formData.longitude !== undefined &&
        formData.latitude !== "" &&
        formData.longitude !== ""
      ) {
        try {
          const locJson = JSON.stringify({
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
          });
          fd.append("location", locJson);
        } catch {
          fd.append("location", String(formData.location ?? ""));
        }
      }

      if (formData.file) fd.append("photos", formData.file);

      if (!formData.id) {
        await api.post(`/product/`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product created successfully!");
        setShowAddModal(false);
        resetForm();
      } else {
        await api.put(`/product/${formData.id}/`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully!");
        setShowEditModal(false);
        resetForm();
      }

      await fetchProducts();
      setPage(1);
    } catch (err: any) {
      console.error("submit error:", err);

      let text = "Failed to save product";
      const resp = err?.response?.data;

      if (resp && typeof resp === "object") {
        text = Object.keys(resp)
          .map((k) => `${k}: ${JSON.stringify(resp[k])}`)
          .join("\n");
      } else if (typeof resp === "string") {
        text = resp;
      }

      Swal.fire({ icon: "error", title: "Validation error", text });
      toast.error(text || "Something went wrong while saving the product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      setProductList((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("deleteProduct error:", err);
      toast.error("Failed to delete product");
    }
  };

  const resetForm = () => {
    setFormData(emptyForm());
    setImagePreview(null);
    setSelectedDzongkhag("");
    setSelectedGewog("");
    setFilteredGewogs([]);
    setFilteredChiwogs([]);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  // Render a simple loading state during SSR
  if (!isMounted) {
    return (
      <DefaultLayout>
        <div className="container mx-auto p-4 md:p-6">
          <div className="mb-6">
            <Breadcrumb pageName="Products" parentPage="Product Management" />
          </div>
          <div className="flex h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (loading && page === 1) {
    return (
      <DefaultLayout>
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-6">
          <Breadcrumb pageName="Products" parentPage="Product Management" />
          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                Product Management
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Manage your products, inventory, and pricing
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => fetchProducts()}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                onClick={() => setShowAddModal(true)}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <PlusCircle className="h-5 w-5" />
                Add Product
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <Card className="mb-6">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <Select 
                  value={categoryFilter} 
                  onValueChange={(value) => setCategoryFilter(value)}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoryList.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={ordering} onValueChange={setOrdering}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    {ordering.includes('-') ? (
                      <SortDesc className="mr-2 h-4 w-4" />
                    ) : (
                      <SortAsc className="mr-2 h-4 w-4" />
                    )}
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-created_at">Newest First</SelectItem>
                    <SelectItem value="created_at">Oldest First</SelectItem>
                    <SelectItem value="title">Title (A-Z)</SelectItem>
                    <SelectItem value="-title">Title (Z-A)</SelectItem>
                    <SelectItem value="price">Price (Low to High)</SelectItem>
                    <SelectItem value="-price">Price (High to Low)</SelectItem>
                    <SelectItem value="stock">Stock (Low to High)</SelectItem>
                    <SelectItem value="-stock">Stock (High to Low)</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2 rounded-lg border p-1">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Display */}
        {viewMode === "grid" ? (
          <div className="mb-6">
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-4">
                      <Skeleton className="mb-3 h-48 w-full" />
                      <Skeleton className="mb-2 h-6 w-3/4" />
                      <Skeleton className="mb-3 h-4 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : productList.length > 0 ? (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} products
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {productList.map((product) => (
                    <Card 
                      key={product.id} 
                      className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg cursor-pointer"
                      onClick={(e) => handleCardClick(e, product)}
                    >
                      {/* Image Section - Fixed Height (SMALLER) */}
                      <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                        {product.photos?.[0] ? (
                          <img
                            src={getImageUrl(product.photos[0])}
                            alt={product.title}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                            width={400}
                            height={176} // Match h-44
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                          </div>
                        )}
                        {/* Stock Status Badge */}
                        <div className="absolute left-2 top-2">
                          <Badge 
                            className={`px-2 py-0.5 text-xs ${product.stock > 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                          >
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </div>
                        {/* Organic Badge */}
                        {product.organic && (
                          <div className="absolute right-2 top-2">
                            <Badge variant="outline" className="border-green-500 bg-white/90 text-xs text-green-600">
                              Organic
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Content Section - COMPACT */}
                      <CardContent className="flex flex-1 flex-col p-3">
                        {/* Title and Actions */}
                        <div className="mb-2 flex items-start justify-between">
                          <h3 className="line-clamp-1 text-base font-semibold text-gray-900">
                            {product.title}
                          </h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0"
                                onClick={(e) => e.stopPropagation()} // Prevent card click
                              >
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleView(product);
                              }}>
                                <Eye className="mr-2 h-3.5 w-3.5" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(product.id!);
                              }}>
                                <Edit className="mr-2 h-3.5 w-3.5" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(product.id!);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Description */}
                        <p className="mb-2 line-clamp-2 flex-1 text-sm text-gray-600">
                          {product.description || "No description"}
                        </p>

                        {/* Category Badge */}
                        <div className="mb-2">
                          {typeof product.category === 'object' && (product.category as any)?.name && (
                            <Badge variant="secondary" className="mr-2 text-xs">
                              {(product.category as any).name}
                            </Badge>
                          )}
                        </div>

                        {/* Price and Stock */}
                        <div className="mt-auto">
                          <div className="mb-1 flex items-center justify-between">
                            <div>
                              <span className="text-xs font-medium text-gray-500">Price</span>
                              <div className="text-base font-bold text-green-600">
                                Nu. {typeof product.price === 'number' ? (product.price as number).toFixed(2) : product.price}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-medium text-gray-500">Stock</span>
                              <div className="text-sm font-medium">
                                {product.stock} {typeof product.unit === 'object' ? (product.unit as any)?.name : ''}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>

                      {/* Actions Footer - ONLY DELETE BUTTON */}
                      <div className="border-t p-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(product.id!);
                            }}
                            className="flex-1 gap-1 bg-green-600 text-xs hover:bg-green-700"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(product.id!);
                            }}
                            className="flex-1 gap-1 text-xs"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                    <Search className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">No products found</h3>
                  <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
                    {search || categoryFilter !== "all"
                      ? "Try adjusting your search or filter to find what you're looking for."
                      : "Get started by adding your first product."}
                  </p>
                  {!(search || categoryFilter !== "all") && (
                    <Button
                      onClick={() => setShowAddModal(true)}
                      className="mt-6"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="mb-6 overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="space-y-4 p-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="h-10 w-24" />
                      </div>
                    ))}
                  </div>
                ) : productList.length > 0 ? (
                  <>
                    <div className="mb-4 p-4 text-sm text-gray-600">
                      Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} products
                    </div>
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Product</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Category</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Price</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Stock</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Status</th>
                          <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {productList.map((product) => (
                          <tr 
                            key={product.id} 
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                            onClick={() => handleView(product)}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {product.photos?.[0] ? (
                                  <div className="h-12 w-12 overflow-hidden rounded-lg">
                                    <img
                                      src={getImageUrl(product.photos[0])}
                                      alt={product.title}
                                      className="h-full w-full object-cover"
                                      width={48}
                                      height={48}
                                    />
                                  </div>
                                ) : (
                                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                    <span className="text-xs text-gray-500">No Image</span>
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium">{product.title}</div>
                                  <div className="text-xs text-gray-500 line-clamp-1">
                                    {product.description}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {typeof product.category === 'object' ? (product.category as any)?.name : 'N/A'}
                            </td>
                            <td className="px-4 py-3 font-medium">
                              <div className="text-green-600">
                                Nu. {typeof product.price === 'number' ? (product.price as number).toFixed(2) : product.price}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                                {product.stock} {typeof product.unit === 'object' ? (product.unit as any)?.name : ''}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              {typeof product.status === 'object' ? (
                                <Badge variant={
                                  (product.status as any)?.name?.toLowerCase() === 'active' 
                                    ? 'default' 
                                    : 'secondary'
                                }>
                                  {(product.status as any)?.name}
                                </Badge>
                              ) : 'N/A'}
                            </td>
                            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(product.id!)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(product.id!)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                      <Search className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">No products found</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {search || categoryFilter !== "all"
                        ? "Try adjusting your search or filter"
                        : "Get started by adding your first product"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {productList.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show</span>
                <Select 
                  value={String(pageSize)} 
                  onValueChange={(v) => setPageSize(Number(v))}
                >
                  <SelectTrigger className="h-8 w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                    <SelectItem value="96">96</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">per page</span>
              </div>
              <div className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                      className="h-8 w-8"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddProductModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        isSaving={isSaving}
        imagePreview={imagePreview}
        handleFileChange={(e: any) => {
          const file = e.target.files?.[0];
          setFormData({ ...formData, file });
          if (file) setImagePreview(URL.createObjectURL(file));
        }}
        dzongkhagList={dzongkhagList}
        gewogList={gewogList}
        chiwogList={chiwogList}
        categoryList={categoryList}
        unitList={unitList}
        statusList={statusList}
        filteredGewogs={filteredGewogs}
        filteredChiwogs={filteredChiwogs}
        selectedDzongkhag={selectedDzongkhag}
        setSelectedDzongkhag={(v: string) => {
          setSelectedDzongkhag(v);
          setFormData((f: any) => ({
            ...f,
            dzongkhag: v,
            gewog: "",
            chiwog: "",
          }));
        }}
        selectedGewog={selectedGewog}
        setSelectedGewog={(v: string) => {
          setSelectedGewog(v);
          setFormData((f: any) => ({ ...f, gewog: v, chiwog: "" }));
        }}
      />

      <EditProductModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        isSaving={isSaving}
        imagePreview={imagePreview}
        onSuccess={() => {
          fetchProducts();
        }}
        categoryList={categoryList}
        unitList={unitList}
        statusList={statusList}
      />

      <ViewProductModal
        open={showViewModal}
        onClose={() => setShowViewModal(false)}
        product={selectedProduct}
        dzongkhagList={dzongkhagList}
        gewogList={gewogList}
        chiwogList={chiwogList}
        getImageUrl={getImageUrl}
      />
    </DefaultLayout>
  );
};

export default ProductsPage;