"use client";

import { Formik, Form, Field } from "formik";
import { Button } from "@/components/ui/button";
import * as Yup from "yup";
import { toast } from "react-toastify";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { FormikHelpers } from "formik";
import { createAdvertisement } from "@/services/advertisement/Advertisement";
import { AdvertisementFormValues } from "@/types/advertisement/Advertisement";
import { useState } from "react";

const AdvertisementSchema = Yup.object().shape({
  title: Yup.string().required("Title is required").max(255),
  description: Yup.string().required("Description is required"),
  contact_phone: Yup.string().required("Phone number is required").max(20),
});

export default function CreateAdvertisementPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null); // Keep track of the actual file

  const handleSubmit = async (
    values: AdvertisementFormValues,
    { setSubmitting, resetForm }: FormikHelpers<AdvertisementFormValues>,
  ) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("contact_phone", values.contact_phone);
      
      // Add the file if it exists
      if (file) {
        formData.append("photo", file); // Use the actual file object
      }
      
      // Debug: Log what's being sent
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await createAdvertisement(formData);

      toast.success("Advertisement created successfully!");
      resetForm();
      setPreview(null);
      setFile(null); // Clear the file state too
    } catch (error) {
      console.error("Error creating advertisement:", error);
      toast.error("Failed to create advertisement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto px-6 pb-10">
        <Breadcrumb pageName="Create Advertisement" />
        <div className="mb-8 mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-gray-700 hover:text-gray-900"
          ></button>
        </div>

        <p className="mb-1 text-sm text-gray-500">
          Fill in the details below. All fields marked with * are required.
        </p>

        <div className="rounded-2xl bg-white p-8 shadow-md">
          <Formik<AdvertisementFormValues>
            initialValues={{
              title: "",
              description: "",
              contact_phone: "",
              photo: null,
            }}
            validationSchema={AdvertisementSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, errors, touched, isSubmitting, values }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="font-medium">Advertisement Title *</label>
                    <Field
                      name="title"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-green-500"
                      placeholder="Enter advertisement title"
                    />
                    {errors.title && touched.title && (
                      <p className="text-sm text-red-500">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-medium">Contact Phone *</label>
                    <Field
                      name="contact_phone"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-green-500"
                      placeholder="Enter phone number"
                    />
                    {errors.contact_phone && touched.contact_phone && (
                      <p className="text-sm text-red-500">
                        {errors.contact_phone}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="font-medium">Description *</label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={5}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-green-500"
                    placeholder="Write your advertisement description here..."
                  />
                  {errors.description && touched.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                {/* IMAGE UPLOAD + PREVIEW */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* UPLOAD BOX */}
                  <div>
                    <label className="font-medium">Advertisement Photo</label>

                    <div className="mt-2 rounded-xl border-2 border-dashed border-gray-300 p-6 text-center">
                      <label className="flex cursor-pointer flex-col items-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                          <span className="text-3xl">+</span>
                        </div>
                        <p className="mt-3 font-medium">
                          Click to upload image
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          JPG, PNG — recommended 1200 × 800
                        </p>

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const selectedFile = e.target.files?.[0] || null;
                            setFieldValue("photo", selectedFile);
                            setFile(selectedFile); // Store the actual file

                            if (selectedFile) {
                              setPreview(URL.createObjectURL(selectedFile));
                            } else {
                              setPreview(null);
                            }
                          }}
                        />
                      </label>
                      {file && (
                        <p className="mt-2 text-sm text-green-600">
                          Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* PREVIEW BOX */}
                  <div>
                    <label className="font-medium">Preview</label>

                    <div className="mt-2 flex h-40 items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
                      {preview ? (
                        <img
                          src={preview}
                          className="h-full w-auto rounded-xl object-contain"
                          alt="Preview"
                        />
                      ) : (
                        <p className="text-gray-400">No image selected</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <Button
                  type="submit"
                  className="rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Create Advertisement"}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </DefaultLayout>
  );
}