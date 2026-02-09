import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { LoadingProvider } from "@/context/LoadingContext";
import { PermissionProvider } from "@/context/PermissionContext";
import { Metadata } from "next";
import { Suspense } from "react";
import { NotificationProvider } from "@/context/NotificationContext";
import { Spinner } from "@/components/ui/spinner";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Esanam",
  description: "Login page for Esanam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Spinner size="large" />
        </div>}>
          <NotificationProvider>
            <LoadingProvider>
              <PermissionProvider>{children}</PermissionProvider>
            </LoadingProvider>
          </NotificationProvider>
        </Suspense>
      </body>
    </html>
  );
}