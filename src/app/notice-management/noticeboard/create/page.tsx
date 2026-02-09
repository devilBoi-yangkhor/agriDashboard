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
import { createNoticeboard } from "@/services/NoticeboardService";
import { Noticeboard } from "@/types/Noticeboard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { Options } from "@/interface/Options";
import { getParentMastersByType } from "@/services/master/MasterService";
import Select from "@/components/Inputs/Select";
import MultiSelect from "@/components/Inputs/MultiSelect";

import dynamic from 'next/dynamic';

const InputTextArea = dynamic(() => import('@/components/Inputs/InputTextArea'), {
  ssr: false,
});

const NoticeboardsCreate = () => {
  const [category, setCategory] = useState<Options[]>([]);
  const [subCategory, setSubCategory] = useState<Options[]>([]);
  const [originalCategory, setOriginalCategory] = useState<any[]>([]);
  const { setIsLoading, isLoading } = useLoading();
  const router = useRouter();

  const handleSubmit = async (values: Noticeboard) => {
    setIsLoading(true);
    try {
      await createNoticeboard({
        ...values,
        category_id: Number(values.category_id),
      })
        .then((response) => {
          toast.success(response.data.message, {
            duration: 1500,
            position: "top-right",
          });
          setTimeout(() => {
            router.push("/notice-management/noticeboard");
          }, 2000);
        })
        .catch((e) => {
          toast.error("Error while creating Notice.");
        })
        .finally(() => setIsLoading(false));
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  const loadSubCategory = (main_category_id: number) => {
    const sub_list = originalCategory.filter(
      (list) => list.parent !== null && list.parent.id === main_category_id,
    );
    setSubCategory(
      sub_list.map((param: { id: number; name: string }) => ({
        value: param.id,
        text: param.name,
      })),
    );
  };

  useEffect(() => {
    const fetchCategories = async () => {
      await getParentMastersByType("category").then((res) => {
        const { data } = res;
        setOriginalCategory(data);
        const categories = data.filter((item) => item.parent == null);
        const paramOptions = categories?.map(
          (param: { id: string; name: string }) => ({
            value: param.id,
            text: param.name,
          }),
        );
        setCategory(paramOptions);
      });
    };
    fetchCategories();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb parentPage="Notice Management" pageName="Create Notice" />
      <Card className="min-h-screen w-full transition-all duration-300 hover:shadow-lg">
        <CardContent className="min-h-screen max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <Formik
              initialValues={{
                topic: "",
                description: "",
                category_id: "",
                sub_categories: [],
                priority: "",
                is_active: true,
              }}
              validationSchema={Yup.object({
                topic: Yup.string()
                  .required("Question is required")
                  .min(3, "Must be at least 3 characters"),
                description: Yup.string()
                  .required("Answer is required")
                  .min(3, "Must be at least 3 characters"),
                category_id: Yup.string().required("Select Category"),
                priority: Yup.string().required("Select Priority"),
              })}
              validateOnChange={true}
              validateOnBlur={true}
              onSubmit={(values) => handleSubmit(values)}
            >
              {({ errors, setFieldValue, setFieldTouched, validateForm }) => {
                return (
                  <Form>
                    <div className="-mt-2 space-y-4 p-4 md:p-5">
                      <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                          <InputTextArea
                            name="topic"
                            label="Topic"
                            placeholder="Write your question here....."
                          />
                        </div>
                        <div className="w-full xl:w-1/2">
                          <InputTextArea
                            label="Description"
                            placeholder="Enter your answer"
                            name="description"
                          />
                        </div>
                      </div>
                      <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                          <Select
                            searchable={true}
                            label="Category"
                            name="category_id"
                            options={category}
                            onValueChange={(value: string) => {
                              loadSubCategory(Number(value));
                            }}
                          />
                        </div>
                        {subCategory.length > 0 && (
                          <div className="w-full xl:w-1/2">
                            <MultiSelect
                              label="Sub Category"
                              name="sub_categories"
                              options={subCategory}
                            />
                          </div>
                        )}
                        <div className="w-full xl:w-1/2">
                          <Select
                            label="Priority"
                            name="priority"
                            options={[
                              { value: "LOW", text: "Low" },
                              { value: "MEDIUM", text: "Medium" },
                              { value: "HIGH", text: "High" },
                            ]}
                            onValueChange={(value: string) => {}}
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="hover:bg-primary-700 mx-2 transform rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        {isLoading ? "Submitting..." : "Submit"}
                      </Button>
                      <Link href="/notice-management/noticeboard">
                        <Button
                          type="reset"
                          variant={`destructive`}
                          className="mx-2 transform rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-lg"
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

export default NoticeboardsCreate;
