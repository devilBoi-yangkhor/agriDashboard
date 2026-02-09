"use client";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import Input from "@/components/Inputs/Input";
import { G2C } from "@/types/g2c";
import { createG2C, getG2Cs, deleteG2C } from "@/services/G2CService";
import DataTable from "../table";
import { columns } from "./../columns";
import Swal from "sweetalert2";

const G2CCreate = () => {
  const { setIsLoading, isLoading } = useLoading();
  const [g2cList, setG2cList] = useState<G2C[]>([]);
  const router = useRouter();

  const handleSubmit = async (values: G2C) => {
    setIsLoading(true);
    try {
      await createG2C({
        name: values.name,
        url: values.url,
        parameter: values.parameter,
      })
        .then((response) => {
          toast.success(response.data.message, {
            duration: 1500,
            position: "top-right",
          });
          setTimeout(() => {
            window.location.reload(); 
          }, 2000);
        })
        .catch((e) => {
          toast.error("Error while creating G2C API.");
        })
        .finally(() => setIsLoading(false));
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  const handleEditG2C = (g2c: G2C) => {
    router.push(`/g2c-information/${g2c.id}`);
  };

  const handleCreateG2C = () => {
    setIsLoading(true);
    router.push("/notice-management/g2c-information/api-management/create");
  };

  const handleDelete = async (g2c: G2C) => {
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
      await deleteG2C(g2c.id);
      // Option 1: If you're using local state for noticeboards
      setG2cList((prev) => prev.filter((n) => n.id !== g2c.id));

      // Option 2: If you need to refetch data
      // await fetchNoticeboards(); // Assuming you have a fetch function

      // Option 3: If using a state management library
      // dispatch(deleteNoticeboardAction(noticeboard.id));
    } catch (error) {
      Swal.fire("Error", "Failed to delete G2C", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchFaqs = async () => {
      setIsLoading(true);
      try {
        const response = await getG2Cs().finally(() => setIsLoading(false));
        setG2cList(response.data.results);
        console.log(response);
      } catch (error) {
        console.error("Error fetching g2c:", error);
        Swal.fire("Error!", "Failed to fetch G2C. Please try again.", "error");
      }
    };

    fetchFaqs();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb parentPage="G2C Information" pageName="Create API" />
      <Card className=" h-screen w-full shadow-lg">
        <CardContent className=" max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <Formik
              initialValues={{
                name: "",
                url: "",
                parameter: "",
              }}
              validationSchema={Yup.object({
                name: Yup.string()
                  .required("Name is required")
                  .min(3, "Must be at least 3 characters"),
                url: Yup.string().required("URL is required"),
                parameter: Yup.string().required("Parameter is Required"),
              })}
              validateOnChange={true} // Enable validation on change
              validateOnBlur={true} // Optional: Enable validation on blur as well
              onSubmit={(values) => handleSubmit(values)}
            >
              {({ errors, setFieldValue, setFieldTouched, validateForm }) => {
                return (
                  <Form>
                    <div className="mt-2 space-y-4 p-4 md:p-5">
                      <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                          <Input
                            name="name"
                            label="Name"
                            placeholder="Department Name / API Name"
                          />
                        </div>
                        <div className="w-full xl:w-1/2">
                          <Input
                            name="parameter"
                            label="Parameter Eg. [applicationNo,cidNo,passportNo]"
                            placeholder="Eg. [applicationNo,cidNo,passportNo]"
                          />
                        </div>
                      </div>
                      <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full">
                          <Input
                            name="url"
                            label="Base URL"
                            placeholder="Write URL here...."
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="mx-2 rounded-full"
                      >
                        {isLoading ? "Submitting..." : "Add"}
                      </Button>
                      <Link href="/faq-management">
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

      <div className="mt-10">
        <DataTable
          columns={columns(handleEditG2C, handleDelete)}
          data={g2cList}
          handleAdd={handleCreateG2C}
        />
      </div>
    </DefaultLayout>
  );
};

export default G2CCreate;
