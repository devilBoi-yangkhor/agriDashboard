"use client";

import { ColumnDef } from "@tanstack/react-table";
// Import the FAQ type/interface instead of the default export
interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  subCategory: string;
}

export const columns: ColumnDef<FAQ>[] = [
  {
    accessorKey: "question",
    header: "Question",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("question")}</div>
    ),
  },
  {
    accessorKey: "answer",
    header: "Answer",
    cell: ({ row }) => (
      <div className="text-gray-600">{row.getValue("answer")}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
        {row.getValue("category")}
      </span>
    ),
  },
  {
    accessorKey: "subCategory",
    header: "Sub-Category",
    cell: ({ row }) => (
      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
        {row.getValue("subCategory")}
      </span>
    ),
  },
];
