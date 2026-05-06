// "use client";
// import { useSearchParams, useRouter } from "next/navigation";
// import { useEffect, useState, Suspense } from "react";
// import Link from "next/link";
// import { BiSearch } from "react-icons/bi";

// // ─────────────────────────────────────────────
// // TYPE
// // ─────────────────────────────────────────────
// type SearchResult = {
//   id: string | number;
//   category: string;       // e.g. "Product", "Order", "User", "Advertisement"
//   title: string;
//   subtitle?: string;
//   route: string;
// };

// // ─────────────────────────────────────────────
// // HIGHLIGHT helper — wraps matched text in a green <mark>
// // ─────────────────────────────────────────────
// const Highlight = ({ text, query }: { text: string; query: string }) => {
//   if (!query.trim()) return <span>{text}</span>;
//   const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
//   const parts = text.split(regex);
//   return (
//     <span>
//       {parts.map((part, i) =>
//         regex.test(part) ? (
//           <mark key={i} className="rounded bg-[#c8e6c9] px-0.5 text-[#1b5e20] font-semibold not-italic">
//             {part}
//           </mark>
//         ) : (
//           <span key={i}>{part}</span>
//         )
//       )}
//     </span>
//   );
// };

// // ─────────────────────────────────────────────
// // DATA LOADER — reads from localStorage and builds a flat searchable list
// // Add more sections here as your app grows
// // ─────────────────────────────────────────────
// function loadAllData(): SearchResult[] {
//   const results: SearchResult[] = [];

//   try {
//     // ── Users ──
//     const rawUsers = localStorage.getItem("users");
//     if (rawUsers) {
//       const users = JSON.parse(rawUsers);
//       users.forEach((u: any) => {
//         results.push({
//           id: u.id,
//           category: "User",
//           title: u.username || u.fullName || u.name || "Unknown User",
//           subtitle: u.email,
//           route: `/user-management/users`,
//         });
//       });
//     }

//     // ── Products ──
//     const rawProducts = localStorage.getItem("products");
//     if (rawProducts) {
//       const products = JSON.parse(rawProducts);
//       products.forEach((p: any) => {
//         results.push({
//           id: p.id,
//           category: "Product",
//           title: p.name || p.title || "Unnamed Product",
//           subtitle: p.category || p.type || "",
//           route: `/product-management/products`,
//         });
//       });
//     }

//     // ── Orders ──
//     const rawOrders = localStorage.getItem("orders");
//     if (rawOrders) {
//       const orders = JSON.parse(rawOrders);
//       orders.forEach((o: any) => {
//         results.push({
//           id: o.id,
//           category: "Order",
//           title: `Order #${o.id}`,
//           subtitle: o.status || o.buyer || "",
//           route: `/order-management/orders`,
//         });
//       });
//     }

//     // ── Advertisements ──
//     const rawAds = localStorage.getItem("advertisements");
//     if (rawAds) {
//       const ads = JSON.parse(rawAds);
//       ads.forEach((a: any) => {
//         results.push({
//           id: a.id,
//           category: "Advertisement",
//           title: a.title || a.name || "Unnamed Ad",
//           subtitle: a.status || "",
//           route: `/advertisement-management/my-advertisements`,
//         });
//       });
//     }
//   } catch (e) {
//     console.error("Search data load error:", e);
//   }

//   return results;
// }

// // ─────────────────────────────────────────────
// // CATEGORY BADGE colors
// // ─────────────────────────────────────────────
// const categoryColor: Record<string, string> = {
//   User:          "bg-blue-100 text-blue-700",
//   Product:       "bg-purple-100 text-purple-700",
//   Order:         "bg-orange-100 text-orange-700",
//   Advertisement: "bg-pink-100 text-pink-700",
// };

// // ─────────────────────────────────────────────
// // INNER component (uses useSearchParams)
// // ─────────────────────────────────────────────
// function SearchResults() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const query = searchParams.get("q") || "";

//   const [inputValue, setInputValue] = useState(query);
//   const [results, setResults] = useState<SearchResult[]>([]);
//   const [allData, setAllData] = useState<SearchResult[]>([]);

//   // Load data once on mount
//   useEffect(() => {
//     setAllData(loadAllData());
//   }, []);

//   // Filter whenever query or data changes
//   useEffect(() => {
//     if (!query.trim()) {
//       setResults([]);
//       return;
//     }
//     const q = query.toLowerCase();
//     const filtered = allData.filter(
//       (item) =>
//         item.title.toLowerCase().includes(q) ||
//         (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
//         item.category.toLowerCase().includes(q)
//     );
//     setResults(filtered);
//   }, [query, allData]);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (inputValue.trim()) {
//       router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
//     }
//   };

//   // Group results by category
//   const grouped = results.reduce<Record<string, SearchResult[]>>((acc, item) => {
//     if (!acc[item.category]) acc[item.category] = [];
//     acc[item.category].push(item);
//     return acc;
//   }, {});

//   return (
//     <div className="mx-auto max-w-3xl px-4 py-8">

