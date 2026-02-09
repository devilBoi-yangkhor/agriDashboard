"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState, useEffect } from "react";
// import { utils, writeFile } from "xlsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function Reports() {
  // Mock data for demonstration
  const mockData = [
    {
      id: 1,
      dzongkhag: "Thimphu",
      date: "2025-01-01",
      queryCategory: "Service Request",
      subCategory: "Water Supply",
      agent: "Agent A",
      turnaroundTime: 24,
      status: "Closed",
    },
    {
      id: 2,
      dzongkhag: "Paro",
      date: "2025-01-02",
      queryCategory: "Complaint",
      subCategory: "Road Maintenance",
      agent: "Agent B",
      turnaroundTime: 48,
      status: "Open",
    },
    {
      id: 3,
      dzongkhag: "Thimphu",
      date: "2025-01-03",
      queryCategory: "Service Request",
      subCategory: "Electricity",
      agent: "Agent A",
      turnaroundTime: 12,
      status: "In Progress",
    },
  ];

  // Dropdown options derived from mock data
  const dzongkhagOptions = [...new Set(mockData.map((item) => item.dzongkhag))];
  const queryCategoryOptions = [
    ...new Set(mockData.map((item) => item.queryCategory)),
  ];
  const subCategoryOptions = [
    ...new Set(mockData.map((item) => item.subCategory)),
  ];
  const agentOptions = [...new Set(mockData.map((item) => item.agent))];
  const statusOptions = [...new Set(mockData.map((item) => item.status))];

  // State for form inputs
  const [filters, setFilters] = useState({
    dzongkhag: undefined,
    fromDate: "",
    toDate: "",
    queryCategory: undefined,
    subCategory: undefined,
    agent: undefined,
    turnaroundTime: "",
    status: undefined,
  });

  // State for showing additional filters
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // State for filtered data, initialized with mockData
  const [filteredData, setFilteredData] = useState(mockData);

  // Handle form input changes
  const handleInputChange = (name: string, value: string | undefined) => {
    setFilters({ ...filters, [name]: value });
  };

  // Filter data based on filters
  const filterData = () => {
    let results = mockData;

    if (filters.dzongkhag) {
      results = results.filter((item) => item.dzongkhag === filters.dzongkhag);
    }
    if (filters.fromDate) {
      results = results.filter((item) => item.date >= filters.fromDate);
    }
    if (filters.toDate) {
      results = results.filter((item) => item.date <= filters.toDate);
    }
    if (filters.queryCategory) {
      results = results.filter(
        (item) => item.queryCategory === filters.queryCategory,
      );
    }
    if (filters.subCategory) {
      results = results.filter(
        (item) => item.subCategory === filters.subCategory,
      );
    }
    if (filters.agent) {
      results = results.filter((item) => item.agent === filters.agent);
    }
    if (filters.turnaroundTime) {
      results = results.filter(
        (item) => item.turnaroundTime <= parseInt(filters.turnaroundTime),
      );
    }
    if (filters.status) {
      results = results.filter((item) => item.status === filters.status);
    }

    setFilteredData(results);
  };

  // Trigger filtering whenever filters change
  useEffect(() => {
    filterData();
  }, [filters]);

  // Export to Excel
  // const exportToExcel = () => {
  //   const worksheet = utils.json_to_sheet(filteredData);
  //   const workbook = utils.book_new();
  //   utils.book_append_sheet(workbook, worksheet, "Report");
  //   writeFile(workbook, "Overview_Statistics_Report.xlsx");
  // };

  return (
    <DefaultLayout>
      <Breadcrumb
        parentPage="Report"
        pageName="Overview and Statistics Report"
      />
      <div className="min-h-screen border-t-2 p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-3xl font-bold text-gray-800">
            General Report
          </h1>
          <div className="flex flex-col lg:flex-row">
            {/* Filter Section - Left (25%) */}
            <div className="w-full rounded-lg border bg-white p-6 shadow-md">
              <div className="flex flex-col gap-4">
                {/* Default Filters */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <Select
                      value={filters.agent}
                      onValueChange={(value) =>
                        handleInputChange("agent", value)
                      }
                    >
                      <SelectTrigger className="mt-1 border border-gray-300">
                        <SelectValue placeholder="Select Agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {agentOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full xl:w-1/2">
                    <Select
                      value={filters.queryCategory}
                      onValueChange={(value) =>
                        handleInputChange("queryCategory", value)
                      }
                    >
                      <SelectTrigger className="mt-1 border border-gray-300">
                        <SelectValue placeholder="Select Query Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {queryCategoryOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full xl:w-1/2">
                    <Select
                      value={filters.subCategory}
                      onValueChange={(value) =>
                        handleInputChange("subCategory", value)
                      }
                    >
                      <SelectTrigger className="mt-1 border border-gray-300">
                        <SelectValue placeholder="Select Sub Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {subCategoryOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full xl:w-1/2">
                    <Select
                      value={filters.status}
                      onValueChange={(value) =>
                        handleInputChange("status", value)
                      }
                    >
                      <SelectTrigger className="mt-1 border border-gray-300">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full xl:w-1/2">
                    <button
                      onClick={() => setShowMoreFilters(!showMoreFilters)}
                      className=" w-full rounded-md border border-gray-300 bg-red-600  py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {showMoreFilters ? "Hide Filters" : "More Filters"}
                    </button>
                  </div>
                </div>
                {/* Additional Filters (shown when toggled) */}
                {showMoreFilters && (
                  <div className="flex flex-row gap-4 overflow-x-auto">
                    <div className="w-full xl:w-1/2">
                      <label className="block text-sm font-medium text-gray-700">
                        Dzongkhag
                      </label>
                      <Select
                        value={filters.dzongkhag}
                        onValueChange={(value) =>
                          handleInputChange("dzongkhag", value)
                        }
                      >
                        <SelectTrigger className="mt-1 border border-gray-300">
                          <SelectValue placeholder="Select Dzongkhag" />
                        </SelectTrigger>
                        <SelectContent>
                          {dzongkhagOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full xl:w-1/2">
                      <label className="block text-sm font-medium text-gray-700">
                        From Date
                      </label>
                      <input
                        type="date"
                        name="fromDate"
                        value={filters.fromDate}
                        onChange={(e) =>
                          handleInputChange("fromDate", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 p-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="w-full xl:w-1/2">
                      <label className="block text-sm font-medium text-gray-700">
                        To Date
                      </label>
                      <input
                        type="date"
                        name="toDate"
                        value={filters.toDate}
                        onChange={(e) =>
                          handleInputChange("toDate", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 p-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="w-full xl:w-1/2">
                      <label className="block text-sm font-medium text-gray-700">
                        Turnaround Time (hours)
                      </label>
                      <input
                        type="number"
                        name="turnaroundTime"
                        value={filters.turnaroundTime}
                        onChange={(e) =>
                          handleInputChange("turnaroundTime", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 p-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="e.g., 24"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Results Section - Right (75%) */}
          <div className="mt-6 flex flex-col gap-6 lg:flex-row">
            <div className="w-full rounded-lg border bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Report Results ({filteredData.length}{" "}
                  {filteredData.length === 1 ? "record" : "records"})
                </h2>
                <button
                  // onClick={exportToExcel}
                  className="inline-flex items-center rounded-md border border-transparent bg-red-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Export to Excel
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Dzongkhag
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Query Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Sub Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Agent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Turnaround Time (hrs)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <tr key={item.id}>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {item.dzongkhag}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {item.date}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {item.queryCategory}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {item.subCategory}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {item.agent}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {item.turnaroundTime}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {item.status}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No data matches the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
