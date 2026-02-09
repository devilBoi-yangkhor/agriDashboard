"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useLoading } from "@/context/LoadingContext";

const ProfileSettings = () => {
  const { setIsLoading, isLoading } = useLoading();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock user data - replace this with your actual API call
  const mockUser = {
    id: 1,
    username: "johndoe",
    email: "john@example.com",
    mobile_number: "1234567890",
    roles: [{ name: "Admin" }, { name: "User" }],
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobile_number: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .nullable(),
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);
        // Simulate API call with timeout
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCurrentUser(mockUser);
        setError(null);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data");
        toast.error("Failed to fetch user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [setIsLoading]);

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      // Simulate API update
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentUser({ ...currentUser, ...values });
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error ? (
        <div className="flex justify-center text-red-500">{error}</div>
      ) : !currentUser ? (
        <div className="flex justify-center">
          <p>Loading user data...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold">
              {currentUser.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{currentUser.username}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentUser.roles?.map((role: any) => role.name).join(", ")}
              </p>
            </div>
          </div>

          <Formik
            initialValues={{
              username: currentUser.username || "",
              email: currentUser.email || "",
              mobile_number: currentUser.mobile_number || "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Username
                    </label>
                    <Field
                      name="username"
                      type="text"
                      className={`w-full rounded border p-2 text-sm shadow-sm ${
                        errors.username && touched.username
                          ? "border-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                    />
                    {errors.username && touched.username && (
                      <div className="mt-1 text-sm text-red-600">
                        {errors.username as string}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className={`w-full rounded border p-2 text-sm shadow-sm ${
                        errors.email && touched.email
                          ? "border-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                    />
                    {errors.email && touched.email && (
                      <div className="mt-1 text-sm text-red-600">
                        {errors.email as string}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mobile Number
                    </label>
                    <Field
                      name="mobile_number"
                      type="text"
                      className={`w-full rounded border p-2 text-sm shadow-sm ${
                        errors.mobile_number && touched.mobile_number
                          ? "border-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                    />
                    {errors.mobile_number && touched.mobile_number && (
                      <div className="mt-1 text-sm text-red-600">
                        {errors.mobile_number as string}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Roles
                    </label>
                    <div className="w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-700">
                      {currentUser.roles
                        ?.map((role: any) => role.name)
                        .join(", ")}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-lg px-6 py-2"
                  >
                    {isLoading ? "Updating..." : "Update Profile"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};

export default ProfileSettings;
