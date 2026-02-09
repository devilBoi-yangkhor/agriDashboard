"use client";
import React, { useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/Inputs/Input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { Role } from "@/types/Role";
import { createRole } from "@/services/RoleService";

const CreateRole = () => {
  const { setIsLoading, isLoading } = useLoading();

  const router = useRouter();

  const handleSubmit = async (values: Role) => {
    setIsLoading(true);
    try {
      await createRole(values)
        .then((response) => {
          toast.success(response.data.message, {
            duration: 1500,
            position: "top-right",
          });
          setTimeout(() => {
            router.push("/user-management/roles");
          }, 2000);
        })
        .finally(() => setIsLoading(false));
    } catch (error) {
      console.error("ERROR", error);
      toast.error("Failed to create role");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {}, []);

  return (
    <DefaultLayout>
      <Breadcrumb parentPage="User Management" pageName="Create Role" />
      <Card className="w-full">
        <CardContent className="max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <Formik
              initialValues={{
                name: "",
                permission_ids: [] as { id: number }[],
              }}
              validationSchema={Yup.object({
                name: Yup.string().required("Role name is required"),
              })}
              onSubmit={handleSubmit}
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

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="mx-2 rounded-full"
                    >
                      {isLoading ? "Submitting..." : "Submit"}
                    </Button>
                    <Link href="/user-management/roles">
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

export default CreateRole;
