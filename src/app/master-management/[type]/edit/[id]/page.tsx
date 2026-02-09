"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/Inputs/Input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SelectDropDown from "@/components/Inputs/Select";
import {
  getParentMastersByType,
  updateMaster,
} from "@/services/master/MasterService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const MasterUpdatePage = ({
  params,
}: {
  params: Promise<{ type: string }>;
}) => {
  const param = React.use(params);
  const router = useRouter();

  const [editMaster, setEditMaster] = useState<any>(null);

  const [dzongkhags, setDzongkhags] = useState<any[]>([]);
  const [gewogs, setGewogs] = useState<any[]>([]);
  const [filteredGewogs, setFilteredGewogs] = useState<any[]>([]);
  const [parentCategories, setParentCategories] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const saved = localStorage.getItem("editMaster");
      if (saved) setEditMaster(JSON.parse(saved));

      if (param.type === "gewog" || param.type === "chiwog") {
        const dz = await getParentMastersByType("dzongkhag");
        setDzongkhags(dz.data.map((d: any) => ({ value: d.id, text: d.name })));
      }

      if (param.type === "village" || param.type === "chiwog") {
        const gw = await getParentMastersByType("gewog");
        const gws = gw.data.map((g: any) => ({
          value: g.id,
          text: g.name,
          parent_id: g.parent_id,
        }));

        setGewogs(gws);
      }

      if (param.type === "category") {
        const res = await getParentMastersByType("category");
        setParentCategories(
          res.data.map((c: any) => ({ value: c.id, text: c.name })),
        );
      }
    };

    loadData();
  }, [param.type]);

  useEffect(() => {
    if (param.type === "chiwog" && editMaster?.parent_id && gewogs.length > 0) {
      const dzongkhagId = editMaster.parent_id;
      const filtered = gewogs.filter((g) => g.parent_id === dzongkhagId);
      setFilteredGewogs(filtered);
    }
  }, [editMaster, gewogs]);

  const filterGewogs = (dzongkhagId: number) => {
    const result = gewogs.filter((g) => g.parent_id === dzongkhagId);
    setFilteredGewogs(result);
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const res = await updateMaster(editMaster.id, values);
      toast.success(res.data.message);
      localStorage.removeItem("editMaster");
      router.push(`/master-management/${param.type}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
  type: param.type,
  name: editMaster?.name ?? "",
  code: "CODE",

  // Normalize to string values for selects
  is_active: editMaster?.is_active === true ? "true" : "false",

  parent_id: editMaster?.parent_id ? String(editMaster.parent_id) : "",
  gewog_id: editMaster?.gewog_id ? String(editMaster.gewog_id) : "",
};


  return (
    <DefaultLayout>
      <Breadcrumb
        pageName={`Edit ${param.type.charAt(0).toUpperCase() + param.type.slice(1)}`}
        parentPage="Master Management"
      />

      <Card className="w-full">
        <CardContent className="max-w-full overflow-x-auto">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={Yup.object({
              name: Yup.string().required("Name is required"),
            })}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form>
                <div className="space-y-4 p-4 md:p-5">
                  <div className="flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/3">
                      <Input
                        label="Name"
                        name="name"
                        placeholder="Enter name"
                      />
                    </div>

                    {param.type === "category" && (
                      <div className="w-full xl:w-1/3">
                        <SelectDropDown
                          label="Select Parent Category"
                          name="parent_id"
                          options={parentCategories}
                        />
                      </div>
                    )}

                    {param.type === "gewog" && (
                      <div className="w-full xl:w-1/3">
                        <SelectDropDown
                          label="Select Dzongkhag"
                          name="parent_id"
                          options={dzongkhags}
                        />
                      </div>
                    )}

                    {param.type === "village" && (
                      <div className="w-full xl:w-1/3">
                        <SelectDropDown
                          label="Select Gewog"
                          name="parent_id"
                          options={gewogs}
                        />
                      </div>
                    )}

                    {param.type === "chiwog" && (
                      <>
                        <div className="w-full xl:w-1/3">
                          <SelectDropDown
                            label="Select Dzongkhag"
                            name="parent_id"
                            options={dzongkhags}
                            onValueChange={(value: any) => {
                              const dzId = Number(value);
                              setFieldValue("parent_id", dzId);

                              filterGewogs(dzId);
                              setFieldValue("gewog_id", null);
                            }}
                          />
                        </div>

                        <div className="w-full xl:w-1/3">
                          <SelectDropDown
                            label="Select Gewog"
                            name="gewog_id"
                            options={
                              filteredGewogs.length > 0
                                ? filteredGewogs
                                : gewogs
                            }
                          />
                        </div>
                      </>
                    )}

                    <div className="w-full xl:w-1/3">
                      <SelectDropDown
                        label="Select Status"
                        name="is_active"
                        options={[
                          { value: true, text: "Active" },
                          { value: false, text: "Inactive" },
                        ]}
                      />
                    </div>
                  </div>

                  {/* <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update"}
                  </Button> */}
                  <Button
                    type="submit"
                    className="rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
};

export default MasterUpdatePage;
