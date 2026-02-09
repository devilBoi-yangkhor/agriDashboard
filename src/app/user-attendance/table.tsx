"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
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
import Link from "next/link";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDataUpdate?: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onDataUpdate,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const table = useReactTable({
    data,
    columns,
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

  return (
    <div className="min-h-screen border-t-2 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Leave Record</h1>
        <Link href="/user-attendance/create" className="flex items-center">
          <Button className="rounded bg-red-700">Add Leave</Button>
        </Link>
      </div>

      <div className="mb-5 w-full rounded border bg-white p-6 shadow-md">
        <div className="flex flex-col gap-4">
          {/* Main Filters Row */}
          <div className="flex flex-row items-center gap-6">
            <Input
              placeholder="Filter by role..."
              value={
                (table.getColumn("username")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("username")?.setFilterValue(event.target.value)
              }
              className="max-w-xs"
            />
            {/* <Input
              type="date"
              placeholder="Filter by date..."
              value={
                (table.getColumn("date")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("date")?.setFilterValue(event.target.value)
              }
              className="max-w-xs"
            /> */}
          </div>
        </div>
      </div>

      <div className="rounded-md rounded-b-none rounded-t-md border bg-white pt-5 shadow-md">
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
                  className="transition-colors duration-150 hover:bg-gray-100"
                  style={{
                    overflow: "hidden",
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls centered */}
      <div className="flex items-center justify-center gap-6 rounded-b-md bg-white py-4 shadow-md">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>

        <span className="font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {totalPages}
        </span>

        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
