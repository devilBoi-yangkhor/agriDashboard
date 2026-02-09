"use client";
import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  FilterFn,
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
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { BiPlus, BiMinus, BiFilterAlt } from "react-icons/bi";
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
import { getUsers } from "@/services/UserService";
import { useLoading } from "@/context/LoadingContext";
import { toast } from "sonner";
import { DateRangePicker } from "@/components/ui/DateRangerPicker";
import moment from "moment";
import * as XLSX from "xlsx";
import { TimeRangePicker } from "@/components/ui/time-range-picker";

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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [category, setCategory] = useState<Options[]>([]);
  const [originalCategory, setOriginalCategory] = useState<any[]>([]);
  const [originalStatus, setOriginalStatus] = useState<any[]>([]);
  const [status, setStatus] = useState<Options[]>([]);
  const [assigned_to_id, setAssigned_to_id] = useState<Options[]>([]);
  const [gender, setGender] = useState<Options[]>([]);
  const [dzongkhag, setDzongkhag] = useState<Options[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [startDate, setStartDate] = useState<string>(
    moment().subtract(3, "months").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState<string>(moment().format("YYYY-MM-DD"));

  // Initialize filters from URL params
  const initialFilters = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    return {
      dzongkhag_id: params.get("dzongkhag_id") || "",
      from_date: params.get("from_date") || "",
      to_date: params.get("to_date") || "",
      category_id: params.get("category_id") || "",
      assigned_to_id: params.get("assigned_to_id") || "",
      status_id: params.get("status_id") || "",
      phone_number: params.get("phone_number") || "",
      email: params.get("email") || "",
      gender_id: params.get("gender_id") || "",
      priority: params.get("priority") || "",
      type: params.get("type") || "",
      start_time: params.get("start_time") || "",
      end_time: params.get("end_time") || "",
    };
  }, [searchParams]);

  const [filters, setFilters] = useState(initialFilters);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(
      (value) => value && value !== "" && value !== "all",
    ).length;
  }, [filters]);

  // Apply filters automatically when they change
  useEffect(() => {
    updateURLParams(filters);
    applyFiltersToTable(filters);
  }, [filters]);

  const applyFiltersToTable = (currentFilters: typeof filters) => {
    const newColumnFilters: ColumnFiltersState = [];

    if (currentFilters.assigned_to_id && currentFilters.assigned_to_id !== "all") {
      newColumnFilters.push({
        id: "assigned_to_id",
        value: currentFilters.assigned_to_id,
      });
    }
    if (currentFilters.phone_number) {
      newColumnFilters.push({
        id: "phone_number",
        value: currentFilters.phone_number,
      });
    }
    if (currentFilters.email) {
      newColumnFilters.push({ id: "email", value: currentFilters.email });
    }
    if (currentFilters.category_id && currentFilters.category_id !== "all") {
      newColumnFilters.push({
        id: "category",
        value: currentFilters.category_id,
      });
    }
    if (currentFilters.status_id && currentFilters.status_id !== "all") {
      newColumnFilters.push({ id: "status", value: currentFilters.status_id });
    }
    if (currentFilters.gender_id && currentFilters.gender_id !== "all") {
      newColumnFilters.push({
        id: "gender",
        value: currentFilters.gender_id,
      });
    }
    if (currentFilters.priority && currentFilters.priority !== "all") {
      newColumnFilters.push({ id: "priority", value: currentFilters.priority });
    }
    if (currentFilters.dzongkhag_id && currentFilters.dzongkhag_id !== "all") {
      newColumnFilters.push({
        id: "dzongkhag",
        value: currentFilters.dzongkhag_id,
      });
    }
    if (currentFilters.from_date || currentFilters.to_date) {
      newColumnFilters.push({
        id: "created_at",
        value: {
          from_date: currentFilters.from_date,
          to_date: currentFilters.to_date,
        },
      });
    }

    setColumnFilters(newColumnFilters);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [categoryRes, statusRes, genderRes, dzongkhagRes, usersRes] =
          await Promise.all([
            getParentMastersByType("category"),
            getParentMastersByType("status"),
            getParentMastersByType("gender"),
            getParentMastersByType("dzongkhag"),
            getUsers(),
          ]);

        setOriginalCategory(categoryRes.data);
        const categories = categoryRes.data.filter(
          (item: any) => item.parent == null,
        );
        setCategory(
          categories.map((param: { id: string; name: string }) => ({
            value: param.id,
            text: param.name,
          })),
        );

        setOriginalStatus(statusRes.data);
        const statuses = statusRes.data.filter(
          (item: any) => item.parent == null,
        );
        setStatus(
          statuses.map((param: { id: string; name: string }) => ({
            value: param.id,
            text: param.name,
          })),
        );

        setGender(
          genderRes.data.map((param: { id: string; name: string }) => ({
            value: param.id,
            text: param.name,
          })),
        );

        setDzongkhag(
          dzongkhagRes.data.map((param: { id: string; name: string }) => ({
            value: param.id.toString(), // Ensure ID is a string
            text: param.name,
          })),
        );

        const usersData = usersRes.data?.results || usersRes.data || [];
        const flatUsers = Array.isArray(usersData) ? usersData.flat() : [];
        const userOptions = flatUsers.map((user: any) => ({
          value: user.id?.toString(),
          text:
            [user.username, user.name].filter(Boolean).join(" ").trim() ||
            `User ${user.id}`,
        }));
        setAssigned_to_id(userOptions);
      } catch (error: any) {
        console.error("Fetch Error:", error);
        setError(`Failed to load data: ${error.message || "Unknown error"}`);
        toast.error("Failed to fetch data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setIsLoading]);

  const updateURLParams = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams();
    params.set("page", "1");

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "" && value !== "all") {
        params.set(key, value);
      }
    });

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const dzongkhagFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
    const dzongkhagId = row.original.dzongkhag?.id?.toString();
    return dzongkhagId === filterValue;
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onSortingChange: (updater) => {
      setSorting(updater);
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      const sortField = newSorting[0]?.id;
      const sortOrder = newSorting[0]?.desc ? `-${sortField}` : sortField;
      setOrdering(sortOrder || "");
    },
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      pagination: { pageIndex: page - 1, pageSize },
    },
    pageCount: Math.ceil(totalCount / pageSize),
    filterFns: {
      dateRange: (row, columnId, filterValue) => {
        const { from_date, to_date } = filterValue;
        const rowDate = new Date(row.getValue(columnId));
        const from = from_date ? new Date(from_date) : null;
        const to = to_date ? new Date(to_date) : null;
        if (from && to) {
          return rowDate >= from && rowDate <= to;
        } else if (from) {
          return rowDate >= from;
        } else if (to) {
          return rowDate <= to;
        }
        return true;
      },
      dzongkhag: dzongkhagFilterFn,
    },
  });

  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setSearch(value), 500),
    [setSearch],
  );

  const handleInputChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    if (name === "phone_number" || name === "email") {
      debouncedSetSearch(value);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    const clearedFilters = {
      dzongkhag_id: "",
      from_date: "",
      to_date: "",
      category_id: "",
      assigned_to_id: "",
      status_id: "",
      phone_number: "",
      email: "",
      gender_id: "",
      priority: "",
      type: "",
      start_time: "",
      end_time: "",
    };
    setFilters(clearedFilters);
    setColumnFilters([]);
    setPage(1);
    setSearch("");
  };

  const handleDownloadExcel = () => {
    try {
      const filteredData = table
        .getFilteredRowModel()
        .rows.map((row) => row.original);
      const worksheetData = filteredData.map((row: any) => ({
        ID: row.id,
        Enquiry: row.query,
        Description: row.remarks,
        Dzongkhag: row.dzongkhag?.name || "",
        Date: moment(row.created_at).format("YYYY-MM-DD"),
        "Query Category": row.category?.name || "",
        Agent: `${row.assigned_to?.first_name || ""} ${row.assigned_to?.last_name || ""}`.trim(),
        Email: row.email || "",
        Phone: row.phone_number || "",
        Status: row.status?.name || "",
        Priority: row.priority || "",
        Gender: row.gender?.name || "",
      }));
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");
      worksheet["!cols"] = [
        { wch: 10 },
        { wch: 20 },
        { wch: 15 },
        { wch: 20 },
        { wch: 20 },
        { wch: 30 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
      ];
      XLSX.writeFile(workbook, `query_report_${new Date()}.xlsx`);
    } catch (error) {
      console.error("Excel Download Error:", error);
      toast.error("Failed to download Excel file. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      {error && (
        <div className="rounded-md bg-red-100 p-4 text-red-700">{error}</div>
      )}
      <Card className="w-full p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Date Range
              </label>
              <DateRangePicker
                onUpdate={(values) => {
                  const from = values.range.from
                    ? moment(values.range.from).format("YYYY-MM-DD")
                    : "";
                  const to = values.range.to
                    ? moment(values.range.to).format("YYYY-MM-DD")
                    : "";
                  setFilters((prev) => ({
                    ...prev,
                    from_date: from,
                    to_date: to,
                  }));
                  setStartDate(from);
                  setEndDate(to);
                }}
                initialDateFrom={startDate}
                initialDateTo={endDate}
                align="start"
                locale="en-GB"
                showCompare={false}
              />
            </div>
            <Button
              onClick={handleDownloadExcel}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Download Excel
            </Button>
          </div>

          <div className="w-full rounded-lg border bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BiFilterAlt className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-medium">Filters</h3>
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    {activeFilterCount} active
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMoreFilters(!showMoreFilters)}
                className="text-gray-600 hover:text-gray-800"
              >
                {showMoreFilters ? (
                  <>
                    <BiMinus className="mr-1 h-4 w-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <BiPlus className="mr-1 h-4 w-4" />
                    Show More
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Agent
                </label>
                <Select
                  value={filters.assigned_to_id || "all"}
                  onValueChange={(value) =>
                    handleSelectChange("assigned_to_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Agents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    {assigned_to_id.map((gen, index) => (
                      <SelectItem key={index} value={gen.value}>
                        {gen.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Priority
                </label>
                <Select
                  value={filters.priority || "all"}
                  onValueChange={(value) =>
                    handleSelectChange("priority", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Category
                </label>
                <Select
                  value={filters.category_id || "all"}
                  onValueChange={(value) =>
                    handleSelectChange("category_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {category.map((cat, index) => (
                      <SelectItem key={index} value={cat.value}>
                        {cat.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Gender
                </label>
                <Select
                  value={filters.gender_id || "all"}
                  onValueChange={(value) =>
                    handleSelectChange("gender_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Genders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    {gender.map((gen, index) => (
                      <SelectItem key={index} value={gen.value}>
                        {gen.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {showMoreFilters && (
              <div className="mt-2 grid grid-cols-1 gap-4 pt-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Type
                </label>
                <Select
                  value={filters.type || "all"}
                  onValueChange={(value) =>
                    handleSelectChange("type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="EMAIL">Email</SelectItem>
                    <SelectItem value="CALL">Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <Select
                    value={filters.status_id || "all"}
                    onValueChange={(value) =>
                      handleSelectChange("status_id", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {status.map((status, index) => (
                        <SelectItem key={index} value={status.value}>
                          {status.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Dzongkhag
                  </label>
                  <Select
                    value={filters.dzongkhag_id || "all"}
                    onValueChange={(value) =>
                      handleSelectChange("dzongkhag_id", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Dzongkhags" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dzongkhags</SelectItem>
                      {dzongkhag.map((gen, index) => (
                        <SelectItem key={index} value={gen.value}>
                          {gen.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Time Range
                  </label>
                  <TimeRangePicker onChange={(e)=>{
                    handleInputChange("start_time", e.start);
                    handleInputChange("end_time", e.end);
                  }}
                  
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    placeholder="Enter email"
                    value={filters.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <Input
                    placeholder="Enter phone"
                    value={filters.phone_number}
                    onChange={(e) =>
                      handleInputChange("phone_number", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full sm:w-auto mt-8"
                  >
                    Clear All Filters
                  </Button>
                </div>

              </div>
            )}
          </div>

          <div className="text-sm text-gray-600">
            Showing {table.getFilteredRowModel().rows.length} of {totalCount}{" "}
            results
          </div>

          <div className="overflow-hidden rounded-md border">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader className="sticky top-0 z-10 bg-muted">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="whitespace-nowrap p-2 text-center text-xs font-bold sm:p-3 sm:text-sm"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="hover:bg-muted/50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="whitespace-nowrap p-2 text-center text-xs sm:text-sm"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-sm"
                      >
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
              <span className="text-xs text-gray-600 sm:text-sm">
                Page {page} of {Math.ceil(totalCount / pageSize)}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= Math.ceil(totalCount / pageSize)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
