// // import React from "react";
// // import Link from "next/link";
// // import { usePathname } from "next/navigation";
// // import { AiFillCheckCircle } from "react-icons/ai";
// // import { HasRole } from "@/context/PermissionContext";

// // const SidebarDropdown = ({ item, assignRoles }: any) => {
// //   const pathname = usePathname();

// //   return (
// //     <>
// //       <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-3">
// //         {item.map((item: any, index: number) => (
// //           // <HasRole key={index} roles={item.role} hasRoles={assignRoles}>
// //           <li key={index}>
// //             <Link
// //               href={item.route}
// //               className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium text-bodydark2 transition-all duration-300 ease-in-out hover:bg-[#19681D] hover:text-white ${
// //                 pathname === item.route ? "bg-[#19681D] text-white" : ""
// //               }`}
// //             >
// //               <AiFillCheckCircle
// //                 className="text-white transition-transform duration-300 group-hover:scale-110"
// //                 size={16}
// //               />
// //               <span className="transition-all duration-300 group-hover:translate-x-1">
// //                 {item.label}
// //               </span>
// //             </Link>
// //           </li>
// //           // </HasRole>
// //         ))}
// //       </ul>
// //     </>
// //   );
// // };

// // export default SidebarDropdown;

// // //misty

// import React from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const SidebarDropdown = ({ item, assignRoles }: any) => {
//   const pathname = usePathname();

//   return (
//     <ul className="ml-4 border-l border-gray-100 pl-3 py-1 flex flex-col gap-0.5">
//       {item.map((child: any, index: number) => (
//         <li key={index}>
//           <Link
//             href={child.route}
//             className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200
//               ${
//                 pathname === child.route
//                   ? "bg-[#E8F5E9] font-medium text-[#2E7D32]"
//                   : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
//               }`}
//           >
//             {/* Small dot indicator */}
//             <span
//               className={`h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors duration-200 ${
//                 pathname === child.route
//                   ? "bg-[#4CAF50]"
//                   : "bg-gray-300 group-hover:bg-gray-400"
//               }`}
//             />
//             <span className="truncate">{child.label}</span>
//           </Link>
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default SidebarDropdown;
//misty

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarDropdown = ({ item }: any) => {
  const pathname = usePathname();

  return (
    <ul className="ml-5 border-l border-gray-100 pl-3 py-1 flex flex-col gap-0.5">
      {item.map((child: any, index: number) => (
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
  );
};

export default SidebarDropdown;
