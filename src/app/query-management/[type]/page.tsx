"use client";
import React, { useEffect, useState, use } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { CardContent } from "@/components/ui/card";
import { DataTable } from "./table";
import { columns } from "./columns";
import { Query } from "@/types/Query";
import { deleteQuery, getQuerysByType } from "@/services/QueryService";
import { useLoading } from "@/context/LoadingContext";
import Swal from "sweetalert2";
import { useRouter, useSearchParams } from "next/navigation";
import QueryDetailView from "@/components/QueryDetailView";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogDescription,
} from "@/components/ui/dialog";

const QueryPage = ({ params }: { params: Promise<{ type: string }> }) => {
  const [queryList, setQueryList] = useState<Query[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [ordering, setOrdering] = useState<string>("");
  const { setIsLoading } = useLoading();
  const [open, setOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const param = use(params);

  const openModal = (query: Query) => {
    setSelectedQuery(query);
    setOpen(true);
  };

  const handleEdit = (query: Query) => {
    localStorage.setItem("editQuery", JSON.stringify(query));
    router.push(`/query-management/${param.type}/edit/${query.id}`);
  };

  const handleDelete = async (query: Query) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        await deleteQuery(query.id);
        Swal.fire(
          "Deleted!",
          "Query has been deleted successfully.",
          "success",
        );
        setQueryList((prevQuerys) =>
          prevQuerys.filter((m) => m.id !== query.id),
        );
        setTotalCount((prev) => prev - 1);
      } catch (error) {
        console.error("Error deleting query:", error);
        Swal.fire(
          "Error!",
          "Failed to delete query. Please try again.",
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const getQuerys = async () => {
      try {
        setIsLoading(true);

        // Get all filter params from URL
        const filterParams = {
          category_id: searchParams.get('category_id') || '',
          status_id: searchParams.get('status_id') || '',
          gender_id: searchParams.get('gender_id') || '',
          priority: searchParams.get('priority') || '',
        };

        // Filter out empty values and create final params object
        const finalParams = Object.fromEntries(
          Object.entries(filterParams).filter(([_, value]) => value !== '')
        );


        const response = await getQuerysByType(
          param.type,
          page,
          pageSize,
          search,
          ordering,
          finalParams
        );
        setQueryList(response.data.results);
        setTotalCount(response.data.count);
      } catch (error) {
        console.error("Error fetching queries:", error);
        Swal.fire(
          "Error!",
          "Failed to fetch queries. Please try again.",
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    };
    getQuerys();
  }, [param.type, page, pageSize, search, ordering, setIsLoading, searchParams]);

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName={`${param.type.charAt(0).toUpperCase() + param.type.slice(1)} Query List`}
        parentPage="Query Management"
      />
      <div className="flex flex-col gap-2">
        <CardContent className="max-w-full overflow-hidden">
          <div className="w-full overflow-x-auto">
            <DataTable
              columns={columns(handleEdit, handleDelete, openModal, param.type)}
              catType={param.type}
              data={queryList}
              totalCount={totalCount}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setSearch={setSearch}
              setOrdering={setOrdering}
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogOverlay className="bg-black/50" />
            <DialogContent className="max-w-[90vw] sm:max-w-4xl w-full rounded-lg bg-background shadow-xl">
              <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
                <DialogTitle>Query Details</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div className="max-h-[80vh] overflow-y-auto px-6 py-2">
                {selectedQuery && <QueryDetailView query={selectedQuery} />}
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </div>
    </DefaultLayout>
  );
};

export default QueryPage;