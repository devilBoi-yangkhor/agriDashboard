// 'use client'
// import DarkModeSwitcher from "./DarkModeSwitcher";
// import DropdownNotification from "./DropdownNotification";

// import DropdownUser from "./DropdownUser";
// import { BiSearch } from "react-icons/bi";

// const Header = (props: {
//   sidebarOpen: string | boolean | undefined;
//   setSidebarOpen: (arg0: boolean) => void;
// }) => {
//   return (
//     <header className="sticky top-0 z-9 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
//       <div className="flex w-full items-center justify-between gap-4 px-4 py-4 shadow-2 md:px-6 2xl:px-11">
//         <div className="hidden flex-1 sm:block">
//           <form action="#" method="POST" className="w-full max-w-xl">
//             <div className="relative w-full">

//               {/* <input
//                 type="text"
//                 placeholder="Type to search..."
//                 className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none"
//               /> */}
//             </div>
//           </form>
//         </div>

//         <div className="flex items-center gap-3 2xsm:gap-7">
//           <ul className="flex items-center gap-2 2xsm:gap-4">
//             {/* <!-- Dark Mode Toggler --> */}
//             {/* <DarkModeSwitcher /> */}
//             {/* <!-- Dark Mode Toggler --> */}

//             {/* <!-- Notification Menu Area --> */}
//             <DropdownNotification />
//             {/* <!-- Notification Menu Area --> */}

//             {/* <!-- Chat Notification Area --> */}
//             {/* <DropdownMessage /> */}
//             {/* <!-- Chat Notification Area --> */}
//           </ul>

//           {/* <!-- User Area --> */}
//           <DropdownUser />
//           {/* <!-- User Area --> */}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
//misty1

// 'use client'
// import { useState } from "react";
// import DropdownNotification from "./DropdownNotification";
// import DropdownUser from "./DropdownUser";
// import { BiSearch } from "react-icons/bi";

// const Header = (props: {
//   sidebarOpen: string | boolean | undefined;
//   setSidebarOpen: (arg0: boolean) => void;
// }) => {
//   const [searchQuery, setSearchQuery] = useState("");

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       console.log("Searching for:", searchQuery);
//     }
//   };

//   return (
//     /* Outer area keeps the light green page bg */
//     <header className="sticky top-0 z-40 w-full bg-[#edf7ed] px-4 py-3 md:px-6">
//       {/* White rounded card — this is what shows in the screenshot */}
//       <div className="flex w-full items-center justify-between gap-4 rounded-2xl bg-white px-5 py-3 shadow-sm">

//         {/* ── Search Bar ── */}
//         <form onSubmit={handleSearch} className="hidden sm:block">
//           <div className="flex items-center gap-2.5 rounded-full bg-[#f5f5f5] px-3 py-2">
//             <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#4CAF50]">
//               <BiSearch className="text-white" size={13} />
//             </div>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search"
//               className="w-40 bg-transparent text-sm text-gray-500 placeholder-gray-400 focus:outline-none"
//             />
//           </div>
//         </form>

//         {/* ── Right: Bell + User ── */}
//         <div className="ml-auto flex items-center gap-5">
//           <DropdownNotification />
//           <DropdownUser />
//         </div>

//       </div>
//     </header>
//   );
// };

// export default Header;

//misty2
// 'use client'
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import DropdownNotification from "./DropdownNotification";
// import DropdownUser from "./DropdownUser";
// import { BiSearch } from "react-icons/bi";

// const Header = (props: {
//   sidebarOpen: string | boolean | undefined;
//   setSidebarOpen: (arg0: boolean) => void;
// }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const router = useRouter();

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       handleSearch(e as any);
//     }
//   };

//   return (
//     <header className="sticky top-0 z-40 w-full bg-[#edf7ed] px-4 py-3 md:px-6">
//       <div className="flex w-full items-center justify-between gap-4 rounded-2xl bg-white px-5 py-3 shadow-sm">

//         {/* ── Search Bar ── */}
//         <form onSubmit={handleSearch} className="hidden sm:block">
//           <div className="flex items-center gap-2.5 rounded-full bg-[#f5f5f5] px-3 py-2">
//             <button
//               type="submit"
//               className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#4CAF50]"
//             >
//               <BiSearch className="text-white" size={13} />
//             </button>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Search"
//               className="w-40 bg-transparent text-sm text-gray-500 placeholder-gray-400 focus:outline-none"
//             />
//           </div>
//         </form>

