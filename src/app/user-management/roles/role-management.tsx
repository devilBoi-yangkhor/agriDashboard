"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { DataTable } from "./table";
import { columns } from "./columns";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { deleteRole, getRoles } from "@/services/RoleService";
import { Role } from "@/types/Role";
import { useLoading } from "@/context/LoadingContext";
import { User } from "@/types/User";

const RoleManager: React.FC = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const { setIsLoading } = useLoading();
  const router = useRouter();

  const handleEdit = (role: Role) => {
    router.push(`/user-management/roles/${role.id}`);
    // setSelectedRole(role);
  };

  const handleDelete = (role: Role) => {
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
        if (role?.id !== undefined) {
          await deleteRole(role.id).then(() => {
            setRoles((prevRoles) =>
              prevRoles.filter((item) => item.id !== role.id),
            );
          });
        } else {
          toast.error("Role ID is undefined. Cannot delete the role.");
        }
        Swal.fire("Deleted!", "The role has been deleted.", "success").then(
          () => {
            router.push("/user-management/roles");
          },
        );
      }
    });
  };

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await getRoles().finally(() => setIsLoading(false));
      setRoles(response?.results);
    } catch (error) {
      console.error("Error fetching Roles:", error);
      Swal.fire("Error!", "Failed to fetch Roles. Please try again.", "error");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <Card className="flex flex-col gap-2">
      <CardContent>
        <DataTable columns={columns(handleEdit, handleDelete)} data={roles} />
      </CardContent>
    </Card>
  );
};

export default RoleManager;
