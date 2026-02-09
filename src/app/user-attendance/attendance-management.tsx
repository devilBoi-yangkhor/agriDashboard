"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { DataTable } from "./table";
import { columns } from "./columns";
import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { deleteAttendance, getAttendances } from "@/services/AttendanceService";
import { Attendance } from "@/types/Attendance";
import { useLoading } from "@/context/LoadingContext";

const UserAttendance: React.FC = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();

  const handleEdit = (attendance: Attendance) => {
    router.push(`/user-attendance/${attendance.id}`);
  };

  const handleDelete = async (attendance: Attendance) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (attendance?.id) {
          try {
            await deleteAttendance(attendance.id);
            setAttendances((prev) =>
              prev.filter((item) => item.id !== attendance.id),
            );
            Swal.fire(
              "Deleted!",
              "The Attendance has been deleted.",
              "success",
            );
          } catch (error) {
            console.error("Error deleting attendance:", error);
            Swal.fire("Error!", "Failed to delete attendance.", "error");
          }
        } else {
          toast.error(
            "Attendance ID is undefined. Cannot delete the Attendance.",
          );
        }
      }
    });
  };

  const fetchAttendances = async () => {
    setIsLoading(true);
    try {
      const response = await getAttendances();
      setAttendances(
        response.data.results.map((item: any) => {
          // Parse duration (e.g., "2 00:00:00" -> 2)
          const durationDays = parseInt(item.duration.split(" ")[0], 10) || 0;

          return {
            id: item.id,
            username: item.user.username,
            email: item.user.email,
            roles: item.user.role_ids,
            mobile_number: item.user.mobile_number,
            start_date: item.start_date,
            end_date: item.end_date,
            duration: durationDays,
          };
        }),
      );
    } catch (error) {
      console.error("Error fetching Attendance:", error);
      Swal.fire(
        "Error!",
        "Failed to fetch Attendance. Please try again.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, []); // Re-fetch when pathname changes

  // Debug: Log attendances state
  useEffect(() => {
    console.log("Attendances state:", attendances);
  }, [attendances]);

  return (
    <DataTable
      columns={columns(handleEdit, handleDelete)}
      data={attendances}
      onDataUpdate={fetchAttendances} // Pass fetch function to refresh data
    />
  );
};

export default UserAttendance;
