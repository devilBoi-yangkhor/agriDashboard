"use client";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect } from "react";
import { Formik, Form, FormikState } from "formik";
import * as Yup from "yup";
import Input from "@/components/Inputs/Input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { createUser } from "@/services/UserService";
import { getRoleDropdowns } from "@/services/RoleService";
import { User } from "@/types/User";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { Options } from "@/interface/Options";
import SelectDropDown from "@/components/Inputs/Select";

const UsersCreate = () => {
  const [roleList, setRoleList] = useState<Options[]>([]);
  const { setIsLoading, isLoading } = useLoading();

  const router = useRouter();

  const handleSubmit = async (
    values: User,
    resetForm: (nextState?: Partial<FormikState<any>> | undefined) => void,
  ) => {
    setIsLoading(true);
      const { roles, ...userPayload } = values;
      await createUser({ ...userPayload, role_ids: [values.role] })
        .then((response) => {
          toast.success(response.data.message, {
            duration: 1500,
            position: "top-right",
          });
          resetForm();
          setTimeout(() => {
            // setIsLoading(false)
            router.push("/user-management/users");
          }, 2000);
        })
        .catch((e) => {
          console.log("Error while creating user.");
        })
        .finally(() => setIsLoading(false));
   
  };

  useEffect(() => {
    const fetchRoles = async () => {
      getRoleDropdowns().then((response) => {
        const optionList = response.data.map((role: any) => ({
          value: String(role.id),
          text: role.name,
        }));
        console.log(optionList);
        setRoleList(optionList);
      });
    };
    fetchRoles();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb parentPage="User Management" pageName="Create User" />
      <Card className="min-h-screen w-full">
        <CardContent className="min-h-screen max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <Formik
              initialValues={{
                id: null, // Add default id value
                username: "",
                cid: "",
                first_name: "",
                last_name: "",
                email: "",
                mobile_number: "",
                role: "",
                is_active: true,
              }}
              validationSchema={Yup.object({
                username: Yup.string()
                  .required("Username is required")
                  .min(3, "Must be at least 3 characters"),
                cid: Yup.string()
                  .required("CID is required")
                  .min(11, "Must be at least 11 characters"),
                first_name: Yup.string()
                  .required("Full name is required")
                  .min(3, "Must be at least 3 characters"),
                last_name: Yup.string().optional(),
                email: Yup.string()
                  .required("Email address is required")
                  .email("Invalid email address"),
                role: Yup.string().required("Select Role"),
                mobile_number: Yup.string()
                  .required("Mobile number is required")
                  .min(8, "Enter at least 8 characters"),
              })}
              onSubmit={(values, { resetForm }) => {
                handleSubmit(values, resetForm);
              }}
            >
              {({ errors }) => {
                // console.log(errors);
                return (
                  <Form>
                    <div className="-mt-2 space-y-4 p-4 md:p-5">
                      <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                          <SelectDropDown
                            label="Select Role"
                            name="role"
                            options={roleList}
                          />
                        </div>
                      </div>
                      <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                          <Input
                            label="First Name"
                            autoComplete="off"
                            type="text"
                            placeholder="Enter your full name"
                            name="first_name"
                          />
                        </div>
                        <div className="w-full xl:w-1/2">
                          <Input
                            label="Last Name"
                            autoComplete="off"
                            type="text"
                            placeholder="Enter your last name"
                            name="last_name"
                          />
                        </div>
                      </div>

                      <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                          <Input
                            label="Username"
                            type="text"
                            placeholder="Enter userName"
                            name="username"
                          />
                        </div>
                        <div className="w-full xl:w-1/2">
                          <Input
                            label="Email"
                            type="email"
                            placeholder="Enter email address"
                            name="email"
                          />
                        </div>
                      </div>

                      <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                          <Input
                            label="CID Number"
                            type="text"
                            placeholder="Enter CID number"
                            name="cid"
                          />
                        </div>
                        <div className="w-full xl:w-1/2">
                          <Input
                            label="Phone Number"
                            type="text"
                            placeholder="Enter phone number"
                            name="mobile_number"
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
                      <Link href="/user-management/users">
                        <Button
                          type="reset"
                          variant={`destructive`}
                          className="mx-2 rounded-full"
                        >
                          Back
                        </Button>
                      </Link>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
};

export default UsersCreate;
