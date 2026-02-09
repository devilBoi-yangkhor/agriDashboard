"use client";
import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { DataTable } from "./table";
import { columns } from "./columns";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { deleteUser, getUsers } from "@/services/UserService";
import { User } from "@/types/User";
import { useLoading } from "@/context/LoadingContext";
import { toast } from "sonner";

const UserManagement = () => {
  const [usersList, setUsersList] = useState<User[]>([]);
  const router = useRouter();
  const { setIsLoading } = useLoading();

  const handleCreateUser = () => {
    router.push("/user-management/users/create");
  };

  const handleEditUser = (user: User) => {
    router.push(`/user-management/users/${user.id}`);
  };

  // const fetchUsers = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await getUsers();
  //     setUsersList(response.data.results);
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //     toast.error("Failed to fetch users. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleDelete = async (user: User) => {
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
      await deleteUser(user.id); // Make sure this function returns a promise
      toast.success("User deleted successfully");
      await fetchUsers();
    } catch (error) {
      console.error("Delete error:", error); // Log the error for debugging
      toast.error(
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Failed to delete user",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = useCallback(async () => {
    try {
      const response = await getUsers(); // Your API call
      setUsersList(response.data.results.flat());
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  }, []); // Add any dependencies here if needed

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Card className="w-full">
      <CardContent className="max-w-full overflow-x-auto">
        <DataTable
          columns={columns(handleEditUser, handleDelete)}
          data={usersList}
          handleAdd={handleCreateUser}
        />
      </CardContent>
    </Card>
  );
};

export default UserManagement;
