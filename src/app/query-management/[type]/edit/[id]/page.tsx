"use client";
import React, { useEffect, useState, useMemo } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/Inputs/Input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Select from "@/components/Inputs/Select";
import { getQueryById, updateQuery } from "@/services/QueryService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DatePicker from "@/components/Inputs/DatePicker";
import InputTextArea from "@/components/Inputs/InputTextArea";
import MultiSelect from "@/components/Inputs/MultiSelect";
import { Options } from "@/interface/Options";
import { useLoading } from "@/context/LoadingContext";
import { getUsers } from "@/services/UserService";
import { getParentMastersByType } from "@/services/master/MasterService";
import moment from "moment";

const QueryUpdatePage = ({
  params,
}: {
  params: Promise<{ type: string; id: number }>;
}) => {
  const [editQuery, setEditQuery] = useState<any>({});
  const param = React.use(params);
  const router = useRouter();
  const [category, setCategory] = useState<Options[]>([]);
  const [originalCategory, setOriginalCategory] = useState<any[]>([]);
  const [originalStatus, setOriginalStatus] = useState<any[]>([]);
  const [status, setStatus] = useState<Options[]>([]);
  const [assigned_by_id, setAssigned_by_id] = useState<Options[]>([]);
  const [assigned_to_id, setAssigned_to_id] = useState<Options[]>([]);
  const [gender, setGender] = useState<Options[]>([]);
  const [dzongkhag, setDzongkhag] = useState<Options[]>([]);
  const { setIsLoading } = useLoading();
  const [subCategory, setSubCategory] = useState<Options[]>([]);

  const now = moment().utcOffset(6 * 60);

  useEffect(() => {

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [categoryRes, statusRes, genderRes, dzongkhagRes, usersRes, queryRes] =
          await Promise.all([
            getParentMastersByType("category"),
            getParentMastersByType("status"),
            getParentMastersByType("gender"),
            getParentMastersByType("dzongkhag"),
            getUsers(),
            getQueryById(param.id)
          ]);

        setOriginalCategory(categoryRes.data);
        const categories = categoryRes.data.filter(
          (item: any) => item.parent == null,
        );
        setCategory(
          categories.map((param: { id: string; name: string }) => ({
            value: String(param.id),
            text: param.name,
          })),
        );

        setOriginalStatus(statusRes.data);
        const statuses = statusRes.data.filter(
          (item: any) => item.parent == null,
        );
        setStatus(
          statuses.map((param: { id: string; name: string }) => ({
            value: String(param.id),
            text: param.name,
          })),
        );

        setGender(
          genderRes.data.map((param: { id: string; name: string }) => ({
            value: String(param.id),
            text: param.name,
          })),
        );

        setDzongkhag(
          dzongkhagRes.data.map((param: { id: string; name: string }) => ({
            value: String(param.id),
            text: param.name,
          })),
        );

        const usersData = usersRes.data?.results || usersRes.data || [];
        const flatUsers = usersData.flat();
        const userOptions = flatUsers.map((user: any) => ({
          value: String(user.id),
          text:
            [user.username, user.name].filter(Boolean).join(" ").trim() ||
            `User ${user.id}`,
        }));
        setAssigned_by_id(userOptions);
        setAssigned_to_id(userOptions);
        const { data } = queryRes.data;
        // console.log(moment(data?.start_time, "h:mm:ss A").format("HH:mm:ss"))
        setEditQuery({
              ...data,
              start_time: moment(data?.start_time, "h:mm:ss A").format("HH:mm:ss") || "",
              status_id: String(data?.status?.id || ""),
              category_id: String(data?.category?.id || ""),
              gender_id: String(data?.gender?.id || ""),
              dzongkhag_id: String(data?.dzongkhag?.id || ""),
              assigned_by_id: String(data?.assigned_by.id || ""),
              assigned_to_id: data?.assigned_to.id || 0,
            });
      } catch (error: any) {
        console.error("Fetch Error:", error);
        toast.error("Failed to fetch data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setIsLoading, param.id]);

  const subCategoryOptions = useMemo(() => {
  if (!editQuery?.category_id) return [];
  
  const sub_list = originalCategory.filter(
    (list) => list.parent !== null && list.parent.id === Number(editQuery.category_id),
  );
  console.log(sub_list)
  setSubCategory(sub_list.map((param: { id: number; name: string }) => ({
    value: String(param.id),
    text: param.name,
  })))

  return sub_list.map((param: { id: number; name: string }) => ({
    value: String(param.id),
    text: param.name,
  }));
}, [editQuery?.category_id, originalCategory]);



  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const formatDate = (dateStr: string) => {
        console.log(dateStr)
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toISOString().slice(0, 19) + d.toISOString().slice(19); // Ensures YYYY-MM-DDTHH:mm:ssZ
      };

      const payload = {
        ...values,
        date: formatDate(values.date),
        start_date: formatDate(values.date),
        end_date: formatDate(values.end_date),
        start_time: param.type.toUpperCase() === "CALL" ? values.start_time : "00:00",
        end_time: param.type.toUpperCase() === "CALL" ? values.end_time : "00:00",
      };
      const response = await updateQuery(editQuery.id, payload);
      toast.success(response.data.message);
      localStorage.removeItem("editQuery");
      setTimeout(() => {
        router.push(`/query-management/${param.type}`);
      }, 1000);
    } catch (error: any) {
      console.log(error)
      toast.error(
        error.response?.data?.message ||
        "Failed to update Query. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }

  };

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName={`Edit ${param.type.charAt(0).toUpperCase() + param.type.slice(1)}`}
        parentPage="Query Management"
      />
      <Card className="w-full">
        <CardContent className="max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <Formik
              initialValues={{
                type: param.type.toUpperCase,
                email: editQuery?.email || "",
                name: editQuery?.name || "",
                priority: editQuery?.priority || "",
                phone_number: editQuery?.phone_number || "",
                start_time: editQuery?.start_time || "",
                end_time: editQuery?.end_time || "",
                date: moment(editQuery?.date).format("Y-MM-DD") || "",
                query: editQuery?.query || "",
                remarks: editQuery?.remarks || "",
                status_id: String(editQuery?.status?.id) || "",
                category_id: editQuery?.category_id || "",
                sub_category: editQuery?.sub_category || [],
                // start_date: editQuery?.start_date || "",
                end_date: editQuery?.end_date || now.format('YYYY-MM-DDTHH:mm:ssZ'),
                gender_id: editQuery?.gender_id || "",
                dzongkhag_id: editQuery?.dzongkhag_id || "",
                assigned_by_id: editQuery?.assigned_by_id || "",
                assigned_to_id: editQuery?.assigned_to_id || 0,
              }}
              enableReinitialize
              validationSchema={Yup.object({
                email:
                  param.type.toUpperCase() === "EMAIL"
                    ? Yup.string()
                      .email("Invalid email format")
                      .required("Email ID is required")
                    : Yup.string().email("Invalid email format").notRequired(),
                phone_number:
                  param.type.toUpperCase() === "EMAIL"
                    ? Yup.string().notRequired()
                    : Yup.string().required("Phone Number is required"),
                date: Yup.string().required("Date is required"),
                name: Yup.string().required("Name is required"),
                query: Yup.string().required("Query is required"),
                remarks: Yup.string().required("Remarks is required"),
                status_id: Yup.string().required("Status is required"),
                category_id: Yup.string().required("Category is required"),
                priority: Yup.string().required("Priority is required"),
                gender_id: Yup.string().required("Gender is required"),
                dzongkhag_id: Yup.string().required("Dzongkhag is required"),
                assigned_by_id: Yup.string().required(
                  "Assigned By is required",
                ),
              })}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue, values }) => { 
            //     const subCategoryOptions = useMemo(() => {
            //   if (!values.category_id) return [];
              
            //   const sub_list = originalCategory.filter(
            //     (list) => list.parent !== null && list.parent.id === Number(values.category_id),
            //   );
              
            //   return sub_list.map((param: { id: number; name: string }) => ({
            //     value: String(param.id),
            //     text: param.name,
            //   }));
            // }, [values.category_id, originalCategory]);
                return(
                <Form>
                  <div className="-mt-2 space-y-4 p-4 md:p-5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <Input
                          name="email"
                          label="Email"
                          placeholder="Enter your Email here...."
                          // disabled={values.email !== ""}
                        />
                      </div>
                      <div className="w-full xl:w-1/2">
                        <Input
                          name="phone_number"
                          label="Phone Number"
                          placeholder="Enter your phone number here...."
                          // disabled={values.phone_number !== ""}
                        />
                      </div>
                      <div className="w-full xl:w-1/2">
                        <DatePicker
                          name="date"
                          label="Date"
                          mode="single"
                          // disabled={values.date !== ""}9:00
                        />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <Input
                          name="name"
                          label="Name"
                          placeholder="Enter name here...."
                          // disabled={values.name !== ""}
                        />
                      </div>
                      {param.type.toUpperCase() === "CALL" && (
                        <div className="w-full xl:w-1/2">
                          <Input
                            name="start_time"
                            label="Start Time"
                            disabled={values.start_time !== ""}
                          />
                        </div>
                      )}

                      {param.type.toUpperCase() === "CALL" && (
                        <div className="w-full xl:w-1/2">
                          <Input
                          name="end_time"
                          label="End Time"
                          disabled={values.end_time !== ""}
                        />
                        </div>
                      )}
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full">
                        <InputTextArea
                          name="query"
                          label="Query"
                          placeholder="Your question will be here....."
                        />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full">
                        <InputTextArea
                          label="Description"
                          placeholder="Enter your Remarks here...."
                          name="remarks"
                          className="cursor-not-allowed bg-gray-100 opacity-75" // optional styling
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/3">
                        <Select
                          searchable={true}
                          label="Category"
                          name="category_id"
                          placeholder="Select a category"
                          options={category}
                          selectedValue={values.category_id}
                        //  onValueChange={(value: string) => {
                        //           setFieldValue("category_id", value);
                        //           subCategoryOptions();
                        //         }}
                        />
                      </div>
                      {/* <div className="w-full xl:w-1/3">
                        <MultiSelect
                          label="Sub Category"
                          name="sub_category"
                          options={subCategory}
                          defaultValue={values.sub_category}
                        />
                      </div> */}
                      <div className="w-full xl:w-1/3">
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
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/3">
                        <Select
                          label="Assigned By"
                          name="assigned_by_id"
                          options={assigned_by_id}
                          selectedValue={values.assigned_by_id}
                          onValueChange={(value: string) =>
                            setFieldValue("assigned_by_id", value)
                          }
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
                    <div className="mb-2 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/3">
                      <Select
                          searchable={true}
                          label="Priority"
                          name="priority"
                          placeholder="Select Priority"
                          selectedValue={values.priority}
                          options={[{
                            value: 'LOW',
                            text: 'Low'
                          },{
                            value: 'MEDIUM',
                            text: 'Medium'
                          }, {
                            value: 'HIGH',
                            text: 'High'
                          }]}
                          onValueChange={(value: string) =>
                            setFieldValue("priority", value)
                          }
                        />
                      </div>
                      
                      <div className="w-full xl:w-1/3">
                        <DatePicker
                          name="end_date"
                          label="End Time"
                          mode="single"
                          dateFormat="d F Y"
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
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="mx-2 rounded-full"
                    >
                      {isSubmitting ? "Updating..." : "Update"}
                    </Button>
                  </div>
                </Form>
              )}}
            </Formik>
          </div>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
};

export default QueryUpdatePage;
