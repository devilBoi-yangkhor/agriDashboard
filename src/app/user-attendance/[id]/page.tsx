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
import { getAttendance, updateAttendance } from "@/services/AttendanceService";
import { Options } from "@/interface/Options";
import { getUsers } from "@/services/UserService";
import Select from "@/components/Inputs/Select";
import DatePicker from "@/components/Inputs/DatePicker";

const EditAttendance = ({ params }: { params: Promise<{ id: string }> }) => {
  const { setIsLoading, isLoading } = useLoading();
  const [usersOptions, setUsersOptions] = useState<Options[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter();
  const param = React.use(params);

  const [initialValues, setInitialValues] = useState<any>({
    user: {},
    email: "",
    mobile_number: "",
    roles: "",
    start_date: ["", ""],
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (values: Attendance) => {
    const payload = {
      user: values.user,
      start_date: formatDate(values.start_date?.[0] ?? ""),
      end_date: formatDate(values.start_date?.[1] ?? ""),
    };
    setIsLoading(true);
    try {
      await updateAttendance(Number(param.id), payload).then((response) => {
        toast.success(response.data.message, {
          duration: 1500,
          position: "top-right",
        });
        setTimeout(() => {
          router.push("/user-attendance");
        }, 2000);
      });
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error("Failed to update attendance", { duration: 2000 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch users
        const usersRes = await getUsers();
        const usersData = usersRes.data?.results || usersRes.data || [];
        const flatUsers = usersData.flat();

        const userOptions = flatUsers.map((user: any) => ({
          value: user.id?.toString(),
          text: user.username || `User ${user.id}`,
          data: {
            email: user.email || "",
            mobile_number: user.mobile_number || "",
            roles: ((user.roles as { name: string }[]) || [])
              .map((role: { name: string }) => role.name)
              .join(", "),
          },
        }));
        setUsersOptions(userOptions);
        setUsers(flatUsers);

        // Fetch attendance data
        const attendanceResponse = await getAttendance(Number(param.id));
        const attendanceData = attendanceResponse.data;

        // Find the user associated with the attendance
        const selectedUser = flatUsers.find(
          (user: any) =>
            user.id?.toString() ===
            (attendanceData.user?.id || attendanceData.user_id)?.toString(),
        );

        // Set initial values with fetched data
        setInitialValues({
          user:
            attendanceData.user?.id?.toString() ||
            attendanceData.user_id?.toString() ||
            "",
          email: selectedUser?.email || "",
          mobile_number: selectedUser?.mobile_number || "",
          roles: ((selectedUser?.roles as { name: string }[]) || [])
            .map((role: { name: string }) => role.name)
            .join(", "),
          start_date: [
            attendanceData.start_date || "",
            attendanceData.end_date || "",
          ],
        });
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Failed to fetch data. Please try again.", {
          duration: 2000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [param.id, setIsLoading]);

  return (
    <DefaultLayout>
      <Breadcrumb parentPage="User" pageName="Edit Attendance" />
      <Card className="w-full">
        <CardContent className="h-screen max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <Formik
              initialValues={initialValues}
              validationSchema={Yup.object({
                user: Yup.string().required("User is required"),
                start_date: Yup.array()
                  .of(Yup.string().required())
                  .min(2, "Please select a date range")
                  .required("Date is required"),
              })}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ setFieldValue, values, errors, touched }) => (
                <Form>
                  <div className="mb-5  space-y-4 p-4 md:p-5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <Select
                          searchable
                          label="User"
                          name="user"
                          options={usersOptions}
                          onValueChange={(value: string) => {
                            setFieldValue("user", value);
                            const selected = usersOptions.find(
                              (option) => option.value === value,
                            );
                            if (selected?.data) {
                              setFieldValue("email", selected.data.email);
                              setFieldValue(
                                "mobile_number",
                                selected.data.mobile_number,
                              );
                              setFieldValue("roles", selected.data.roles);
                            }
                          }}
                        />
                        {errors.user && touched.user && (
                          <p className="text-sm text-red-500">{errors.user}</p>
                        )}
                      </div>
                      <div className="w-full xl:w-1/2">
                        <label className="mb-1 block text-sm text-black dark:text-white">
                          Role
                        </label>
                        <Field
                          name="roles"
                          type="text"
                          placeholder="Enter role"
                          className="w-full rounded border p-2 text-sm shadow-sm "
                          disabled
                        />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="mb-1 block text-sm text-black dark:text-white">
                          Email
                        </label>
                        <Field
                          name="email"
                          type="email"
                          placeholder="Enter email"
                          className="w-full rounded border p-2 text-sm shadow-sm "
                          disabled
                        />
                      </div>

                      <div className="w-full xl:w-1/2">
                        <label className="mb-1 block text-sm text-black dark:text-white">
                          Mobile Number
                        </label>
                        <Field
                          name="mobile_number"
                          type="text"
                          placeholder="Enter mobile number"
                          className="w-full rounded border p-2 text-sm shadow-sm "
                          disabled
                        />
                      </div>
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <DatePicker
                          label="Select From Date and To Date"
                          name="start_date"
                          mode="range"
                          dateFormat="d F Y"
                        />
                        {errors.start_date && touched.start_date && (
                          <p className="text-sm text-red-500">
                            {errors.start_date}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-full"
                      >
                        {isLoading ? "Updating..." : "Update"}
                      </Button>
                      <Link href="/user-attendance/">
                        <Button
                          type="button"
                          variant="destructive"
                          className="rounded-full"
                        >
                          Back
                        </Button>
                      </Link>
                    </div>
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

export default EditAttendance;
