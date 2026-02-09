"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { BsTrash, BsPencil, BsArrowRepeat } from "react-icons/bs";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import ExpandCell from "@/components/common/ExpandCell";
import { G2C } from "@/types/g2c";

export const columns = (
  handleEdit: (g2c: G2C) => void,
  handleDelete: (id: G2C) => void,
): ColumnDef<G2C>[] => [
  {
    accessorKey: "id",
    header: "SL No",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Agency
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  {
    accessorKey: "url",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Links
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  {
    accessorKey: "parameter",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Parameter
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  {
    accessorKey: "Action",
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDelete(row.original)}
            className="flex items-center gap-1 rounded border border-red-300 px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <BsTrash size={16} />
            Delete
          </button>

          <button
            onClick={() => handleEdit(row.original)}
            className="flex items-center gap-1 rounded border border-blue-300 px-3 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-50"
          >
            <BsPencil size={16} />
            Edit
          </button>
        </div>
      );
    },
  },
];
