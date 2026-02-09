import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import FAQManagement from "./faq-manage";

const FAQPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="List of FAQs" />
      <div className="flex flex-col gap-2 ">
        <FAQManagement />
      </div>
    </DefaultLayout>
  );
};

export default FAQPage;
