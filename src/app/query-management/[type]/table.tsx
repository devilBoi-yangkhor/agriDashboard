"use client";
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { BiUserPlus } from "react-icons/bi";
import { debounce } from "lodash";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Options } from "@/interface/Options";
import { getParentMastersByType } from "@/services/master/MasterService";

// Define priority options as a constant
const PRIORITY_OPTIONS: Options[] = [
  { value: "ALL", text: "All Priorities" },
  { value: "LOW", text: "Low" },
  { value: "MEDIUM", text: "Medium" },
  { value: "HIGH", text: "High" },
];

// Special value to represent "All" option
const ALL_FILTER_VALUE = "ALL";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  catType: string;
  totalCount: number;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setOrdering: (ordering: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  catType,
  totalCount,
  page,
  pageSize,
  setPage,
  setSearch,
  setOrdering,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [gender, setGender] = useState<Options[]>([]);
  const [category, setCategory] = useState<Options[]>([]);
  const [status, setStatus] = useState<Options[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial values from URL params
  const initialCategory = searchParams.get("category_id") || ALL_FILTER_VALUE;
  const initialStatus = searchParams.get("status_id") || ALL_FILTER_VALUE;
  const initialGender = searchParams.get("gender_id") || ALL_FILTER_VALUE;
  const initialPriority = searchParams.get("priority") || ALL_FILTER_VALUE;
  const initialSearch = searchParams.get("search") || "";

  // State for each filter with values from URL as default
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [genderFilter, setGenderFilter] = useState<string>(initialGender);
  const [priorityFilter, setPriorityFilter] = useState<string>(initialPriority);
  const [searchInput, setSearchInput] = useState<string>(initialSearch);

  // Fetch filter data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categoryRes, statusRes, genderRes] = await Promise.all([
          getParentMastersByType("category"),
          getParentMastersByType("status"),
          getParentMastersByType("gender"),
        ]);

        // Add "All" option to each filter using ALL_FILTER_VALUE
        setCategory([
          { value: ALL_FILTER_VALUE, text: "All Categories" },
          ...categoryRes.data.map((param: { id: string; name: string }) => ({
            value: param.id,
            text: param.name,
          }))
        ]);
        setStatus([
          { value: ALL_FILTER_VALUE, text: "All Statuses" },
          ...statusRes.data.map((param: { id: string; name: string }) => ({
            value: param.id,
            text: param.name,
          }))
        ]);
        setGender([
          { value: ALL_FILTER_VALUE, text: "All Genders" },
          ...genderRes.data.map((param: { id: string; name: string }) => ({
            value: param.id,
            text: param.name,
          }))
        ]);
        setError(null);
      } catch (error: any) {
        console.error("Fetch Error:", error);
        setError("Failed to load filter options. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update URL with filter params
  const updateURLParams = useCallback((newFilters: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    const filterKeys = ["category_id", "status_id", "gender_id", "priority", "search"];

    // Remove existing filter params
    filterKeys.forEach((key) => params.delete(key));

    // Add new filter params (only if they have a value and it's not the "ALL" option)
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== ALL_FILTER_VALUE) {
        params.set(key, value);
      }
    });

    // Preserve page and ordering params
    const pageParam = searchParams.get("page");
    const orderingParam = searchParams.get("ordering");
    if (pageParam) params.set("page", pageParam);
    if (orderingParam) params.set("ordering", orderingParam);

    router.replace(`/query-management/${catType}?${params.toString()}`, {
      scroll: false,
    });
    setPage(1);
  }, [searchParams, router, catType, setPage]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    onSortingChange: (updater) => {
      setSorting(updater);
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      const sortField = newSorting[0]?.id;
      const sortOrder = newSorting[0]?.desc ? `-${sortField}` : sortField;
      setOrdering(sortOrder || "");
    },
    state: {
      sorting,
      pagination: { pageIndex: page - 1, pageSize },
    },
    pageCount: pageSize > 0 ? Math.ceil(totalCount / pageSize) : 1,
  });

  // Memoize debounced search handler
  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
      updateURLParams({
        category_id: categoryFilter,
        status_id: statusFilter,
        gender_id: genderFilter,
        priority: priorityFilter,
        search: value,
      });
    }, 500),
    [setSearch, updateURLParams, categoryFilter, statusFilter, genderFilter, priorityFilter]
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);
    debouncedSetSearch(value);
  };

  // Filter handlers
  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    updateURLParams({
      category_id: value,
      status_id: statusFilter,
      gender_id: genderFilter,
      priority: priorityFilter,
      search: searchInput,
    });
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    updateURLParams({
      category_id: categoryFilter,
      status_id: value,
      gender_id: genderFilter,
      priority: priorityFilter,
      search: searchInput,
    });
  };

  const handleGenderFilter = (value: string) => {
    setGenderFilter(value);
    updateURLParams({
      category_id: categoryFilter,
      status_id: statusFilter,
      gender_id: value,
      priority: priorityFilter,
      search: searchInput,
    });
  };

  const handlePriorityFilter = (value: string) => {
    setPriorityFilter(value);
    updateURLParams({
      category_id: categoryFilter,
      status_id: statusFilter,
      gender_id: genderFilter,
      priority: value,
      search: searchInput,
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setCategoryFilter(ALL_FILTER_VALUE);
    setStatusFilter(ALL_FILTER_VALUE);
    setGenderFilter(ALL_FILTER_VALUE);
    setPriorityFilter(ALL_FILTER_VALUE);
    setSearchInput("");
    
    const params = new URLSearchParams();
    
    // Preserve page and ordering params
    const pageParam = searchParams.get("page");
    const orderingParam = searchParams.get("ordering");
    if (pageParam) params.set("page", pageParam);
    if (orderingParam) params.set("ordering", orderingParam);
    
    router.replace(`/query-management/${catType}?${params.toString()}`, {
      scroll: false,
    });
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full xl:w-1/2">
        <Button
          onClick={() => router.push(`/query-management/${catType}/create`)}
          className="ml-auto gap-2 rounded-full bg-red-700 px-4 py-2 hover:bg-red-800"
          aria-label="Add new item"
        >
          <BiUserPlus size={20} />
          Add New
        </Button>
      </div>
      <Card className="w-full p-6">
        {error && (
          <div className="text-red-600 mb-4" role="alert">
            {error}
          </div>
        )}
        <div className="flex items-center gap-4 py-4">
          <Input
            placeholder={`Search by ${catType == "call" ? "Phone Number" : "Email"}`}
            value={searchInput}
            onChange={handleSearch}
            className="max-w-[200px]"
          />

          <Select
            value={statusFilter}
            onValueChange={handleStatusFilter}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[250px]" aria-label="Filter by status">
              <SelectValue placeholder="Filter By Status" />
            </SelectTrigger>
            <SelectContent>
              {status.map((status, index) => (
                <SelectItem key={index} value={status.value}>
                  {status.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={categoryFilter}
            onValueChange={handleCategoryFilter}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[250px]" aria-label="Filter by category">
              <SelectValue placeholder="Filter By Category" />
            </SelectTrigger>
            <SelectContent>
              {category.map((cat, index) => (
                <SelectItem key={index} value={cat.value}>
                  {cat.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={genderFilter}
            onValueChange={handleGenderFilter}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[250px]" aria-label="Filter by gender">
              <SelectValue placeholder="Filter By Gender" />
            </SelectTrigger>
            <SelectContent>
              {gender.map((gen, index) => (
                <SelectItem key={index} value={gen.value}>
                  {gen.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={priorityFilter}
            onValueChange={handlePriorityFilter}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[250px]" aria-label="Filter by priority">
              <SelectValue placeholder="Filter By Priority" />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((priority, index) => (
                <SelectItem key={index} value={priority.value}>
                  {priority.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={clearFilters}
            className="whitespace-nowrap"
            aria-label="Clear all filters"
          >
            Clear Filters
          </Button>
        </div>

        <div className="rounded-md border overflow-hidden">
          <div
            className="overflow-x-auto"
            style={{ maxHeight: "calc(100vh - var(--table-offset, 300px))" }}
          >
            <Table className="min-w-full">
              <TableHeader className="sticky top-0 bg-background z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-center whitespace-nowrap"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-gray-100"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="p-2 text-center text-sm whitespace-nowrap"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              aria-label="Previous page"
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of{" "}
              {pageSize > 0 ? Math.ceil(totalCount / pageSize) : 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(totalCount / pageSize)}
              aria-label="Next page"
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}