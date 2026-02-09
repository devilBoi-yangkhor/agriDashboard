"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BsTrash, BsPencil, BsArrowRepeat } from "react-icons/bs";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { User } from "@/types/User";
import { HasPermission } from "@/context/PermissionContext";

export const columns = (
  handleEdit: (testType: User) => void,
  handleDelete: (id: User) => void,
): ColumnDef<User>[] => [
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "roles",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <>
          {row.original.roles?.map((role, index) => (
            <Badge key={index}>{role.name}</Badge>
          ))}
        </>
      );
    },
  },

  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "phone_number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mobile Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "active",
    header: () => "Status",
    cell: ({ row }) => {
      const status = row.original.is_active;
      return (
        <p
          className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${
            status ? "bg-success text-success" : "bg-danger text-danger"
          }`}
        >
          {status ? "Active" : "Inactive"}
        </p>
      );
    },
  },
  {
    accessorKey: "Action",
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <HasPermission hasPermissions={["delete_user"]}>
            <button
              onClick={() => handleDelete(row.original)}
              className="flex items-center gap-1 rounded border border-red-300 px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <BsTrash size={16} />
              Delete
            </button>
          </HasPermission>

          <HasPermission hasPermissions={["change_user"]}>
            <button
              onClick={() => handleEdit(row.original)}
              className="flex items-center gap-1 rounded border border-blue-300 px-3 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-50"
            >
              <BsPencil size={16} />
              Edit
            </button>
          </HasPermission>
        </div>
      );
    },
  },
];


