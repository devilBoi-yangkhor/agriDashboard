"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  deleteNoticeboard,
  getNoticeboards,
} from "@/services/NoticeboardService";
import { useLoading } from "@/context/LoadingContext";
import { Options } from "@/interface/Options";
import { Noticeboard } from "@/types/Noticeboard";

const NoticeboardManagement = () => {
  const [noticeboardList, setNoticeboardList] = useState<Noticeboard[]>([]);
  const router = useRouter();
  const { isLoading, setIsLoading } = useLoading();

  const handleCreateNoticeboard = () => {
    setIsLoading(true);
    router.push("/notice-management/noticeboard/create");
  };

  const handleEditNoticeboard = (noticeboard: Noticeboard) => {
    router.push(`/notice-management/noticeboard/${noticeboard.id}`);
  };

  const handleDelete = async (noticeboard: Noticeboard) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      width: 450,
    });

    if (!result.isConfirmed) return;

    try {
      setIsLoading(true);
      await deleteNoticeboard(noticeboard.id);
      setNoticeboardList((prev) => prev.filter((n) => n.id !== noticeboard.id));
    } catch (error) {
      Swal.fire("Error", "Failed to delete noticeboard", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchNoticeboards = async () => {
      setIsLoading(true);
      try {
        const response = await getNoticeboards().finally(() =>
          setIsLoading(false),
        );
        setNoticeboardList(response.data.results);
      } catch (error) {
        console.error("Error fetching Notice:", error);
        Swal.fire(
          "Error!",
          "Failed to fetch Notice. Please try again.",
          "error",
        );
      }
    };

    fetchNoticeboards();
  }, []);

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg">
      <CardContent className="max-w-full overflow-x-auto">
        <DataTable
          columns={columns(handleEditNoticeboard, handleDelete)}
          data={noticeboardList}
          handleAdd={handleCreateNoticeboard}
        />
      </CardContent>
    </Card>
  );
};

export default NoticeboardManagement;
