"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BsTrash, BsPencil, BsEyeFill } from "react-icons/bs";
import { Master } from "@/types/master/master";
import { HasPermission } from "@/context/PermissionContext";
import Status from "@/components/Status/Status";

export const columns = (
  handleEdit: (master: Master) => void,
  handleDelete: (id: Master) => void,
  type: string,
): ColumnDef<Master>[] => {
  const baseColumns: ColumnDef<Master>[] = [
    {
      accessorKey: "id",
      header: "SL",
      cell: ({ row }) => <p>{row.index + 1}</p>,
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "is_active",
      header: () => <>Status</>,
      cell: ({ row }) => (
        <Status
          code={row.original.is_active}
          label={row.original.is_active ? "Active" : "In-active"}
        />
      ),
    },
  ];

  if (type === "category") {
    baseColumns.splice(3, 0, {
      accessorKey: "parent_name",
      header: () => <>Parent</>,
      cell: ({ row }) => <span>{row.original?.parent?.name || "—"}</span>,
    });
  }

  baseColumns.push({
    id: "actions",
    header: () => <>Action</>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2 p-2">
        <HasPermission hasPermissions={["delete_mastertable"]}>
          <button
            onClick={() => handleDelete(row.original)}
            className="flex items-center gap-1 rounded border border-red-300 px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-50"
            aria-label="Delete"
          >
            <BsTrash size={16} />
            Delete
          </button>
        </HasPermission>

        <HasPermission hasPermissions={["change_mastertable"]}>
          <button
            onClick={() => handleEdit(row.original)}
            className="flex items-center gap-1 rounded border border-blue-300 px-3 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-50"
            aria-label="Edit"
          >
            <BsPencil size={16} />
            Edit
          </button>
        </HasPermission>
      </div>
    ),
  });
  return baseColumns;
};
