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
}

export function DataTable<TData, TValue>({
  columns,
  data,
  handleAdd,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

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

  const totalPages =
    table.getCoreRowModel()?.rows?.length &&
    table.getState()?.pagination?.pageSize
      ? Math.ceil(
          table.getCoreRowModel().rows.length /
            table.getState().pagination.pageSize,
        )
      : 0; // Default to 0 if data or pagination is not ready

  return (
    <div>
      
      <div className="rounded-md border">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b px-4 py-2">Sl No</th>
              <th className="border-b px-4 py-2">Descriptions</th>
              <th className="border-b px-4 py-2">Admin</th>
              <th className="border-b px-4 py-2">Supervisor</th>
              <th className="border-b px-4 py-2">Agent</th>
              <th className="border-b px-4 py-2">Customer</th>
            </tr>
          </thead>
          <tbody>
            {[].map((permission: any) => (
              <tr key={permission.id} className="hover:bg-gray-50">
                <td className="border-b px-4 py-2 text-center">
                  {permission.id}
                </td>
                <td className="border-b px-4 py-2">{permission.description}</td>
                <td className="border-b px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={permission.admin}
                    
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="border-b px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={permission.supervisor}
                   
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="border-b px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={permission.agent}
                    
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="border-b px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={permission.customer}
                   
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
        </Table> */}
        <div className="mr-5 flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
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
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
