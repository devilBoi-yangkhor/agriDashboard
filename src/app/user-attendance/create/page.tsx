"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { Attendance } from "@/types/Attendance";
import { createAttendance } from "@/services/AttendanceService";
import { Options } from "@/interface/Options";
import { getUsers } from "@/services/UserService";
import Select from "@/components/Inputs/Select";
import DatePicker from "@/components/Inputs/DatePicker";

const CreateAttendance = () => {
  const { setIsLoading, isLoading } = useLoading();
  const [usersOptions, setUsersOptions] = useState<Options[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any[]>([]);
  const router = useRouter();

  // Set default user to the first in the users list, or empty if not loaded yet
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (users.length > 0) {
      const defaultUser = users[0];
      setCurrentUserId(defaultUser?.id?.toString() || "");
      setCurrentUser(defaultUser || null);
    }
  }, [users]);

  const initialValues = {
    user: currentUserId || "",
    email: currentUser?.email || "",
    mobile_number: currentUser?.mobile_number || "",
    roles: ((currentUser?.roles as { name: string }[]) || [])
      .map((role: { name: string }) => role.name)
      .join(", "),
  };

  const handleSubmit = async (values: Attendance) => {
    const formatDate = (dateStr: string) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const payload = {
      user: values.user,
      start_date: formatDate(values.start_date?.[0] ?? ""),
      end_date: formatDate(values.start_date?.[1] ?? ""),
    };
    setIsLoading(true);
    try {
      await createAttendance(payload)
        .then((response) => {
          toast.success(response.data.message, {
            duration: 1500,
            position: "top-right",
          });
          setTimeout(() => {
            router.push("/user-attendance");
          }, 2000);
        })
        .finally(() => setIsLoading(false));
    } catch (error) {
      console.error("ERROR", error);
      toast.error("Failed to create Attendance");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch User data
        const usersRes = await getUsers();
        const usersData = usersRes.data?.results || usersRes.data || [];
        const flatUsers = usersData.flat();

        setUsersOptions(
          flatUsers.map((user: any) => {
            return {
              value: user.id?.toString(),
              text: user.username || `User ${user.id}`,
            };
          }),
        );
        setUsers(usersData);
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Failed to fetch users. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb parentPage="User" pageName="Create Attendance" />
      <Card className="w-full">
        <CardContent className="h-screen max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {({ setFieldValue, values }) => (
                <Form>
                  <div className="mb-5  space-y-4 p-4 md:p-5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2 ">
                        <Select
                          searchable
                          label="User Name"
                          name="user"
                          options={usersOptions}
                          // value={currentUserId?.toString()}
                          onValueChange={(value: string) => {
                            setFieldValue("user", value);
                            const selected = users.find(
                              (user) => user.id?.toString() === value,
                            );
                            setFieldValue("email", selected?.email || "");
                            setFieldValue(
                              "mobile_number",
                              selected?.mobile_number || "",
                            );
                            const roles: string = (
                              (selected?.roles as { name: string }[]) || []
                            )
                              .map((role: { name: string }) => role.name)
                              .join(", ");
                            setFieldValue("roles", roles);
                          }}
                        />
                      </div>

                      <div className="w-full xl:w-1/2">
                        <label className="mb-1 block  text-sm text-black dark:text-white">
                          Role
                        </label>
                        <Field
                          name="roles"
                          type="text"
                          placeholder="Enter mobile number"
                          className="w-full rounded border p-2 text-sm shadow-sm "
                        />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="mb-1 block text-sm  text-black dark:text-white">
                          Mobile Number
                        </label>
                        <Field
                          name="mobile_number"
                          type="text"
                          placeholder="Enter mobile number"
                          className="w-full rounded border p-2 text-sm shadow-sm "
                        />
                      </div>

                      <div className="w-full xl:w-1/2">
                        <label className="mb-1 block  text-sm text-black  dark:text-white">
                          Email
                        </label>
                        <Field
                          name="email"
                          type="email"
                          placeholder="Enter email"
                          className="w-full rounded border p-2 text-sm shadow-sm "
                        />
                      </div>
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full  xl:w-1/2">
                        <DatePicker
                          label="Select Start Date and End Date"
                          name="start_date"
                          mode="range"
                          dateFormat="d F Y"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="mx-2 mt-5 rounded-full "
                    >
                      {isLoading ? "Submitting..." : "Submit"}
                    </Button>
                    <Link href="/user-attendance/">
                      <Button
                        type="reset"
                        variant="destructive"
                        className="mx-2 rounded-full"
                      >
                        Back
                      </Button>
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
};

export default CreateAttendance;
