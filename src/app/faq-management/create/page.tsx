"use client";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
// import InputTextArea from "@/components/Inputs/InputTextArea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { Options } from "@/interface/Options";
import { getParentMastersByType } from "@/services/master/MasterService";
import Select from "@/components/Inputs/Select";
import MultiSelect from "@/components/Inputs/MultiSelect";
import Input from "@/components/Inputs/Input";
import { createFaq } from "@/services/FaqService";
import { FAQ } from "@/types/faq";
import dynamic from 'next/dynamic';

const InputTextArea = dynamic(() => import('@/components/Inputs/InputTextArea'), {
  ssr: false,
});

const FaqCreate = () => {
  const [category, setCategory] = useState<Options[]>([]);
  const [subCategory, setSubCategory] = useState<Options[]>([]);
  const [originalCategory, setOriginalCategory] = useState<any[]>([]);
  const { setIsLoading, isLoading } = useLoading();
  const router = useRouter();

  const handleSubmit = async (values: FAQ) => {
    setIsLoading(true);
    try { 
      await createFaq({
        ...values,
        category_id: Number(values.category_id),
      })
        .then((response) => {
          toast.success(response.data.message, {
            duration: 1500,
            position: "top-right",
          });
          setTimeout(() => {
            router.push("/faq-management");
          }, 2000);
        })
        .catch((e) => {
          toast.error("Error while creating FAQ.");
        })
        .finally(() => setIsLoading(false));
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  const priorityStyles = {
    LOW: { color: "green" },
    MEDIUM: { color: "goldenrod" },
    HIGH: { color: "red" },
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
            data: param,
          }),
        );
        setCategory(paramOptions);
      });
    };
    fetchCategories();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb parentPage="FAQ Management" pageName="Create FAQ" />
      <Card className="min-h-screen w-full">
        <CardContent className="min-h-screen max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <Formik
              initialValues={{
                question: "",
                answer: "",
                category_id: "",
                sub_categories: [],
                priority: "",
                is_active: true,
              }}
              validationSchema={Yup.object({
                question: Yup.string()
                  .required("Question is required")
                  .min(3, "Must be at least 3 characters"),
                answer: Yup.string()
                  .required("Answer is required")
                  .min(3, "Must be at least 3 characters"),
                category_id: Yup.string().required("Select Category"),
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

                              // onValueChange={(value: string) => {}}
                            />
                          </div>
                        )}
                      </div>
                      <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full ">
                          <Input
                            name="question"
                            label="Question"
                            placeholder="Write your question here....."
                          />
                        </div>
                      </div>
                      <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full ">
                         
                          <InputTextArea
                            label="Answer"
                            placeholder="Enter your answer"
                            name="answer"
                            enableRichEditor={true}
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
    </DefaultLayout>
  );
};

export default FaqCreate;
