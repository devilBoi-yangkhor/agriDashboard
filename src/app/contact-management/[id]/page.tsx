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
import { Contact } from "@/types/Contact";
import { getContact, updateContact } from "@/services/ContactService";

const EditContact = ({ params }: { params: Promise<{ id: string }> }) => {
  const { setIsLoading, isLoading } = useLoading();
  const [selectedPrivilegeIds] = React.useState<number[]>([]);
  const [initialValues, setInitialValues] = React.useState<Partial<Contact>>({
    name: "",
    phone_number: "",
    email: "",
    department: "",
  });

  const router = useRouter();
  const param = React.use(params);

  const handleSubmit = async (
    values: Partial<Contact>,
    { resetForm }: FormikHelpers<Partial<Contact>>,
  ) => {
    setIsLoading(true);
    try {
      const contactData = {
        name: values.name || "",
        phone_number: values.phone_number || "",
        email: values.email || "",
        department: values.department || "",
      };

      await updateContact(Number(param.id), contactData).then((response) => {
        toast.success(response.data.message || "Contact updated successfully", {
          duration: 1500,
        });
        setTimeout(() => {
          router.push("/contact-management/");
        }, 2000);
      });
      resetForm();
    } catch (error) {
      console.error("ERROR", error);
      toast.error(
        (error as any)?.response?.data?.message || "Failed to update contact",
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
        // Fetch contact data
        const contactResponse = await getContact(Number(param.id));
        const { data } = contactResponse;

        setInitialValues({
          name: data.name,
          phone_number: data.phone_number,
          email: data.email,
          department: data.department,
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
      <Breadcrumb parentPage="Contact Management" pageName="Edit Contact" />
      <Card className="w-full">
        <CardContent className="max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <Formik
              initialValues={initialValues}
              validationSchema={Yup.object({
                name: Yup.string().required("Contact name is required"),
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
                          label="Contact Name"
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
                      <Link href="/contact-management/">
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

export default EditContact;
