"use client";
import { useEffect } from "react";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import NoticeboardManagement from "./noticboard-management";

const UsersPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="List of Notices" />
      <div className="flex flex-col gap-2 ">
        <NoticeboardManagement />
      </div>
    </DefaultLayout>
  );
};

export default UsersPage;
