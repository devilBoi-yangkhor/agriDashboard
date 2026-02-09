"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { BsTrash, BsPencil } from "react-icons/bs";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import ExpandCell from "@/components/common/ExpandCell";
import { FAQ } from "@/types/faq";
import { HasPermission } from "@/context/PermissionContext";

export const columns = (
  handleEdit: (faq: FAQ) => void,
  handleDelete: (id: FAQ) => void,
): ColumnDef<FAQ>[] => [
  {
    accessorKey: "id",
    header: "SL No",
    size: 10, // Small width for serial number
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    header: "Question",
    size: 60, // Adjusted width to accommodate new columns
    cell: ({ row }) => (
      <div className="prose max-w-none">
        <p className="text-base font-medium">{row.original.question}</p>
        <ExpandCell answer={row.original.answer} />
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 15, // Adjusted width for single category
    cell: ({ row }) => {
      const categoryName = row.original.category?.name || "No Category";
      return <span className="font-medium">{categoryName}</span>;
    },
  },
  {
    accessorKey: "sub_categories",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Sub-Category
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 20, // Slightly wider for multiple badges
    cell: ({ row }) => {
      const subCategories = row.original.sub_categories || [];
      return (
        <div className="flex flex-wrap gap-1">
          {subCategories.length > 0 ? (
            subCategories.map((sub, index) => (
              <Badge variant="outline" key={index}>
                {sub.name}
              </Badge>
            ))
          ) : (
            <span>No Sub-Category</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "Action",
    id: "actions",
    size: 15, // Small width for action buttons
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <HasPermission hasPermissions={["delete_faq"]}>
            <button
              onClick={() => handleDelete(row.original)}
              className="flex items-center gap-1 rounded border border-red-300 px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <BsTrash size={16} />
              Delete
            </button>
          </HasPermission>
          <HasPermission hasPermissions={["change_faq"]}>
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
