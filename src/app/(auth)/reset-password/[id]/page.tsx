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
import { useParams } from 'next/navigation';
import api from "@/lib/axios";
import Link from "next/link";
import logo from "/public/images/logo/logo.png";

export default function PasswordChange( ) {
    const router = useRouter()
    const params = useParams()
    const [userId, setUserId] = useState<number | undefined>()

    const [passwordStrength, setPasswordStrength] = useState(0);

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;

        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        return (strength / 5) * 100;
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
        const { value } = e.target;
        setFieldValue('new_password', value);

        setPasswordStrength(calculatePasswordStrength(value));
    };

    const handleSubmit = async (values: any, { resetForm, setSubmitting }: any) => {
        try {
            // Simulate API call
            console.log(values.password)
            await api.post(`auth/reset-password/confirm/`, {
                token: params.id,
                new_password: values.new_password,
            }).then((res) => {
                if(res.status === 200){
                    toast.success("Password changed successful!", {
                        position: "top-right",
                        autoClose: 1500,
                    });
    
                    setTimeout(() => {
                        router.push("/signin")
                    }, 2000)
                }else{
                    toast.error("Error while changing password.", {
                        position: "top-right",
                        autoClose: 1500,
                    });
                }
                
            })
            resetForm();
            setPasswordStrength(0);
        } finally {
            setSubmitting(false);
        }
    };
    useEffect(() => {
        if (!params.id) {
            toast.error("Invalid password reset link.", {
                position: "top-right",
                autoClose: 1500,
            });
            router.push("/signin")
            return;
        }

        // decryptId();
    }, [params.id]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card>
                <ToastContainer />
                <div className="flex flex-wrap items-center">
                    <div className="flex flex-col justify-center rounded-lg p-6 space-y-4">
                        {/* Logo added here */}
                        <div className="flex justify-center mb-4">
                            <Image 
                                src={logo} // Update this path to your logo
                                alt="CRM Logo"
                                width={150} // Adjust as needed
                                height={100} // Adjust as needed
                                className="object-contain"
                            />
                        </div>
                        
                        <div className="form-group text-center">
                            <span className="font-bold text-gray-400">
                                Change Password
                            </span>
                        </div>

                        <Formik
                            initialValues={{
                                new_password: '',
                                confirm_password: ''
                            }}
                            validationSchema={Yup.object({
                                new_password: Yup.string()
                                    .required("Password is required")
                                    .min(8, "Password must be at least 8 characters")
                                    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
                                    .matches(/[a-z]/, "Must contain at least one lowercase letter")
                                    .matches(/[0-9]/, "Must contain at least one number")
                                    .matches(/[^A-Za-z0-9]/, "Must contain at least one special character"),
                                confirm_password: Yup.string()
                                    .required("Please confirm your password")
                                    .oneOf([Yup.ref('new_password')], "Passwords must match")
                            })}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, values, setFieldValue }) => (
                                <Form className="w-full space-y-4">
                                    <div>
                                        <Input
                                            type="password"
                                            name="new_password"
                                            label="New Password"
                                            placeholder="Enter New Password"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePasswordChange(e, setFieldValue)}
                                            autoComplete="off"
                                            disabled={isSubmitting}
                                        />

                                        <div className="mt-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="h-2.5 rounded-full"
                                                    style={{
                                                        width: `${passwordStrength}%`,
                                                        backgroundColor:
                                                            passwordStrength < 40 ? 'red' :
                                                                passwordStrength < 70 ? 'orange' : 'green'
                                                    }}
                                                />
                                            </div>
                                            <div className="text-xs mt-1 text-gray-500">
                                                Password strength: {passwordStrength < 40 ? 'Weak' : passwordStrength < 70 ? 'Moderate' : 'Strong'}
                                            </div>
                                        </div>

                                        
                                    </div>

                                    <Input
                                        type="password"
                                        name="confirm_password"
                                        label="Confirm Password"
                                        placeholder="Confirm Password"
                                        autoComplete="off"
                                        disabled={isSubmitting}
                                    />
                                    <div className="mt-4 text-xs text-gray-600">
                                            <p className="font-medium mb-2">Password Criteria:</p>
                                            <ul className="space-y-1">
                                                <li className={`flex items-center ${values.new_password?.length >= 8 ? 'text-green-500' : ''}`}>
                                                    {values.new_password?.length >= 8 ? '✓' : '•'} At least 8 characters
                                                </li>
                                                <li className={`flex items-center ${/[A-Z]/.test(values.new_password) ? 'text-green-500' : ''}`}>
                                                    {/[A-Z]/.test(values.new_password) ? '✓' : '•'} One uppercase letter
                                                </li>
                                                <li className={`flex items-center ${/[a-z]/.test(values.new_password) ? 'text-green-500' : ''}`}>
                                                    {/[a-z]/.test(values.new_password) ? '✓' : '•'} One lowercase letter
                                                </li>
                                                <li className={`flex items-center ${/[0-9]/.test(values.new_password) ? 'text-green-500' : ''}`}>
                                                    {/[0-9]/.test(values.new_password) ? '✓' : '•'} One number
                                                </li>
                                                <li className={`flex items-center ${/[^A-Za-z0-9]/.test(values.new_password) ? 'text-green-500' : ''}`}>
                                                    {/[^A-Za-z0-9]/.test(values.new_password) ? '✓' : '•'} One special character
                                                </li>
                                            </ul>
                                        </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Changing...
                                            </span>
                                        ) : "Change Password"}
                                    </Button>

<Link href={"/signin"}>
                                    <Button
                                        type="submit"
                                        className="w-full mt-5"
                                    >
                                        Back to Sign In
                                    </Button>
                                    </Link>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </Card>
        </div>
    );
};
