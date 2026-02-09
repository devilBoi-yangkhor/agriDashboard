"use client";
import { createContext, useState, useContext, ReactNode } from "react";
import { Spinner } from "@/components/ui/spinner";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);
export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Spinner size="large" />
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
