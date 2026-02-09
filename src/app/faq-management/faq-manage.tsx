"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation"; // Changed from 'next/router'
import {
  deleteNoticeboard,
  getNoticeboards,
} from "@/services/NoticeboardService";
import { useLoading } from "@/context/LoadingContext";
import { Options } from "@/interface/Options";
import { Noticeboard } from "@/types/Noticeboard";
import { FAQ } from "@/types/faq";
import { getFaqs, deleteFaq } from "@/services/FaqService";

const FaqManagement = () => {
  const [faqList, setFaqList] = useState<FAQ[]>([]);

  const router = useRouter();
  const { isLoading, setIsLoading } = useLoading();

  const handleCreateFaq = () => {
    setIsLoading(true);
    router.push("/faq-management/create");
  };

  const handleEditFaq = (faq: FAQ) => {
    router.push(`/faq-management/${faq.id}`);
  };

  const handleDelete = async (faq: FAQ) => {
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
      await deleteFaq(faq.id);
      // Option 1: If you're using local state for noticeboards
      setFaqList((prev) => prev.filter((n) => n.id !== faq.id));

      // Option 2: If you need to refetch data
      // await fetchNoticeboards(); // Assuming you have a fetch function

      // Option 3: If using a state management library
      // dispatch(deleteNoticeboardAction(noticeboard.id));
    } catch (error) {
      Swal.fire("Error", "Failed to delete faq", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchFaqs = async () => {
      setIsLoading(true);
      try {
        const response = await getFaqs().finally(() => setIsLoading(false));
        setFaqList(response.data.results);
        console.log(response);
      } catch (error) {
        console.error("Error fetching faq:", error);
        Swal.fire("Error!", "Failed to fetch faq. Please try again.", "error");
      }
    };

    fetchFaqs();
  }, []);

  return (
    <Card className="w-full">
      <CardContent className="max-w-full overflow-x-auto">
        <DataTable
          columns={columns(handleEditFaq, handleDelete)}
          data={faqList}
          handleAdd={handleCreateFaq}
        />
      </CardContent>
    </Card>
  );
};

export default FaqManagement;
function users(type: any) {
  throw new Error("Function not implemented.");
}
