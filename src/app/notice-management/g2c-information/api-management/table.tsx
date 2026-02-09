"use client";
import * as React from "react";
import { Select } from "@/components/ui/select";
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

  const modifiedColumns = React.useMemo(() => {
    return columns.map((column) => {
      const columnId = (column as { id?: string }).id;
      if (columnId === "answer" || columnId === "question") {
        return {
          ...column,
          cell: ({
            row,
          }: {
            row: import("@tanstack/react-table").Row<TData>;
          }) => {
            const value = row.getValue(columnId as string);
            return <TruncatedText text={String(value)} />;
          },
        };
      }
      return column;
    });
  }, []);

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

  const totalPages =
    table.getCoreRowModel()?.rows?.length &&
    table.getState()?.pagination?.pageSize
      ? Math.ceil(
          table.getCoreRowModel().rows.length /
            table.getState().pagination.pageSize,
        )
      : 0;

  // State to track expanded rows
  const [expandedRows, setExpandedRows] = React.useState<{
    [key: string]: boolean;
  }>({});

  return (
    <>
      <div className="rounded-md border shadow-lg">
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
    </>
  );
}

export default DataTable;
