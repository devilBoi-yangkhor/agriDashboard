"use client";
import React, { useEffect, useState, use } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { CardContent } from "@/components/ui/card";
import { DataTable } from "./table";
import { columns } from "./columns";
import { Query } from "@/types/Query";
import { getQuerysByType } from "@/services/QueryService";
import { useLoading } from "@/context/LoadingContext";
import Swal from "sweetalert2";
import { useSearchParams } from "next/navigation";
import { Options } from "@/interface/Options";
import { getUsers } from "@/services/UserService";
import { getParentMastersByType } from "@/services/master/MasterService";
import { toast } from "react-toastify";

const QueryPage = ({ params }: { params: Promise<{ type: string }> }) => {
  const [queryList, setQueryList] = useState<Query[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(100);
  const [search, setSearch] = useState<string>("");
  const [ordering, setOrdering] = useState<string>("");
  const { setIsLoading } = useLoading();

    const [, setCategory] = useState<Options[]>([]);
    const [, setOriginalCategory] = useState<any[]>([]);
    const [, setOriginalStatus] = useState<any[]>([]);
    const [, setStatus] = useState<Options[]>([]);
    const [, setAssigned_to_id] = useState<Options[]>([]);
    const [, setGender] = useState<Options[]>([]);
    const [, setDzongkhag] = useState<Options[]>([]);
    const [, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const param = use(params);


  useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const [categoryRes, statusRes, genderRes, dzongkhagRes, usersRes] =
            await Promise.all([
              getParentMastersByType("category"),
              getParentMastersByType("status"),
              getParentMastersByType("gender"),
              getParentMastersByType("dzongkhag"),
              getUsers()
            ]);
  
          setOriginalCategory(categoryRes.data);
          const categories = categoryRes.data.filter(
            (item: any) => item.parent == null,
          );
          setCategory(
            categories.map((param: { id: string; name: string }) => ({
              value: param.id,
              text: param.name,
            })),
          );
  
          setOriginalStatus(statusRes.data);
          const statuses = statusRes.data.filter(
            (item: any) => item.parent == null,
          );
          setStatus(
            statuses.map((param: { id: string; name: string }) => ({
              value: param.id,
              text: param.name,
            })),
          );
  
          setGender(
            genderRes.data.map((param: { id: string; name: string }) => ({
              value: param.id,
              text: param.name,
            })),
          );
  
          setDzongkhag(
            dzongkhagRes.data.map((param: { id: string; name: string }) => ({
              value: param.id,
              text: param.name,
            })),
          );
  
          const usersData = usersRes.data?.results || usersRes.data || [];
          const flatUsers = usersData.flat();
          const userOptions = flatUsers.map((user: any) => ({
            value: user.id?.toString(),
            text:
              [user.username, user.name].filter(Boolean).join(" ").trim() ||
              `User ${user.id}`,
          }));
          setAssigned_to_id(userOptions);
        } catch (error: any) {
          console.error("Fetch Error:", error);
          setError(`Failed to load data: ${error.message || "Unknown error"}`);
          toast.error("Failed to fetch data. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, [setIsLoading, param.type]);

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
          dzongkhag_id: searchParams.get('dzongkhag_id') || '',
          assigned_to_id: searchParams.get('assigned_to_id') || '',
          from_date: searchParams.get('from_date') || '',
          to_date: searchParams.get('to_date') || '',
          start_time: searchParams.get('start_time') || '',
          end_time: searchParams.get('end_time') || '',
          type: searchParams.get('type') || '',
        };

        // Filter out empty values and create final params object
        const finalParams = Object.fromEntries(
          Object.entries(filterParams).filter(([_, value]) => value !== '')
        );


        const response = await getQuerysByType(
          param.type === "all" ? "" : param.type, // Pass empty string if type is "all"
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
        pageName={`Report`}
      />
      <div className="flex flex-col gap-2">
        <CardContent className="max-w-full overflow-hidden">
          <div className="w-full overflow-x-auto">
            <DataTable
              columns={columns()}
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
          
        </CardContent>
      </div>
    </DefaultLayout>
  );
};

export default QueryPage;