//         {/* ── Right: Bell + User ── */}
//         <div className="ml-auto flex items-center gap-5">
//           <DropdownNotification />
//           <DropdownUser />
//         </div>

//       </div>
//     </header>
//   );
// };

// export default Header;

//misty3
// 'use client'
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { BiSearch } from "react-icons/bi";

// // This map tells the search bar where to go based on keywords
// const SEARCH_MAP = [
//   { keyword: "profile", route: "/dashboard/profile" },
//   { keyword: "settings", route: "/dashboard/settings" },
//   { keyword: "calendar", route: "/dashboard/calendar" },
//   { keyword: "chart", route: "/dashboard/chart" },
//   { keyword: "ecommerce", route: "/dashboard/ecommerce" },
//   { keyword: "table", route: "/dashboard/tables" },
// ];

// const Header = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const router = useRouter();

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     const query = searchQuery.toLowerCase().trim();
//     if (!query) return;

//     // Check if the query matches a specific page
//     const match = SEARCH_MAP.find(item => query.includes(item.keyword));

//     if (match) {
//       // Redirect to that page and pass the highlight query
//       router.push(`${match.route}?highlight=${encodeURIComponent(query)}`);
//     } else {
//       // Fallback to general search results page
//       router.push(`/dashboard/search?q=${encodeURIComponent(query)}`);
//     }
//     setSearchQuery(""); // Clear bar after search
//   };

//   return (
//     <header className="sticky top-0 z-40 w-full bg-[#edf7ed] px-4 py-3 md:px-6">
//       <div className="flex w-full items-center justify-between gap-4 rounded-2xl bg-white px-5 py-3 shadow-sm">
//         <form onSubmit={handleSearch} className="hidden sm:block">
//           <div className="flex items-center gap-2.5 rounded-full bg-[#f5f5f5] px-3 py-2">
//             <button type="submit" className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4CAF50]">
//               <BiSearch className="text-white" size={13} />
//             </button>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search pages or items..."
//               className="w-48 bg-transparent text-sm text-gray-500 focus:outline-none"
//             />
//           </div>
//         </form>
//         {/* ... Rest of your Bell/User icons ... */}
//       </div>
//     </header>
//   );
// };

// export default Header;

//misty4

// 'use client'
// import { useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { BiSearch } from "react-icons/bi";

// const Header = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const router = useRouter();
//   const pathname = usePathname();

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       // This stays on the current page but adds the highlight trigger to the URL
//       router.push(`${pathname}?highlight=${encodeURIComponent(searchQuery.trim())}`);
//     }
//   };

//   return (
//     <header className="sticky top-0 z-40 w-full bg-[#edf7ed] px-4 py-3 md:px-6">
//       <div className="flex w-full items-center justify-between gap-4 rounded-2xl bg-white px-5 py-3 shadow-sm">
//         <form onSubmit={handleSearch} className="hidden sm:block">
//           <div className="flex items-center gap-2.5 rounded-full bg-[#f5f5f5] px-3 py-2 border border-transparent focus-within:border-[#4CAF50] transition-all">
//             <button type="submit" className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4CAF50]">
//               <BiSearch className="text-white" size={13} />
//             </button>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search on this page..."
//               className="w-48 bg-transparent text-sm text-gray-500 placeholder-gray-400 focus:outline-none"
//             />
//           </div>
//         </form>
//         {/* Right side icons (Notification/User) stay here */}
//       </div>
//     </header>
//   );
// };

// export default Header;

'use client'

import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#edf7ed] px-4 py-3 md:px-6">
      <div className="flex w-full items-center justify-between rounded-2xl bg-white px-5 py-3 shadow-sm">

        {/* Left side (you can put title/logo here if you want) */}
        <div className="text-lg font-semibold text-gray-700">
          Dashboard
        </div>

        {/* Right side */}
        <div className="flex items-center gap-5">
          <DropdownNotification />
          <DropdownUser />
        </div>

      </div>
    </header>
  );
};

export default Header;