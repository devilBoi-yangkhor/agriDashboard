"use client"
import React, { useEffect, useState } from "react";
import Input from "@/components/Inputs/Input";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import logo from "/public/images/logo/logo.png";
import api from "@/lib/axios";
import { Eye, EyeOff, ArrowLeft, MailCheck } from "lucide-react";

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPassword = () => {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleForgotPassword = async (values: ForgotPasswordFormValues, { setSubmitting }: any) => {
    try {
      const response = await api.post("auth/reset-password/request/", {
        email: values.email
      });

      if (response.data) {
        toast.success(response.data.message);
        setIsSubmitted(true);
        setCountdown(60); // Start 60-second countdown
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 
        error.message || 
        "Failed to send mail. Please try again."
      );
      console.error("Forgot password error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // Countdown timer for resend OTP
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl overflow-hidden border-0">
        <div className="bg-gray-500 p-6 text-center">
          <div className="flex justify-center mb-2">
            <Image
              src={logo}
              alt="GovTech Logo"
              width={120}
              height={80}
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Password Reset</h1>
          <p className="text-blue-100 mt-2">
            {isSubmitted 
              ? "Check your email for instructions" 
              : "Enter your email to reset your password"
            }
          </p>
        </div>
        
        <div className="p-6 bg-white">
          <ToastContainer position="top-right" autoClose={5000} />
          
          {!isSubmitted ? (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .email("Please enter a valid email address")
                  .required("Email is required")
              })}
              onSubmit={handleForgotPassword}
            >
              {({ isSubmitting, values }) => (
                <Form className="space-y-5">
                  <div>
                    <Input
                      type="email"
                      name="email"
                      label="Email Address"
                      placeholder="Enter your email address"
                      autoComplete="email"
                      disabled={isSubmitting}
                      icon={<MailCheck className="h-5 w-5 text-gray-400" />}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : "Send Reset Instructions"}
                  </Button>
                </Form>
              )}
            </Formik>
          ) : (
            <div className="text-center space-y-5">
              <div className="flex justify-center">
                <div className="bg-green-100 p-4 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800">Check Your Email</h3>
              <p className="text-gray-600">
                We have sent password reset instructions to your email address.
              </p>
              
              <div className="pt-4 space-y-3">
                
                
                <Button
                  onClick={() => router.push("/signin")}
                  className="w-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          )}
          
          {!isSubmitted && (
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-800 flex items-center justify-center mx-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to previous page
              </Button>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 text-center text-sm text-gray-500 border-t">
          <p>© {new Date().getFullYear()} 1199 PSDD. All rights reserved.</p>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;