//       {/* ── Search bar (re-search from this page) ── */}
//       <form onSubmit={handleSearch} className="mb-8">
//         <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3.5 shadow-sm border border-gray-100">
//           <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#4CAF50]">
//             <BiSearch className="text-white" size={15} />
//           </div>
//           <input
//             type="text"
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             placeholder="Search everything..."
//             autoFocus
//             className="flex-1 bg-transparent text-base text-gray-700 placeholder-gray-400 focus:outline-none"
//           />
//           {inputValue && (
//             <button
//               type="button"
//               onClick={() => { setInputValue(""); router.push("/search"); }}
//               className="text-gray-300 hover:text-gray-500 text-lg leading-none"
//             >
//               ×
//             </button>
//           )}
//         </div>
//       </form>

//       {/* ── Result count ── */}
//       {query && (
//         <p className="mb-5 text-sm text-gray-400">
//           {results.length === 0
//             ? `No results for `
//             : `${results.length} result${results.length !== 1 ? "s" : ""} for `}
//           <span className="font-semibold text-gray-700">"{query}"</span>
//         </p>
//       )}

//       {/* ── No results state ── */}
//       {query && results.length === 0 && (
//         <div className="rounded-2xl bg-white px-8 py-12 text-center shadow-sm">
//           <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
//             <BiSearch size={24} className="text-gray-400" />
//           </div>
//           <p className="text-base font-medium text-gray-600">No results found</p>
//           <p className="mt-1 text-sm text-gray-400">
//             Try searching with different keywords
//           </p>
//         </div>
//       )}

//       {/* ── Grouped results ── */}
//       {Object.entries(grouped).map(([category, items]) => (
//         <div key={category} className="mb-6">
//           {/* Category header */}
//           <div className="mb-2 flex items-center gap-2">
//             <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryColor[category] ?? "bg-gray-100 text-gray-600"}`}>
//               {category}
//             </span>
//             <span className="text-xs text-gray-400">{items.length} found</span>
//           </div>

//           {/* Result cards */}
//           <div className="flex flex-col gap-2">
//             {items.map((item) => (
//               <Link
//                 key={`${item.category}-${item.id}`}
//                 href={item.route}
//                 className="group flex items-start justify-between rounded-xl bg-white px-5 py-4 shadow-sm border border-transparent hover:border-[#a5d6a7] hover:shadow-md transition-all duration-150"
//               >
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-semibold text-gray-800 truncate">
//                     <Highlight text={item.title} query={query} />
//                   </p>
//                   {item.subtitle && (
//                     <p className="mt-0.5 text-xs text-gray-400 truncate">
//                       <Highlight text={item.subtitle} query={query} />
//                     </p>
//                   )}
//                 </div>
//                 {/* Arrow */}
//                 <svg
//                   className="ml-3 mt-0.5 h-4 w-4 flex-shrink-0 text-gray-300 group-hover:text-[#4CAF50] transition-colors"
//                   fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
//                 >
//                   <path d="M9 5l7 7-7 7" />
//                 </svg>
//               </Link>
//             ))}
//           </div>
//         </div>
//       ))}

//       {/* ── Empty state before searching ── */}
//       {!query && (
//         <div className="rounded-2xl bg-white px-8 py-12 text-center shadow-sm">
//           <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F5E9]">
//             <BiSearch size={24} className="text-[#4CAF50]" />
//           </div>
//           <p className="text-base font-medium text-gray-600">Start searching</p>
//           <p className="mt-1 text-sm text-gray-400">
//             Type in the search bar above to find users, products, orders, and more
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // PAGE export — wrapped in Suspense (required for useSearchParams)
// // ─────────────────────────────────────────────
// export default function SearchPage() {
//   return (
//     <Suspense>
//       <SearchResults />
//     </Suspense>
//   );
// }

//misty1
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Example data - replace this with your actual database fetch later
const MOCK_DATA = [
  { id: 1, name: 'Organic Wheat', category: 'Crops', status: 'Available' },
  { id: 2, name: 'Nitrogen Fertilizer', category: 'Supplies', status: 'Low Stock' },
  { id: 3, name: 'John Doe', category: 'Farmers', status: 'Active' },
  { id: 4, name: 'Tractor Repair', category: 'Maintenance', status: 'Pending' },
  { id: 5, name: 'Red Tomatoes', category: 'Crops', status: 'In Season' },
];

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';

  // Filter logic: matches name or category
  const results = MOCK_DATA.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
  );

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Search Results for: <span className="text-meta-3">"{query}"</span>
        </h4>
      </div>

      <div className="flex flex-col border-t border-stroke dark:border-strokedark">
        {results.length > 0 ? (
          results.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-3 border-b border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5"
            >
              <div className="flex items-center">
                <p className="text-sm text-black dark:text-white">{item.name}</p>
              </div>
              <div className="flex items-center justify-center">
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
              <div className="flex items-center justify-end">
                <p className="inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium bg-success text-success">
                  {item.status}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center">
            <p className="text-lg">No matches found. Try searching for "Crops" or "Wheat".</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-242">
      <Suspense fallback={<div className="p-10 text-center">Loading search results...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}