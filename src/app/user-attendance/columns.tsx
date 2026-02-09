"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { BsTrash, BsPencil } from "react-icons/bs";
import { Attendance } from "@/types/Attendance";
import { ArrowUpDown } from "lucide-react";
import { HasPermission } from "@/context/PermissionContext";

export const columns = (
  handleEdit: (attendance: Attendance) => void,
  handleDelete: (attendance: Attendance) => void,
): ColumnDef<Attendance>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <p className="text-center">{row.index + 1}</p>,
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="justify-start"
      >
        User Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      console.log(row.original)
      return <span>{row.original.username}</span>;
    }
  },

  {
    accessorKey: "date_range",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="mx-auto"
      >
        Date Range
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "No date";
        const [year, month, day] = dateStr.split("-");
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        return `${parseInt(day)}, ${months[parseInt(month) - 1]} ${year}`;
      };

      const today = new Date();
      const endDate = row.original.end_date
        ? new Date(row.original.end_date)
        : null;

      const isExpired = endDate ? endDate < today : false;

      return (
        <div className={isExpired ? "text-red-600" : ""}>
          <p>
            {row.original.start_date
              ? `Start: ${formatDate(row.original.start_date)}`
              : "No start date"}
          </p>
          <p>
            {row.original.end_date
              ? `End: ${formatDate(row.original.end_date)}`
              : "No end date"}
          </p>
        </div>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = rowA.original.start_date || "";
      const dateB = rowB.original.start_date || "";
      return dateA.localeCompare(dateB);
    },
  },
  {
    accessorKey: "duration",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="mx-auto"
      >
        Days
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <p className="text-center">
        {row.original.duration} {row.original.duration === 1 ? "day" : "days"}
      </p>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <HasPermission hasPermissions={["delete_attendance"]}>
          <button
            onClick={() => handleDelete(row.original)}
            className="flex items-center gap-1 rounded border border-red-300 px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-50"
            aria-label="Delete item"
          >
            <BsTrash size={16} />
          </button>
        </HasPermission>
        <HasPermission hasPermissions={["change_attendance"]}>
          <button
            onClick={() => handleEdit(row.original)}
            className="flex items-center gap-1 rounded border border-blue-300 px-3 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-50"
            aria-label="Edit item"
          >
            <BsPencil size={16} />
          </button>
        </HasPermission>
      </div>
    ),
  },
];
