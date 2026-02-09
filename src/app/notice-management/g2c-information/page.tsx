"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useLoading } from "@/context/LoadingContext";
import Link from "next/link";
import { FaRegPlusSquare } from "react-icons/fa";
import { Options } from "@/interface/Options";
import { getG2Cs } from "@/services/G2CService";
import api from "@/lib/axios";

const ServiceTracking = () => {
  const [nameList, setNameList] = useState<Options[]>([]);
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [param, setParam] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [paramValues, setParamValues] = useState<{ [key: string]: string }>({});
  const [searchResults, setSearchResults] = useState<any>(null);
  const { setIsLoading } = useLoading();

  const splitWords = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService[0]) {
      setError("Please select a service to track.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const formattedParams = param
        .map((p) => paramValues[p] || "")
        .filter((value) => value)
        .join("/");

      if (!formattedParams) {
        setError("Please provide all required parameters.");
        setIsLoading(false);
        return;
      }

      const response = await api.post(`api-management/track/`, {
        url: selectedService[0].url,
        parameters: formattedParams,
        name: selectedService[0].name,
      });

      setSearchResults(response.data);
    } catch (error: any) {
      console.error("Error during search:", error);
      setError(
        error.response?.data?.message ||
          "Failed to track the service. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleParamChange = (param: string, value: string) => {
    setParamValues((prev) => ({ ...prev, [param]: value }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getG2Cs();
        if (!response) {
          throw new Error("No response from server");
        }
        const data = response.data?.results || response.data || response;

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received");
        }
        setOriginalData(data);

        const agencyOptions = data.map((item) => ({
          value: item.id,
          text: item.name,
        }));

        setNameList(agencyOptions);
      } catch (error) {
        console.error("Error fetching G2C data:", error);
        setError("Failed to load G2C services. Please try again later.");
        setNameList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setIsLoading]);

  // Function to dynamically extract headers and data for the table
  const renderTable = () => {
    if (!searchResults?.data) {
      return <p className="text-gray-600 dark:text-gray-300">No results to display.</p>;
    }

    const data = searchResults.data;
    let tableData: any[] = [];
    let headers: string[] = [];

    // Extract the first nested array (e.g., passportDetail, application)
    const nestedData = Object.values(data).find(
      (value: any) => value && typeof value === "object" && Object.values(value)[0]
    );

    if (nestedData && typeof nestedData === "object") {
      const nestedValues = Object.values(nestedData);
      tableData = Array.isArray(nestedValues[0])
        ? (nestedValues[0] as any[])
        : [];
    } else {
      tableData = [];
    }

    if (tableData.length === 0) {
      return <p className="text-gray-600 dark:text-gray-300">No data available.</p>;
    }

    // Extract headers dynamically from the first item
    headers = Object.keys(tableData[0]).map((key) => splitWords(key));

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse rounded-lg bg-white shadow-md dark:bg-gray-800">
          <thead>
            <tr className="bg-red-700 text-left text-white">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-sm font-semibold uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : "bg-white dark:bg-gray-800"}
              >
                {Object.keys(row).map((key, colIndex) => {
                  let value = row[key];
                  // Format dates if they match ISO format
                  if (typeof value === "string" && /\d{4}-\d{2}-\d{2}T/.test(value)) {
                    value = new Date(value).toLocaleDateString();
                  }
                  // Handle null or undefined values
                  value = value ?? "-";
                  return (
                    <td
                      key={colIndex}
                      className="border-t border-gray-200 px-4 py-3 text-sm text-gray-900 dark:border-gray-600 dark:text-gray-100"
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Service Tracking" />

      <div className="container mx-auto px-4">
        <div className="rounded-lg border bg-white p-6 shadow-md dark:bg-gray-800 md:p-8">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Track Your Application
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Search for the status and details of your service applications.
              </p>
            </div>
            <Link href="/notice-management/g2c-information/api-management/create">
              <Button className="btn-sm ml-auto gap-2 rounded-full bg-red-700 px-4 py-2 text-white">
                <FaRegPlusSquare size={20} />
                Add New URL
              </Button>
            </Link>
          </div>

          <form onSubmit={handleSearch}>
            <div className="mb-5 space-y-4">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  {error && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  )}
                  <label htmlFor="g2cService" className="sr-only">
                    Select G2C Service
                  </label>
                  <select
                    id="g2cService"
                    name="g2cService"
                    value={selectedService[0]?.id || ""}
                    onChange={(e) => {
                      const selected = originalData.filter(
                        (item) => item.id == e.target.value
                      );
                      setSelectedService(selected);
                      const fieldsString = selected[0]?.parameter || "";
                      const fields = fieldsString
                        .replace(/[\[\]\s]/g, "")
                        .split(",");
                      setParam(fields);
                      setParamValues({});
                    }}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 sm:max-w-md"
                    aria-label="Select a G2C service"
                    disabled={nameList.length === 0}
                  >
                    <option value="" disabled>
                      {nameList.length === 0
                        ? error
                          ? "Error loading services"
                          : "Loading services..."
                        : "Select a service"}
                    </option>
                    {nameList.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full xl:w-1/2">
                  {param?.map((p, index) => (
                    <div className="w-full" key={index}>
                      <label
                        htmlFor={`param-${p}`}
                        className="text-sm text-gray-700 dark:text-gray-200"
                      >
                        {splitWords(p)}
                      </label>
                      <Input
                        id={`param-${p}`}
                        name={p}
                        type="text"
                        placeholder={`Enter ${splitWords(p)}`}
                        value={paramValues[p] || ""}
                        onChange={(e) => handleParamChange(p, e.target.value)}
                        className="w-full mb-3 border-gray-300 transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 sm:max-w-md"
                        aria-required="true"
                      />
                    </div>
                  ))}
                </div>

                <div className="xl:w-1/3 w-full">
                  <Button
                    type="submit"
                    className="w-full items-center gap-2 self-start rounded-md bg-red-700 px-4 py-2 font-medium text-white opacity-100 hover:bg-red-600 sm:w-auto sm:max-w-md"
                  >
                    <Search className="h-5 w-5" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </form>

          <div className="mt-6">
            {renderTable()}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ServiceTracking;