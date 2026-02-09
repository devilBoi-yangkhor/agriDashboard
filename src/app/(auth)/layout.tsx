import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="flex justify-center bg-[#FFFFFF] dark:text-bodydark al">
      {children}
    </div>
  );
}