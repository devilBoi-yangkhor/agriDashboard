"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { BsTrash, BsPencil, BsArrowRepeat } from "react-icons/bs";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { Noticeboard } from "@/types/Noticeboard";
import ExpandCell from "@/components/common/ExpandCell";
import { HasPermission } from "@/context/PermissionContext";

export const columns = (
  handleEdit: (noticeboard: Noticeboard) => void,
  handleDelete: (id: Noticeboard) => void,
): ColumnDef<Noticeboard>[] => [
  {
    accessorKey: "id",
    header: "SL No",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="transition-all duration-200 hover:bg-gray-100 hover:text-blue-600"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateValue = row.getValue("created_at");
      return (typeof dateValue === "string" ||
        typeof dateValue === "number" ||
        dateValue instanceof Date) &&
        dateValue ? (
        <span>
          {new Date(dateValue).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ) : (
        <span>-</span>
      );
    },
  },

  {
    header: "Topic",
    cell: ({ row }) => (
      <div className="group">
        <p className="text-base font-medium transition-all duration-200 group-hover:text-blue-600">
          {row.original.topic}
        </p>
        <ExpandCell answer={row.original.description} />
      </div>
    ),
  },

  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="transition-all duration-200 hover:bg-gray-100 hover:text-blue-600"
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const category = row.original.category?.name;
      const sub_categories = row.original.sub_categories;

      return (
        <div className="flex flex-col gap-1">
          {category && <span>{category}</span>}
          {sub_categories && (
            <div className="flex flex-wrap gap-1">
              {sub_categories?.map((sub, index) => (
                <Badge
                  variant={`outline`}
                  key={index}
                  className="transition-all duration-200 hover:bg-gray-100 hover:shadow-sm"
                >
                  {sub.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="transition-all duration-200 hover:bg-gray-100 hover:text-blue-600"
        >
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      let priorityClass = "";
      switch (priority) {
        case "HIGH":
          priorityClass = "bg-red-100 text-red-800 hover:bg-red-200";
          break;
        case "MEDIUM":
          priorityClass = "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
          break;
        default:
          priorityClass = "bg-green-100 text-green-800 hover:bg-green-200";
      }
      return (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium transition-all duration-200 ${priorityClass}`}
        >
          {priority}
        </span>
      );
    },
  },

  {
    accessorKey: "Action",
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <HasPermission hasPermissions={["delete_notification"]}>
            <button
              onClick={() => handleDelete(row.original)}
              className="flex items-center gap-1 rounded border border-red-300 px-3 py-1 text-sm text-red-600 transition-all duration-200 hover:border-red-400 hover:bg-red-50 hover:text-red-700 hover:shadow-sm"
            >
              <BsTrash
                size={16}
                className="transition-transform duration-200 hover:scale-110"
              />
              Delete
            </button>
          </HasPermission>
          <HasPermission hasPermissions={["change_notification"]}>
            <button
              onClick={() => handleEdit(row.original)}
              className="flex items-center gap-1 rounded border border-blue-300 px-3 py-1 text-sm text-blue-600 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm"
            >
              <BsPencil
                size={16}
                className="transition-transform duration-200 hover:scale-110"
              />
              Edit
            </button>
          </HasPermission>
        </div>
      );
    },
  },
];
