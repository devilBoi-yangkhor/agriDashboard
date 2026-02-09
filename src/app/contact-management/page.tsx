import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ContactManagement from "./contact";

export const metadata: Metadata = {
  title: "Phone Number | Contact Management",
  description: "Contact management in the system",
};

const RolePage: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb parentPage="Contact Management" pageName="Phone Book" />
      <div className="flex flex-col gap-2">
        <ContactManagement />
      </div>
    </DefaultLayout>
  );
};

export default RolePage;
