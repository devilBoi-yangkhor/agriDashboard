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
import { BiUserPlus } from "react-icons/bi";
import Link from "next/link";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  handleAdd: () => void;
  searchColumn?: string;
}

const DescriptionCell = ({ value }: { value: string }) => {
  const [expanded, setExpanded] = React.useState(false);
  const words = value?.split(" ") || [];
  const shouldTruncate = words.length > 15;

  return (
    <div className="flex flex-col">
      <span>
        {expanded || !shouldTruncate
          ? value
          : words.slice(0, 15).join(" ") + "..."}
      </span>
      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 self-start text-sm text-blue-500 hover:underline"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export function DataTable<TData, TValue>({
  columns,
  data,
  handleAdd,
  searchColumn = "topic",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const modifiedColumns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
    return columns.map((col) => {
      if (col.id === "description") {
        return {
          ...col,
          cell: ({ row }) => (
            <DescriptionCell value={(row.original as Record<string, any>)["description"] as string} />
          ),
        };
      }
      return col;
    });
  }, [columns]);

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

  const totalPages = table.getPageCount();
  const searchColumnExists = table.getColumn(searchColumn);

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search by topic..."
          value={
            (table.getColumn("question")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("question")?.setFilterValue(event.target.value)
          }
          className="max-w-[250px]"
        />

        <Link href="/notice-management/noticeboard/create">
          <Button className="btn-sm right-10 ml-10 transform gap-2 rounded-full bg-red-700 px-4 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-800 hover:shadow-lg">
            <BiUserPlus size={20} />
            Add New
          </Button>
        </Link>
      </div>
      <div className="rounded-md border">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className={`
                      transition-colors duration-200 hover:bg-gray-50
                      ${header.id === "topic" || header.id === "description" ? "w-[25%]" : ""}
                      ${index === 1 ? "pl-0" : ""} // Remove left padding for the second column
                    `}
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
                  className="relative transform transition-all duration-200 hover:z-10 hover:scale-[1.01] hover:bg-gray-50 hover:shadow-md"
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <TableCell
                      key={cell.id}
                      className={`
                        group
                        ${cellIndex === 1 ? "pl-0" : ""} // Remove left padding for the second column
                      `}
                    >
                      <div className="transition-all duration-200 group-hover:translate-x-2 group-hover:font-medium">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </div>
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
        <div className="mr-5 flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="transition-all duration-200 hover:bg-gray-100 hover:shadow-sm"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="transition-all duration-200 hover:bg-gray-100 hover:shadow-sm"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
