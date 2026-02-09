import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserAttendance from "./attendance-management";

export const metadata: Metadata = {
  title: "Attendance | UserAttendance",
  description: "User Attendance management in the system",
};

const AttendancePage: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb parentPage="User " pageName="Attendance" />
      <div className="flex flex-col gap-2">
        <UserAttendance />
      </div>
    </DefaultLayout>
  );
};

export default AttendancePage;
