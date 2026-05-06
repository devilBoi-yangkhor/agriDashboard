"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Select from "@/components/Inputs/Select";
import MultiSelect from "@/components/Inputs/MultiSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  getNoticeboard,
  updateNoticeboard,
} from "@/services/NoticeboardService";
import { getParentMastersByType } from "@/services/master/MasterService";
import { toast } from "sonner";
import { useLoading } from "@/context/LoadingContext";
import { Options } from "@/interface/Options";
import { Noticeboard } from "@/types/Noticeboard";

import dynamic from 'next/dynamic';

const InputTextArea = dynamic(() => import('@/components/Inputs/InputTextArea'), {
  ssr: false,
});

const NoticeboardEditPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { setIsLoading, isLoading } = useLoading();
  const [initialValues, setInitialValues] = useState<Noticeboard | null>(null);
  const [category, setCategory] = useState<Options[]>([]);
  const [subCategory, setSubCategory] = useState<Options[]>([]);
  const [originalCategory, setOriginalCategory] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (id === undefined) {
          toast.error("Invalid noticeboard ID.");
          return;
        }
        const noticeRes = await getNoticeboard(Number(id));
        const noticeData = noticeRes.data.data;
        setInitialValues({
          ...noticeData,
          category_id: String(noticeData.category?.id) || "",
          sub_categories:
            noticeData.sub_categories?.map((sc: any) => sc.id) || [],
        });
        console.log(noticeData.category?.id, "valueers here");
        const categoryRes = await getParentMastersByType("category");
        const catData = categoryRes.data;
        setOriginalCategory(catData);

        const mainCategories = catData.filter(
          (item: any) => item.parent == null,
        );
        setCategory(
          mainCategories.map((cat: any) => ({ value: cat.id, text: cat.name })),
        );

        const subCategories = catData.filter(
          (item: any) =>
            item.parent && item.parent.id === noticeData.category?.id,
        );
        setSubCategory(
          subCategories.map((sub: any) => ({ value: sub.id, text: sub.name })),
        );
      } catch (error) {
        toast.error("Error loading noticeboard data.");
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (values: Noticeboard) => {
    setIsLoading(true);
    try {
      const payload = {
        ...values,
        category_id: Number(values.category_id),
        sub_categories: values.sub_categories,
      };

      await updateNoticeboard(Number(id), payload);
      toast.success("Noticeboard updated successfully");
      router.push("/notice-management/noticeboard");
    } catch (error) {
      toast.error("Failed to update noticeboard");
    } finally {
      setIsLoading(false);
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

  if (!initialValues) return <div>Loading...</div>;

  return (
    <DefaultLayout>
      <Breadcrumb parentPage="Notice Management" pageName="Edit Notice" />
      <Card className="min-h-screen w-full transition-all duration-300 hover:shadow-lg">
        <CardContent className="min-h-screen max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={Yup.object({
                topic: Yup.string().required("Topic is required").min(3),
                description: Yup.string()
                  .required("Description is required")
                  .min(3),
                category_id: Yup.string().required("Select Category"),
                priority: Yup.string().required("Select Priority"),
              })}
              onSubmit={handleSubmit}
            >
              {({ errors, setFieldValue }) => (
                <Form>
                  <div className="-mt-2 space-y-4 p-4 md:p-5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <InputTextArea
                          name="topic"
                          label="Topic"
                          placeholder="Write your question here..."
                        />
                      </div>
                      <div className="w-full xl:w-1/2">
                        <InputTextArea
                          name="description"
                          label="Description"
                          placeholder="Enter your answer"
                        />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <Select
                          searchable={true}
                          name="category_id"
                          label="Category"
                          options={category}
                          onValueChange={(value: string) => {
                            loadSubCategory(Number(value));
                            setFieldValue("category_id", value);
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
                          name="priority"
                          label="Priority"
                          options={[
                            { value: "LOW", text: "Low" },
                            { value: "MEDIUM", text: "Medium" },
                            { value: "HIGH", text: "High" },
                          ]}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="hover:bg-primary-700 mx-2 transform rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      {isLoading ? "Saving..." : "Update"}
                    </Button>
                    <Link href="/notice-management/noticeboard">
                      <Button
                        type="button"
                        variant="destructive"
                        className="mx-2 transform rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-lg"
                      >
                        Cancel
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

export default NoticeboardEditPage;
