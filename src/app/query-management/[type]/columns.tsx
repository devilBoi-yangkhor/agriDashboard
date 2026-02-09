"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BsTrash, BsPencil, BsEye } from "react-icons/bs";

import { Query } from "@/types/Query";
import moment from "moment";
import { HasPermission } from "@/context/PermissionContext";

export const columns = (
  handleEdit: (query: Query) => void,
  handleDelete: (query: Query) => void,
  openModal: (query: Query) => void,
  type: string,
): ColumnDef<Query, unknown>[] => {
  const baseColumns: ColumnDef<Query, unknown>[] = [
    {
      accessorKey: "id",
      header: "SL",
      cell: ({ row }) => <p>{row.index + 1}</p>,
    },

    ...(type === "email" || type === "category"
      ? [
        {
          accessorKey: "email",
          header: ({ column }: { column: any }) => (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Email
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
        },
      ]
      : []),
    ...(type === "phone_number" || type === "call" || type === "category"
      ? [
        {
          accessorKey: "phone_number",
          header: ({ column }: { column: any }) => (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Phone Number
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
        },
      ]
      : []),
    {
      accessorKey: "query",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Query
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span
          className={`rounded-full px-2 py-1 text-xs ${row.original.status?.name === "Completed"
            ? "bg-green-100 text-green-800"
            : row.original.status?.name === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-blue-100 text-blue-800"
            }`}
        >
          {row.original.status?.name}
        </span>
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
      cell: ({ row }) => <span>{row.original.category?.name}</span>,
    },
    {
      accessorKey: "dzongkhag",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Dzongkhag
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.dzongkhag?.name}</span>,
    },
    {
      accessorKey: "gender",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Gender
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.gender?.name}</span>,
    },
    {
      accessorKey: "agent",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Handle By
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.assigned_to?.first_name} {row.original.assigned_to?.last_name}</span>,
    },
    ...(type === "call"
      ? [
        {
          accessorKey: "start_time",
          header: ({ column }: { column: any }) => (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Turnaround Time
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }: any) => {
            if (row.original.created_at && row.original.start_time) {
              const createdAt = moment(row.original.created_at);
              const startTime = moment(row.original.start_time, "HH:mm:ss"); // Parse time only

              // Merge createdAt date + startTime time
              const startAt = moment({
                year: createdAt.year(),
                month: createdAt.month(),
                date: createdAt.date(),
                hour: startTime.hour(),
                minute: startTime.minute(),
                second: startTime.second(),
              });

              // Calculate duration
              const duration = moment.duration(createdAt.diff(startAt));
              const minutes = duration.minutes();
              const seconds = duration.seconds();

              return (
                <span>
                  {minutes}m {seconds}s 
                </span>
              );
            }
            return <span>—</span>;
          }
        },
        {
          accessorKey: "end_time",
          header: ({ column }: { column: any }) => (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
             Start Time
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }: any) => {
            if (row.original.created_at && row.original.start_time) {
              const createdAt = moment(row.original.created_at);
              const startTime = moment(row.original.start_time, "HH:mm:ss"); // Parse time only

              const startAt = moment({
                year: createdAt.year(),
                month: createdAt.month(),
                date: createdAt.date(),
                hour: startTime.hour(),
                minute: startTime.minute(),
                second: startTime.second(),
              });

              return (
                <span>
                  {startAt.format("hh:mm:ss A")}
                </span>
              );
            }
            return <span>—</span>;
          }
        },
      ]
      : []),
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span
          className={`rounded-full px-2 py-1 text-xs ${row.original.priority === "LOW"
            ? "bg-slate-200 text-slate-800"
            : row.original.priority === "HIGH"
              ? "bg-rose-100 text-rose-600"
              : "bg-amber-100 text-amber-600"
            }`}
        >
          {row.original.priority}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const momentObj = moment.parseZone(row.original.created_at).local();
        return <span>{momentObj.format("YYYY-MM-DD")}</span>;
      },
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
      <>
        <div className="flex justify-end gap-2 p-2">
          <HasPermission hasPermissions={["delete_query"]}>
            <button
              onClick={() => handleDelete(row.original)}
              className="flex items-center gap-1 rounded border border-red-300 px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-50"
              aria-label="Delete"
            >
              <BsTrash size={16} />
            </button>
          </HasPermission>

          <HasPermission hasPermissions={["change_query"]}>
            <button
              onClick={() => handleEdit(row.original)}
              className="flex items-center gap-1 rounded border border-blue-300 px-3 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-50"
              aria-label="Edit"
            >
              <BsPencil size={16} />
            </button>
          </HasPermission>

          <HasPermission hasPermissions={["view_query"]}>
            <button
              onClick={() => openModal(row.original)}
              className="flex items-center gap-1 rounded border border-green-300 px-3 py-1 text-sm text-green-600 transition-colors hover:bg-green-50"
              aria-label="View"
            >
              <BsEye size={16} />
            </button>
          </HasPermission>
        </div>
      </>
    ),
  });

  return baseColumns;
};
