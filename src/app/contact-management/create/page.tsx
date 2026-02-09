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
import { Contact } from "@/types/Contact";
import { createContact } from "@/services/ContactService";

const CreateContact = () => {
  const { setIsLoading, isLoading } = useLoading();

  const router = useRouter();

  const handleSubmit = async (values: Contact) => {
    setIsLoading(true);
    try {
      await createContact(values)
        .then((response) => {
          toast.success(response.data.message, {
            duration: 1500,
            position: "top-right",
          });
          setTimeout(() => {
            router.push("/contact-management/");
          }, 2000);
        })
        .finally(() => setIsLoading(false));
    } catch (error) {
      console.error("ERROR", error);
      toast.error("Failed to create contact");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {}, []);

  return (
    <DefaultLayout>
      <Breadcrumb parentPage="Contact Management" pageName="Create Contact" />
      <Card className="w-full">
        <CardContent className="max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <Formik
              initialValues={{
                name: "",
                phone_number: "",
                email: "",
                department: "",
                created_by: "",
              }}
              validationSchema={Yup.object({
                name: Yup.string().required("Contact name is required"),
                phone_number: Yup.string().required("Phone Number is required"),
                department: Yup.string().required("Department is required"),
              })}
              onSubmit={handleSubmit}
            >
              {() => (
                <Form>
                  <div className="-mt-2 space-y-4 p-4 md:p-5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <Input
                          label="Name"
                          type="text"
                          placeholder="Enter Contact Name"
                          name="name"
                        />
                      </div>
                      <div className="w-full xl:w-1/2">
                        <Input
                          label="Phone Number"
                          type="text"
                          placeholder="Enter Contact Name"
                          name="phone_number"
                        />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <Input
                          label="Email"
                          type="text"
                          placeholder="Enter Contact Name"
                          name="email"
                        />
                      </div>

                      <div className="w-full xl:w-1/2">
                        <Input
                          label="Department"
                          type="text"
                          placeholder="Enter Contact Name"
                          name="department"
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
                    <Link href="/contact-management/">
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

export default CreateContact;
