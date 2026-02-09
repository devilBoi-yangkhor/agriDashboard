"use client";
import { useEffect } from "react";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserManagement from "./user-management";

const UsersPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="List of Users" />
      <div className="flex flex-col gap-2 ">
        <UserManagement />
      </div>
    </DefaultLayout>
  );
};

export default UsersPage;
