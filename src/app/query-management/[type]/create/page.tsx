"use client";
import React, { useEffect, useState, use } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/Inputs/Input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Select from "@/components/Inputs/Select";
import { createQuery } from "@/services/QueryService";
import { getUsers } from "@/services/UserService";
import { getParentMastersByType } from "@/services/master/MasterService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Options } from "@/interface/Options";
import { useLoading } from "@/context/LoadingContext";
import InputTextArea from "@/components/Inputs/InputTextArea";
import DatePicker from "@/components/Inputs/DatePicker";
import MultiSelect from "@/components/Inputs/MultiSelect";
import { useSearchParams } from "next/navigation";
import { getQueriesByTypeAndNumberOrEmail } from "@/services/QueryService";
import History from "./History";
import moment from "moment";

const QueryCreatePage = ({ params }: { params: Promise<{ type: string }> }) => {
  const param = use(params);
  const [category, setCategory] = useState<Options[]>([]);
  const [subCategory, setSubCategory] = useState<Options[]>([]);
  const [originalCategory, setOriginalCategory] = useState<any[]>([]);
  const [originalStatus, setOriginalStatus] = useState<any[]>([]);
  const [status, setStatus] = useState<Options[]>([]);
  const [assigned_by_id, setAssigned_by_id] = useState<Options[]>([]);
  const [assigned_to_id, setAssigned_to_id] = useState<Options[]>([]);
  const [gender, setGender] = useState<Options[]>([]);
  const [dzongkhag, setDzongkhag] = useState<Options[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { setIsLoading, isLoading } = useLoading();
  const router = useRouter();
  const searchParams = useSearchParams();
  const number = searchParams.get("number");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [categoryRes, statusRes, genderRes, dzongkhagRes, usersRes] =
          await Promise.all([
            getParentMastersByType("category"),
            getParentMastersByType("status"),
            getParentMastersByType("gender"),
            getParentMastersByType("dzongkhag"),
            getUsers(),
            number
              ? getQueriesByTypeAndNumberOrEmail(param.type, number)
              : Promise.resolve(null),
          ]);

        setOriginalCategory(categoryRes.data);
        const categories = categoryRes.data.filter(
          (item: any) => item.parent == null,
        );
        setCategory(
          categories.map((param: { id: string; name: string }) => ({
            value: param.id,
            text: param.name,
          })),
        );

        setOriginalStatus(statusRes.data);
        const statuses = statusRes.data.filter(
          (item: any) => item.parent == null,
        );
        setStatus(
          statuses.map((param: { id: string; name: string }) => ({
            value: param.id,
            text: param.name,
          })),
        );

        setGender(
          genderRes.data.map((param: { id: string; name: string }) => ({
            value: param.id,
            text: param.name,
          })),
        );

        setDzongkhag(
          dzongkhagRes.data.map((param: { id: string; name: string }) => ({
            value: param.id,
            text: param.name,
          })),
        );

        const usersData = usersRes.data?.results || usersRes.data || [];
        const flatUsers = usersData.flat();
        const userOptions = flatUsers.map((user: any) => ({
          value: user.id?.toString(),
          text:
            [user.username, user.name].filter(Boolean).join(" ").trim() ||
            `User ${user.id}`,
        }));
        setAssigned_by_id(userOptions);
        setAssigned_to_id(userOptions);
      } catch (error: any) {
        console.error("Fetch Error:", error);
        setError(`Failed to load data: ${error.message || "Unknown error"}`);
        toast.error("Failed to fetch data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setIsLoading, param.type]);

  const loadSubCategory = (main_category_id: number) => {
    console.log("Loading subcategories for category_id:", main_category_id);
    const sub_list = originalCategory.filter(
      (list) => list.parent !== null && list.parent.id === main_category_id,
    );
    setSubCategory(
      sub_list.map((param: { id: number; name: string }) => ({
        value: param.id.toString(),
        text: param.name,
      })),
    );
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      setIsLoading(true);
      const payload = {
        ...values,
        name_id: Number(values.name_id),
        category_id: Number(values.category_id),
        status_id: Number(values.status_id),
        gender_id: Number(values.gender_id),
        dzongkhag_id: Number(values.dzongkhag_id),
        assigned_by_id: Number(values.assigned_by_id),
        assigned_to_id: Number(values.assigned_to_id),
        sub_category: values.sub_category.map(Number),
        parent_id: values.parent_id ? Number(values.parent_id) : null,
        date: new Date(values.date).toISOString(),
        // start_time: values.start_time,
        start_time: moment(values?.start_time, "h:mm:ss A").format("HH:mm:ss") || "",
        end_time: values.end_time,
      };
      const response = await createQuery(payload);
      toast.success(response.data.message || "Query created successfully.");
      localStorage.setItem("refreshQueries", Date.now().toString());
      setTimeout(() => {
        router.push(`/query-management/${param.type}`);
      }, 1000);
    } catch (error: any) {
      console.error("Error creating Query:", error.response?.data || error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create query. Please try again.",
      );
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <DefaultLayout>
        <div className="p-4">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p>{error}</p>
          <Button
            onClick={() => router.push(`/query-management/${param.type}`)}
            className="mt-4 rounded-full"
          >
            Back to List
          </Button>
        </div>
      </DefaultLayout>
    );
  }

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="p-4">Loading...</div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName={`Create ${param.type.charAt(0).toUpperCase() + param.type.slice(1)}`}
        parentPage="Query Management"
      />
      <Card className="w-full">
        <CardContent className="max-w-full overflow-x-auto">
          <div className="min-h-screen">
            <div className="grid grid-cols-1  md:grid-cols-3">
              <div className="border-r border-gray-300  md:col-span-2">
                <Formik
                  initialValues={{
                    type: param.type.toUpperCase(),
                    name: "",
                    email: "",
                    priority: "",
                    phone_number: searchParams.get("number") || "",
                    date: searchParams.get("number")
                      ? new Date().toISOString().split("T")[0]
                      : "",
                    query: "",
                    remarks: "",
                    status_id: "",
                    category_id: "",
                    sub_category: [],
                    start_time: searchParams.get("callstart") || "",
                    end_time: searchParams.get("callend") || "",
                    gender_id: "",
                    dzongkhag_id: "",
                    assigned_by_id: "",
                    assigned_to_id: "",
                    parent_id: null,
                  }}
                  validationSchema={Yup.object({
                    email:
                      param.type.toUpperCase() === "EMAIL"
                        ? Yup.string()
                            .email("Invalid email format")
                            .required("Email ID is required")
                        : Yup.string()
                            .email("Invalid email format")
                            .notRequired(),
                    phone_number:
                      param.type.toUpperCase() === "EMAIL"
                        ? Yup.string().notRequired()
                        : Yup.string().required("Phone Number is required"),
                    date: Yup.string().required("Date is required"),
                    query: Yup.string().required("Query is required"),
                    remarks: Yup.string().required("Remarks is required"),
                    status_id: Yup.string().required("Status is required"),
                    category_id: Yup.string().required("Category is required"),
                    name: Yup.string().required("Name is required"),
                    priority: Yup.string().required("Priority is required"),
                    // sub_category: Yup.array().min(
                    //   1,
                    //   "At least one sub-category is required",
                    // ),
                    // start_date: Yup.string().required("Start Date is required"),
                    gender_id: Yup.string().required("Gender is required"),
                    dzongkhag_id: Yup.string().required(
                      "Dzongkhag is required",
                    ),
                    // assigned_by_id: Yup.string().required(
                    //   "Assigned By is required",
                    // ),
                    // assigned_to_id: Yup.string().required(
                    //   "Assigned To is required",
                    // ),

                    // assigned_to_id:
                    //   type.toUpperCase() === ""
                    //     ? Yup.string().notRequired()
                    //     : Yup.string().required("Phone Number is required"),
                  })}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, setFieldValue, values, errors }) => {
                    console.log(errors);
                    return (
                      <Form>
                        <div className="-mt-2 space-y-2 p-2 md:p-5">
                          <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/2">
                              <Input
                                name="email"
                                label="Email"
                                placeholder="Enter your Email here...."
                              />
                            </div>
                            <div className="w-full xl:w-1/2">
                              <Input
                                name="phone_number"
                                label="Phone Number"
                                placeholder="Enter your phone number here...."
                                disabled={values.phone_number !== ""}
                              />
                            </div>
                          </div>
                          <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/3">
                              <DatePicker
                                name="date"
                                label="Date"
                                mode="single"
                                dateFormat="d F Y"
                                disabled={values.phone_number !== ""}
                              />
                            </div>
                            <div className="w-full xl:w-1/3">
                              <Input
                                name="start_time"
                                label="Start Time"
                                disabled={values.phone_number !== ""}
                              />
                            </div>
                            <div className="w-full xl:w-1/3">
                              <Input
                                name="end_time"
                                label="End Time"
                                disabled={values.phone_number !== ""}
                              />
                            </div>
                          </div>
                          <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/2">
                              <Input name="name" label="Name of Enquirer" />
                            </div>
                            <div className="w-full xl:w-1/2">
                              <Select
                                searchable={true}
                                label="Category"
                                name="category_id"
                                options={category}
                                onValueChange={(value: string) => {
                                  // setFieldValue("category_id", value);
                                  loadSubCategory(Number(value));
                                }}
                              />
                            </div>
                            {subCategory.length > 0 && (
                              <div className="w-full xl:w-1/2">
                                <MultiSelect
                                  label="Sub Category"
                                  name="sub_category"
                                  options={subCategory}
                                />
                              </div>
                            )}
                          </div>
                          <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/3">
                              <Select
                                searchable={false}
                                label="Priority"
                                name="priority"
                                options={[
                                  { value: "LOW", text: "Low" },
                                  { value: "MEDIUM", text: "Medium" },
                                  { value: "HIGH", text: "High" },
                                ]}
                              />
                            </div>
                            <div className="w-full xl:w-1/3">
                              <Select
                                searchable={true}
                                label="Gender"
                                name="gender_id"
                                options={gender}
                                onValueChange={(value: string) =>
                                  setFieldValue("gender_id", value)
                                }
                              />
                            </div>
                            <div className="w-full xl:w-1/3">
                              <Select
                                searchable={true}
                                label="Dzongkhag"
                                name="dzongkhag_id"
                                options={dzongkhag}
                                onValueChange={(value: string) =>
                                  setFieldValue("dzongkhag_id", value)
                                }
                              />
                            </div>
                          </div>
                          <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/2">
                              <InputTextArea
                                name="query"
                                label="Query"
                                placeholder="Your question will be here....."
                              />
                            </div>
                            <div className="w-full xl:w-1/2">
                              <InputTextArea
                                label="Remarks"
                                placeholder="Enter your Remarks here...."
                                name="remarks"
                              />
                            </div>
                          </div>

                          <div className="mb-3 flex flex-col gap-6 pb-5 xl:flex-row">
                            {/* <div className="w-full xl:w-1/3">
                          <Select
                            label="Assigned By"
                            name="assigned_by_id"
                            options={assigned_by_id}
                            onValueChange={(value: string) =>
                              setFieldValue("assigned_by_id", value)
                            }
                          />
                        </div> */}

                            <div className="w-full xl:w-1/2">
                              <Select
                                searchable={true}
                                label="Status"
                                name="status_id"
                                options={status}
                                selectedValue={values.status_id}
                                onValueChange={(value: string) => {
                                  setFieldValue("status_id", value);
                                  const selectedStatus = status.find(
                                    (s) => s.value === value,
                                  );
                                  const isCompleted =
                                    selectedStatus?.text.toLowerCase() ===
                                    "completed";
                                  setFieldValue(
                                    "end_date",
                                    isCompleted ? new Date().toISOString() : "",
                                  );
                                  const timeInThimphu = new Intl.DateTimeFormat("en-GB", {
                                      timeZone: "Asia/Thimphu",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      hour12: false
                                    }).format(new Date());
                                    setFieldValue("end_time", timeInThimphu);
                                }}
                              />
                            </div>

                            <div className="w-full xl:w-1/3">
                              <Select
                                label="Assigned To"
                                name="assigned_to_id"
                                options={assigned_to_id}
                                onValueChange={(value: string) =>
                                  setFieldValue("assigned_to_id", value)
                                }
                              />
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <Button
                              type="submit"
                              disabled={isLoading || isSubmitting}
                              className="rounded-full"
                            >
                              {isLoading || isSubmitting
                                ? "Submitting..."
                                : "Submit"}
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              className="rounded-full"
                              onClick={() =>
                                router.push(`/query-management/${param.type}`)
                              }
                            >
                              Back
                            </Button>
                          </div>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </div>

              <div className="p-4 md:col-span-1">
                <h2>Call History</h2>
                <History type={param.type} numberOrEmail={number ?? ""} />
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white pt-6  md:col-span-1"></div>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
};

export default QueryCreatePage;
