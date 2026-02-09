"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BiUserPlus } from "react-icons/bi";
import Link from "next/link";
import { getParentMastersByType } from "@/services/master/MasterService";
import { Options } from "@/interface/Options";
import { debounce } from "lodash";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  handleAdd: () => void;
}

interface Category {
  id: number;
  name: string;
  parent: Category | null;
}

const TruncatedText = ({
  text,
  maxWords = 10,
  isRowExpanded = false,
}: {
  text: string;
  maxWords?: number;
  isRowExpanded?: boolean;
}) => {
  const [isButtonExpanded, setIsButtonExpanded] = React.useState(false);
  const words = text.split(" ");
  const shouldTruncate = words.length > maxWords;
  const truncatedText = shouldTruncate
    ? words.slice(0, maxWords).join(" ") + "..."
    : text;

  const isExpanded = isRowExpanded || isButtonExpanded;

  return (
    <div>
      {isExpanded ? text : truncatedText}
      {shouldTruncate && (
        <button
          onClick={() => setIsButtonExpanded(!isButtonExpanded)}
          className="ml-1 text-blue-500 hover:underline"
        >
          {isButtonExpanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export function DataTable<TData, TValue>({
  columns,
  data,
  handleAdd,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [expandedRows, setExpandedRows] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [categories, setCategories] = React.useState<Options[]>([]);
  const [subCategories, setSubCategories] = React.useState<Options[]>([
    { value: "ALL", text: "All Sub-Categories" },
  ]);
  const [originalCategories, setOriginalCategories] = React.useState<
    Category[]
  >([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searchInput, setSearchInput] = React.useState<string>("");

  const ALL_FILTER_VALUE = "ALL";

  React.useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await getParentMastersByType("category");
        const catData: Category[] = response.data;
        setOriginalCategories(catData);
        const mainCategories = catData.filter((item) => item.parent == null);
        setCategories([
          { value: ALL_FILTER_VALUE, text: "All Categories" },
          ...mainCategories.map((cat) => ({
            value: String(cat.id),
            text: cat.name,
            data: cat,
          })),
        ]);
        setError(null);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load filter options. Please try again.");
        setSubCategories([
          { value: ALL_FILTER_VALUE, text: "All Sub-Categories" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const loadSubCategories = (categoryId: string) => {
    if (categoryId === ALL_FILTER_VALUE) {
      setSubCategories([
        { value: ALL_FILTER_VALUE, text: "All Sub-Categories" },
      ]);
      table.getColumn("sub_categories")?.setFilterValue("");
      return;
    }
    const subList = originalCategories.filter(
      (item) => item.parent !== null && String(item.parent.id) === categoryId,
    );
    setSubCategories([
      { value: ALL_FILTER_VALUE, text: "All Sub-Categories" },
      ...subList.map((sub) => ({
        value: String(sub.id),
        text: sub.name,
        data: sub,
      })),
    ]);
    table.getColumn("sub_categories")?.setFilterValue("");
  };

  const modifiedColumns = React.useMemo(() => {
    return columns.map((column) => {
      const columnId = (column as { id?: string }).id || (column as { accessorKey?: string }).accessorKey;
      if (columnId === "category") {
        return {
          ...column,
          filterFn: (row: { getValue: (arg0: any) => any; }, columnId: any, filterValue: string) => {
            const category = row.getValue(columnId);
            return filterValue === ""
              ? true
              : category?.id === Number(filterValue);
          },
        };
      }
      if (columnId === "sub_categories") {
        return {
          ...column,
          filterFn: (row: { getValue: (arg0: any) => never[]; }, columnId: any, filterValue: string) => {
            const subCategories = row.getValue(columnId) || [];
            return filterValue === ""
              ? true
              : subCategories.some((sub: { id: any; }) => String(sub.id) === filterValue);
          },
        };
      }
      if (columnId === "answer" || columnId === "question") {
        return {
          ...column,
          cell: ({
            row,
          }: {
            row: import("@tanstack/react-table").Row<TData>;
          }) => {
            const value = row.getValue(columnId);
            return (
              <TruncatedText
                text={String(value)}
                isRowExpanded={expandedRows[row.id] || false}
              />
            );
          },
        };
      }
      return column;
    });
  }, [columns, expandedRows]);

  const table = useReactTable({
    data,
    columns: modifiedColumns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const debouncedSetSearch = React.useCallback(
    debounce((value: string) => {
      table.getColumn("question")?.setFilterValue(value || "");
    }, 300),
    [table],
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);
    debouncedSetSearch(value);
  };

  const handleCategoryFilter = (value: string) => {
    const filterValue = value === ALL_FILTER_VALUE ? "" : value;
    table.getColumn("category")?.setFilterValue(filterValue);
    loadSubCategories(value);
    table.getColumn("sub_categories")?.setFilterValue("");
  };

  const handleSubCategoryFilter = (value: string) => {
    const filterValue = value === ALL_FILTER_VALUE ? "" : value;
    table.getColumn("sub_categories")?.setFilterValue(filterValue);
  };

  const clearFilters = () => {
    setSearchInput("");
    debouncedSetSearch.cancel();
    table.getColumn("question")?.setFilterValue("");
    table.getColumn("category")?.setFilterValue("");
    table.getColumn("sub_categories")?.setFilterValue("");
    setSubCategories([{ value: ALL_FILTER_VALUE, text: "All Sub-Categories" }]);
  };

  const totalPages =
    table.getCoreRowModel()?.rows?.length &&
    table.getState()?.pagination?.pageSize
      ? Math.ceil(
          table.getCoreRowModel().rows.length /
            table.getState().pagination.pageSize,
        )
      : 0;

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="mb-4 text-red-600" role="alert">
          {error}
        </div>
      )}
      <div className="flex items-center gap-4 py-4">
        {/* <Input
          placeholder="Search by question"
          value={searchInput}
          onChange={handleSearch}
          className="max-w-[250px]"
          aria-label="Search by question"
        /> */}
        <Select
          value={
            (table.getColumn("category")?.getFilterValue() as string) ||
            ALL_FILTER_VALUE
          }
          onValueChange={handleCategoryFilter}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[250px]" aria-label="Filter by category">
            <SelectValue placeholder="Filter By Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat, index) => (
              <SelectItem key={index} value={cat.value}>
                {cat.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={
            (table.getColumn("sub_categories")?.getFilterValue() as string) ||
            ALL_FILTER_VALUE
          }
          onValueChange={handleSubCategoryFilter}
          disabled={isLoading || subCategories.length === 1}
        >
          <SelectTrigger
            className="w-[250px]"
            aria-label="Filter by sub-category"
            title={
              subCategories.length === 1 ? "Select a category first" : undefined
            }
          >
            <SelectValue placeholder="Filter By Sub-Category" />
          </SelectTrigger>
          <SelectContent>
            {subCategories.map((sub, index) => (
              <SelectItem key={index} value={sub.value}>
                {sub.text}
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
        <Link href="/faq-management/create">
          <Button className="ml-auto gap-2 rounded-full bg-red-700 px-4 py-2">
            <BiUserPlus size={20} />
            Add New
          </Button>
        </Link>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                  className="cursor-pointer transition-all duration-100 hover:scale-[1.01] hover:bg-gray-100 hover:shadow-md"
                  onClick={() =>
                    setExpandedRows((prev) => ({
                      ...prev,
                      [row.id]: !prev[row.id],
                    }))
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mr-5 flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Previous page"
        >
          Previous
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Next page"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default DataTable;
