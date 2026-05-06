"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputTextArea from "@/components/Inputs/InputTextArea";
import Select from "@/components/Inputs/Select";
import MultiSelect from "@/components/Inputs/MultiSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { getFaq, updateFaq } from "@/services/FaqService";
import { getParentMastersByType } from "@/services/master/MasterService";
import { toast } from "sonner";
import { useLoading } from "@/context/LoadingContext";
import { Options } from "@/interface/Options";
import { FAQ } from "@/types/faq";
import Input from "@/components/Inputs/Input";

const FAQEditPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { setIsLoading, isLoading } = useLoading();
  const [initialValues, setInitialValues] = useState<FAQ | null>(null);
  const [category, setCategory] = useState<Options[]>([]);
  const [subCategory, setSubCategory] = useState<Options[]>([]);
  const [originalCategory, setOriginalCategory] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const faqRes = await getFaq(Number(id));
        const faqData = faqRes.data.data;
        setInitialValues({
          ...faqData,
          category_id: String(faqData.category?.id) || "",
          sub_categories: faqData.sub_categories?.map((sc: any) => sc.id) || [],
        });

        const categoryRes = await getParentMastersByType("category");
        const catData = categoryRes.data;
        setOriginalCategory(catData);

        const mainCategories = catData.filter(
          (item: any) => item.parent == null,
        );
        setCategory(
          mainCategories.map((cat: any) => ({
            value: cat.id,
            text: cat.name,
            data: cat,
          })),
        );

        const subCategories = catData.filter(
          (item: any) => item.parent && item.parent.id === faqData.category?.id,
        );
        setSubCategory(
          subCategories.map((sub: any) => ({
            value: sub.id,
            text: sub.name,
            data: sub,
          })),
        );
      } catch (error) {
        toast.error("Error loading FAQ data.");
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (values: FAQ) => {
    setIsLoading(true);
    try {
      const payload = {
        ...values,
        category_id: Number(values.category_id),
        sub_categories: values.sub_categories, // already an array of IDs
      };
      await updateFaq(Number(id), payload);
      toast.success("FAQ updated successfully");
      router.push("/faq-management");
    } catch (error) {
      toast.error("Failed to update FAQ");
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
        data: param,
      })),
    );
  };

  if (!initialValues) return <div>Loading...</div>;

  return (
    <DefaultLayout>
      <Breadcrumb parentPage="FAQ Management" pageName="Edit FAQ" />
      <Card className="min-h-screen w-full">
        <CardContent className="min-h-screen max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={Yup.object({
                question: Yup.string().required("Question is required").min(3),
                answer: Yup.string().required("Answer is required").min(3),
                category_id: Yup.string().required("Select Category"),
              })}
              onSubmit={handleSubmit}
            >
              {({ errors, setFieldValue }) => (
                <Form>
                  <div className="-mt-2 space-y-4 p-4 md:p-5">
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
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full">
                        <Input
                          name="question"
                          label="Question"
                          placeholder="Write your question here..."
                        />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full">
                        <InputTextArea
                        enableRichEditor={true}
                          name="answer"
                          label="Answer"
                          placeholder="Enter your answer"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="mx-2 rounded-full"
                    >
                      {isLoading ? "Saving..." : "Update"}
                    </Button>
                    <Link href="/faq-management">
                      <Button
                        type="button"
                        variant="destructive"
                        className="mx-2 rounded-full"
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

export default FAQEditPage;
