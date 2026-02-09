"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/Inputs/Input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Select from "@/components/Inputs/Select";
import {
  getParentMastersByType,
  createMaster,
} from "@/services/master/MasterService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const MasterCreatePage = ({
  params,
}: {
  params: Promise<{ type: string }>;
}) => {
  const [parent, setParent] = useState<any>(null);
  const [type, setType] = useState<string>("");
  const param = React.use(params);
  const router = useRouter();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      await createMaster(values)
        .then((response) => {
          toast.success(response.data.message);
          setTimeout(() => {
            router.push(`/master-management/${param.type}`);
          }, 1000);
        })
        .finally(() => setSubmitting(false))
        .catch((error) => {
          console.error("Error creating master:", error);
          // toast.error("Failed to create master. Please try again.");
        });
    } catch (error) {
      console.error("Error creating master:", error);
      setSubmitting(false);
      // Optionally, show an error message
    }
  };

  // useEffect(() => {
  //   const fetchParentData = async () => {
  //     try {
  //       console.log()
  //       var paramType = "";
  //       if(param.type === "village"){
  //         paramType = "gewog";
  //       }else{
  //         paramType = 'category'
  //       }
  //       await getParentMastersByType(paramType).then((response) => {
  //         const res = response.data;
  //         setParent(
  //           res.map((item: any) => ({
  //             value: item.id,
  //             text: item.name,
  //           })),
  //         );
  //       });
  //     } catch (error) {
  //       console.error("Error fetching parent data:", error);
  //     }
  //     try {
  //       var paramType = "";
  //       if(param.type === "gewog"){
  //         paramType = 'dzongkhag';
  //       }else{
  //         paramType = 'category'
  //       }
  //       await getParentMastersByType(paramType).then((response) => {
  //         const res = response.data;
  //         setParent(
  //           res.map((item: any) => ({
  //             value: item.id,
  //             text: item.name,
  //           })),
  //         );
  //       });
  //     } catch (error) {
  //       console.error("Error fetching parent data:", error);
  //     }
  //   };

  //   fetchParentData();
  // }, [param.type]);
  useEffect(() => {
    const fetchParentData = async () => {
      try {
        console.log("Current type:", param.type);

        let parentType = "";

        if (param.type === "village") {
          parentType = "gewog";
        } else if (param.type === "gewog") {
          parentType = "dzongkhag";
        } else if (param.type === "category") {
          parentType = "category";
        } else {
          console.log(param.type);
          setParent([]);
          return;
        }

        console.log("Fetching parent data for:", parentType);

        const response = await getParentMastersByType(parentType);
        const res = response.data;

        console.log("API Response:", res);

        const parentOptions = res.map((item: any) => ({
          value: item.id,
          text: item.name,
        }));

        setParent(parentOptions);
        console.log("Parent options set:", parentOptions);
      } catch (error) {
        console.error("Error fetching parent data:", error);
        setParent([]);
      }
    };

    fetchParentData();
  }, [param.type]);
  return (
    <DefaultLayout>
      <Breadcrumb
        pageName={`Create ${param.type.charAt(0).toUpperCase() + param.type.slice(1)}`}
        parentPage="Master Management"
      />
      <Card className="w-full">
        <CardContent className="max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <Formik
              initialValues={{
                type: param.type,
                name: "",
                description: "",
                code: "CODE",
                // is_active: "",
                parent_id: null,
              }}
              validationSchema={Yup.object({
                name: Yup.string().required("Role name is required"),
              })}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="-mt-2 space-y-4 p-4 md:p-5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <Input
                          label="Name"
                          type="text"
                          placeholder="Enter Name"
                          name="name"
                        />
                      </div>
                      {/* <div className="w-full xl:w-1/2">
                        <Input
                          label="Description"
                          type="text"
                          placeholder="Enter Description"
                          name="description"
                        />
                      </div> */}
                      {(param.type === "village" ||
                        param.type === "gewog" ||
                        param.type === "category") && (
                        <div className="w-full xl:w-1/2">
                          <Select
                            searchable={true}
                            label={
                              param.type === "village"
                                ? "Gewog"
                                : param.type === "gewog"
                                  ? "Dzongkhag"
                                  : "Category"
                            }
                            name="parent_id"
                            options={parent || []}
                            placeholder={
                              param.type === "village"
                                ? "Select Gewog"
                                : param.type === "gewog"
                                  ? "Select Dzongkhag"
                                  : "Select Category"
                            }
                          />
                        </div>
                      )}
                      <div className="w-full xl:w-1/2">
                        <Select
                          label="Select Satus"
                          name="is_active"
                          options={[
                            { value: true, text: "Active" },
                            { value: false, text: "Inactive" },
                          ]}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="mx-2 rounded-full bg-red-700"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                    {/* <Link href="/user-management/roles">
                                            <Button type="reset" variant="destructive" className='rounded-full mx-2'>Back</Button>
                                        </Link> */}
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

export default MasterCreatePage;
