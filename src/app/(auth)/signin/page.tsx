"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/Inputs/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import api from "@/lib/axios";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const router = useRouter();

  const handleLogin = async (values: { email_or_username: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/`, 
        values
      );
      
      const data = response.data;
      toast.success(data.message, {
        position: "top-right",
        autoClose: 1500,
      });

      const token = data.data.access;
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 1}; samesite=Lax;`;
      localStorage.setItem("crm_token", token);
      localStorage.setItem("userDetails", JSON.stringify(data.data.user));
      
      // Show spinner and disable form
      setShowSpinner(true);
      
      // Navigate after delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
      
    } catch (error: any) {
      console.error("Error:", error);
      
      // Revert changes on error
      setIsLoading(false);
      setShowSpinner(false);
      
      // Show error message
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      
    } finally {
      // Note: We don't set isLoading to false on success because we want to keep the spinner
      // It will be handled by the navigation or error case
    }
  };

  const togglePasswordVisibility = () => {
    if (!showSpinner) { // Only allow toggling if not in spinner state
      setShowPassword(!showPassword);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#E7FFEA] p-4">
      {/* Full-screen Spinner Overlay */}
      {showSpinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
            <p className="mt-4 text-lg font-semibold text-white">
              Logging you in...
            </p>
            <p className="mt-2 text-sm text-gray-200">
              Redirecting to dashboard
            </p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Logo Header */}
        <div className="flex justify-center bg-white p-6">
          <div className="rounded-lg p-2">
            <Image
              width={80}
              height={80}
              src={"/images/logo/logo.png"}
              alt="Logo"
              className="object-contain"
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="relative px-8 pb-8">
          {/* Form Spinner Overlay - only show when login is successful but before navigation */}
          {showSpinner && (
            <div className="absolute inset-0 z-40 flex items-center justify-center rounded-xl bg-white bg-opacity-90">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#2E7D32] border-t-transparent"></div>
                <p className="mt-3 text-sm font-medium text-gray-700">
                  Preparing your dashboard...
                </p>
              </div>
            </div>
          )}

          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Welcome Back
          </h2>

          <ToastContainer />
          <Formik
            initialValues={{
              email_or_username: "",
              password: "",
            }}
            validationSchema={Yup.object({
              email_or_username: Yup.string()
                .email("Enter valid email address.")
                .required("Email is required"),
              password: Yup.string().required("Password is required"),
            })}
            onSubmit={(values) => 
              handleLogin({ 
                email_or_username: values.email_or_username, 
                password: values.password 
              })
            }
          >
            {({ isValid, dirty }) => (
              <Form>
                <div className="space-y-4">
                  <div>
                    <Input
                      label="Email"
                      type="string"
                      name="email_or_username"
                      placeholder="Enter Email address"
                      autoComplete="off"
                      className="h-12 w-full rounded-lg border border-gray-300 px-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={showSpinner} // Disable input during spinner
                    />
                  </div>
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter Password"
                      autoComplete="off"
                      className="h-12 w-full rounded-lg border border-gray-300 px-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={showSpinner} // Disable input during spinner
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      disabled={showSpinner} // Disable button during spinner
                      className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    type="submit"
                    disabled={isLoading || showSpinner || !isValid || !dirty}
                    className="h-12 w-full rounded-lg bg-[#2E7D32] font-medium text-white shadow-md transition-all duration-300 hover:bg-[#19681D] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Authenticating...
                      </>
                    ) : showSpinner ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Login Successful!
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="mt-4 text-right">
            <Link
              href="/forgot-password"
              className={`text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800 ${
                showSpinner ? "pointer-events-none opacity-50" : ""
              }`}
              onClick={(e) => showSpinner && e.preventDefault()} // Prevent navigation during spinner
            >
              Forgot Password?
            </Link>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Esanam. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}