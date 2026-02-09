"use client";
import React, { useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import Input from "@/components/Inputs/Input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { Role } from "@/types/Role";
import { getRole, updateRole } from "@/services/RoleService";

const EditRole = ({ params }: { params: Promise<{ id: string }> }) => {
  const { setIsLoading, isLoading } = useLoading();
  const [selectedPrivilegeIds] = React.useState<number[]>([]);
  const [initialValues, setInitialValues] = React.useState<Partial<Role>>({
    name: "",
    permission_ids: [],
  });

  const router = useRouter();
  const param = React.use(params);

  const handleSubmit = async (
    values: Partial<Role>,
    { resetForm }: FormikHelpers<Partial<Role>>,
  ) => {
    setIsLoading(true);
    try {
      const roleData = {
        name: values.name || "", // Ensure role_name is always a string
        permission_ids: selectedPrivilegeIds.map((id) => ({ id })),
      };

      await updateRole(Number(param.id), roleData).then((response) => {
        toast.success(response.data.message || "Role updated successfully", {
          duration: 1500,
        });
        setTimeout(() => {
          router.push("/user-management/roles");
        }, 2000);
      });
      resetForm();
    } catch (error) {
      console.error("ERROR", error);
      toast.error(
        (error as any)?.response?.data?.message || "Failed to update role",
        {
          duration: 2000,
        },
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch role data
        const roleResponse = await getRole(Number(param.id));

        setInitialValues({
          name: roleResponse.name,
          permission_ids: [],
        });
      } catch (error) {
        toast.error("An error occurred while fetching data.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [param.id, setIsLoading]);

  return (
    <DefaultLayout>
      <Breadcrumb parentPage="User Management" pageName="Edit Role" />
      <Card className="w-full">
        <CardContent className="max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <Formik
              initialValues={initialValues}
              validationSchema={Yup.object({
                name: Yup.string().required("Role name is required"),
              })}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {() => (
                <Form>
                  <div className="-mt-2 space-y-4 p-4 md:p-5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <Input
                          label="Role Name"
                          type="text"
                          placeholder="Enter Role Name"
                          name="name"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-4.5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-full"
                      >
                        {isLoading ? "Updating..." : "Update"}
                      </Button>
                      <Link href="/user-management/roles">
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

export default EditRole;
