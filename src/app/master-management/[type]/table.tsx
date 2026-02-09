"use client";
import * as React from "react";
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
import { useRouter } from "next/navigation";
import { BiUserPlus } from "react-icons/bi";
import { debounce } from "lodash";

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
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const router = useRouter();

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
    pageCount: Math.ceil(totalCount / pageSize),
  });

  const debouncedSetSearch = debounce((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearch(event.target.value);
  };

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search by Name"
          onChange={handleSearch}
          className="max-w-[250px]"
        />
        <Button
          onClick={() => {
            router.push(`/master-management/${catType}/create`);
          }}
          className="btn-sm right-10 ml-10 gap-2 rounded-full bg-red-700 px-4 py-2"
        >
          <BiUserPlus size={20} />
          Add New
        </Button>
      </div>
      <div className="table-container rounded-md border">
        <Table className="table-root">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="table-header-cell text-center"
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
                  className="origin-center transition-all duration-200 hover:scale-[1.02] hover:bg-gray-100 hover:shadow-md"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="table-body-cell p-1 text-center text-sm"
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
                  className="table-body-cell h-24 text-center"
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
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span>
            Page {page} of {Math.ceil(totalCount / pageSize)}
          </span>
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
    </>
  );
}
