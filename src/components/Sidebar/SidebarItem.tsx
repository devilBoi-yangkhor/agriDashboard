// // "use client";

// // import React, { useEffect, useState } from "react";
// // import Link from "next/link";
// // import { usePathname } from "next/navigation";

// // const SidebarItem = ({
// //   item,
// //   pageName,
// //   collapsed,
// //   setPageName,
// //   isExpanded,
// //   onToggle,
// // }: any) => {
// //   const pathname = usePathname();
// //   const [mounted, setMounted] = useState(false);

// //   useEffect(() => {
// //     setMounted(true);
// //     if (item.children) {
// //       const shouldExpand = item.children.some(
// //         (child: any) => child.route === pathname,
// //       );
// //       if (shouldExpand) {
// //         onToggle();
// //       }
// //     }
// //   }, [pathname, item.children]);

// //   if (!mounted) return null;

// //   const handleClick = (e: React.MouseEvent) => {
// //     if (item.children) {
// //       e.preventDefault();
// //       onToggle();
// //     } else {
// //       setPageName(item.label.toLowerCase());
// //     }
// //   };

// //   const isActive = pathname === item.route || 
// //     (item.children && item.children.some((child: any) => child.route === pathname));

// //   return (
// //     <li>
// //       <Link
// //         href={item.route || "#"}
// //         onClick={handleClick}
// //         className={`group flex items-center justify-between rounded-md px-2 py-2 text-base font-medium transition-all duration-300 hover:bg-[#19681D] hover:text-white ${
// //           isActive ? "bg-[#15661a] text-white" : "text-gray-300" // Darker green for active
// //         }`}
// //       >
// //         <div className="flex items-center gap-2">
// //           <div className="transition-transform duration-300 group-hover:scale-110">
// //             {item.icon}
// //           </div>
// //           {!collapsed && (
// //             <span className="transition-all duration-300 group-hover:translate-x-1">
// //               {item.label}
// //             </span>
// //           )}
// //         </div>
// //         {!collapsed && item.children && (
// //           <svg
// //             className={`ml-auto h-4 w-4 transition-transform duration-300 ${
// //               isExpanded ? "rotate-90" : ""
// //             }`}
// //             fill="none"
// //             stroke="currentColor"
// //             strokeWidth="2"
// //             viewBox="0 0 24 24"
// //           >
// //             <path d="M9 5l7 7-7 7" />
// //           </svg>
// //         )}
// //       </Link>

// //       {item.children && isExpanded && (
// //         <div className="ml-3 border-l border-gray-600 pl-2">
// //           {item.children && (
// //             <ul className="pl-2">
// //               {item.children.map((child: any, index: number) => (
// //                 <li key={index}>
// //                   <Link
// //                     href={child.route}
// //                     className={`group flex items-center gap-2 rounded-md px-4 py-1.5 text-sm text-gray-300 transition-all duration-300 hover:bg-[#19681D] hover:text-white ${
// //                       pathname === child.route ? "bg-[#15661a] text-white mt-0.5" : ""
// //                     }`}
// //                   >
// //                     <span className="transition-transform duration-300 group-hover:scale-110">
// //                       {child.icon} 
// //                     </span>
// //                     <span className="transition-all duration-300 group-hover:translate-x-1">
// //                       {child.label}
// //                     </span>
// //                   </Link>
// //                 </li>
// //               ))}
// //             </ul>
// //           )}
// //         </div>
// //       )}
// //     </li>
// //   );
// // };

// // export default SidebarItem;

// // //misty
// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const SidebarItem = ({
//   item,
//   pageName,
//   collapsed,
//   setPageName,
//   isExpanded,
//   onToggle,
// }: any) => {
//   const pathname = usePathname();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//     if (item.children) {
//       const shouldExpand = item.children.some(
//         (child: any) => child.route === pathname,
//       );
//       if (shouldExpand) {
//         onToggle();
//       }
//     }
//   }, [pathname, item.children]);

//   if (!mounted) return null;

//   const handleClick = (e: React.MouseEvent) => {
//     if (item.children) {
//       e.preventDefault();
//       onToggle();
//     } else {
//       setPageName(item.label.toLowerCase());
//     }
//   };

