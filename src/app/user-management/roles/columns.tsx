"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BsTrash, BsPencil } from "react-icons/bs";
import { Role } from "@/types/Role";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";
import { HasPermission } from "@/context/PermissionContext";

export const columns = (
  handleEdit: (testType: Role) => void,
  handleDelete: (id: Role) => void,
): ColumnDef<Role>[] => [
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <>
          <div className="flex  gap-2">
            <HasPermission hasPermissions={["delete_group"]}>
              <button
                onClick={() => handleDelete(row.original)}
                className="flex items-center gap-1 rounded border border-red-300 px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-50"
                aria-label="Delete item"
              >
                <BsTrash size={16} />
                Delete
              </button>
            </HasPermission>
            <HasPermission hasPermissions={["change_group"]}>
              <button
                onClick={() => handleEdit(row.original)}
                className="flex items-center gap-1 rounded border border-blue-300 px-3 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-50"
                aria-label="Edit item"
              >
                <BsPencil size={16} />
                Edit
              </button>
            </HasPermission>
          </div>
        </>
      );
    },
  },
];
