"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { toast, ToastContainer } from "react-toastify";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Loader from "@/components/common/Loader";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  subCategory: string;
}

const Page = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching FAQs from an API
    const fetchFAQs = async () => {
      try {
        // Replace this with actual API call
        const mockFAQs: FAQ[] = [
          {
            id: "1",
            question: "How to reset my password?",
            answer: "Go to settings and click on 'Reset Password'.",
            category: "Account",
            subCategory: "Password",
          },
          {
            id: "2",
            question: "How to update my profile?",
            answer: "Navigate to your profile page and click 'Edit'.",
            category: "Account",
            subCategory: "Profile",
          },
          {
            id: "3",
            question: "Where can I find my invoices?",
            answer: "Invoices are available in the Billing section.",
            category: "Billing",
            subCategory: "Invoices",
          },
          {
            id: "4",
            question: "How to change payment method?",
            answer: "Go to Billing > Payment Methods to update.",
            category: "Billing",
            subCategory: "Payments",
          },
          {
            id: "5",
            question: "How to contact support?",
            answer:
              "Use the contact form on our website or email support@govtech.com.",
            category: "Support",
            subCategory: "Contact",
          },
          {
            id: "6",
            question: "What are your business hours?",
            answer:
              "Our support team is available Monday to Friday, 9am to 5pm.",
            category: "Support",
            subCategory: "Hours",
          },
        ];

        setFaqs(mockFAQs);
        setFilteredFaqs(mockFAQs);

        // Extract unique categories and subcategories
        const uniqueCategories = Array.from(
          new Set(mockFAQs.map((faq) => faq.category)),
        );
        const uniqueSubCategories = Array.from(
          new Set(mockFAQs.map((faq) => faq.subCategory)),
        );

        setCategories(uniqueCategories);
        setSubCategories(uniqueSubCategories);
      } catch (error) {
        toast.error("Failed to load FAQs");
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  useEffect(() => {
    // Filter FAQs based on search term and selected categories
    let results = faqs;

    if (searchTerm) {
      results = results.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory) {
      results = results.filter((faq) => faq.category === selectedCategory);
    }

    if (selectedSubCategory) {
      results = results.filter(
        (faq) => faq.subCategory === selectedSubCategory,
      );
    }

    setFilteredFaqs(results);
  }, [searchTerm, selectedCategory, selectedSubCategory, faqs]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSelectedSubCategory(""); // Reset subcategory when category changes
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubCategory(e.target.value);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="GovTech Helpdesk" />
      <div className="flex flex-col gap-2">
        <ToastContainer />
        <div className="rounded-sm border bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-4 py-4">
            <input
              placeholder="Search FAQs..."
              type="text"
              name="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full max-w-[250px] rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />

            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="block w-full max-w-[250px] rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              id="sub_category"
              value={selectedSubCategory}
              onChange={handleSubCategoryChange}
              className="block w-full max-w-[250px] rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
            >
              <option value="">All Sub-Categories</option>
              {subCategories
                .filter(
                  (subCat) =>
                    !selectedCategory ||
                    faqs.some(
                      (faq) =>
                        faq.category === selectedCategory &&
                        faq.subCategory === subCat,
                    ),
                )
                .map((subCategory) => (
                  <option key={subCategory} value={subCategory}>
                    {subCategory}
                  </option>
                ))}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader />
            </div>
          ) : (
            <div className="mt-4">
              {filteredFaqs.length === 0 ? (
                <div className="py-10 text-center text-gray-500">
                  No FAQs found matching your criteria
                </div>
              ) : (
                <DataTable columns={columns} data={filteredFaqs} />
              )}
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Page;