//   const isActive =
//     pathname === item.route ||
//     (item.children &&
//       item.children.some((child: any) => child.route === pathname));

//   return (
//     <li className="list-none">
//       <Link
//         href={item.route || "#"}
//         onClick={handleClick}
//         className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
//           ${
//             isActive
//               ? "bg-[#E8F5E9] text-[#2E7D32]"
//               : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
//           }`}
//       >
//         <div className="flex items-center gap-3">
//           {/* Icon container */}
//           <span
//             className={`flex-shrink-0 transition-colors duration-200 ${
//               isActive
//                 ? "text-[#4CAF50]"
//                 : "text-gray-400 group-hover:text-gray-500"
//             }`}
//           >
//             {item.icon}
//           </span>

//           {!collapsed && (
//             <span className="truncate">{item.label}</span>
//           )}
//         </div>

//         {/* Chevron for items with children */}
//         {!collapsed && item.children && (
//           <svg
//             className={`ml-auto h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 ${
//               isExpanded ? "rotate-90" : ""
//             } ${isActive ? "text-[#4CAF50]" : "text-gray-300"}`}
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2.5"
//             viewBox="0 0 24 24"
//           >
//             <path d="M9 5l7 7-7 7" />
//           </svg>
//         )}
//       </Link>

//       {/* Dropdown children */}
//       {item.children && isExpanded && !collapsed && (
//         <div className="mt-0.5 overflow-hidden">
//           <ul className="ml-4 border-l border-gray-100 pl-3 py-1 flex flex-col gap-0.5">
//             {item.children.map((child: any, index: number) => (
//               <li key={index}>
//                 <Link
//                   href={child.route}
//                   className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200
//                     ${
//                       pathname === child.route
//                         ? "bg-[#E8F5E9] font-medium text-[#2E7D32]"
//                         : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
//                     }`}
//                 >
//                   {/* Small dot indicator */}
//                   <span
//                     className={`h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors duration-200 ${
//                       pathname === child.route
//                         ? "bg-[#4CAF50]"
//                         : "bg-gray-300 group-hover:bg-gray-400"
//                     }`}
//                   />
//                   <span className="truncate">{child.label}</span>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </li>
//   );
// };

// export default SidebarItem;
//misty

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarItem = ({
  item,
  pageName,
  collapsed,
  setPageName,
  isExpanded,
  onToggle,
}: any) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (item.children) {
      const shouldExpand = item.children.some(
        (child: any) => child.route === pathname,
      );
      if (shouldExpand) onToggle();
    }
  }, [pathname]);

  if (!mounted) return null;

  const handleClick = (e: React.MouseEvent) => {
    if (item.children) {
      e.preventDefault();
      onToggle();
    } else {
      setPageName(item.label.toLowerCase());
    }
  };

  const isActive =
    pathname === item.route ||
    (item.children && item.children.some((child: any) => child.route === pathname));

  return (
    <li className="list-none">
      <Link
        href={item.route || "#"}
        onClick={handleClick}
        className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200
          ${
            isActive
              ? "bg-gradient-to-r from-[#43A047] to-[#66BB6A] text-white shadow-sm"
              : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
          }`}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <span className={`flex-shrink-0 ${isActive ? "text-white" : "text-gray-400"}`}>
            {item.icon}
          </span>

          {!collapsed && (
            <span>{item.label}</span>
          )}
        </div>

        {/* Chevron — only for items with children, only when not collapsed */}
        {!collapsed && item.children && (
          <svg
            className={`h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200
              ${isExpanded ? "rotate-90" : ""}
              ${isActive ? "text-white" : "text-gray-300"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        )}
      </Link>

      {/* Dropdown children */}
      {item.children && isExpanded && !collapsed && (
        <div className="mt-0.5">
          <ul className="ml-5 border-l border-gray-100 pl-3 py-1 flex flex-col gap-0.5">
            {item.children.map((child: any, index: number) => (
              <li key={index}>
                <Link
                  href={child.route}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
                    ${
                      pathname === child.route
                        ? "text-[#43A047] font-semibold"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <span
                    className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                      pathname === child.route ? "bg-[#4CAF50]" : "bg-gray-300"
                    }`}
                  />
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
