// import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import UserLayout from "@/components/Layouts/UserLayout";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard for BSB',
}

export default function Home () {
  return (
    <>
    <DefaultLayout>
        <h3>Welcome To User Dashboard</h3>
    </DefaultLayout>
    </>
  );
}
