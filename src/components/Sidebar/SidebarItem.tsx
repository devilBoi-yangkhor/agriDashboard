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
      if (shouldExpand) {
        onToggle();
      }
    }
  }, [pathname, item.children]);

  if (!mounted) return null;

  const handleClick = (e: React.MouseEvent) => {
    if (item.children) {
      e.preventDefault();
      onToggle();
    } else {
      setPageName(item.label.toLowerCase());
    }
  };

  const isActive = pathname === item.route || 
    (item.children && item.children.some((child: any) => child.route === pathname));

  return (
    <li>
      <Link
        href={item.route || "#"}
        onClick={handleClick}
        className={`group flex items-center justify-between rounded-md px-2 py-2 text-base font-medium transition-all duration-300 hover:bg-[#19681D] hover:text-white ${
          isActive ? "bg-[#15661a] text-white" : "text-gray-300" // Darker green for active
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="transition-transform duration-300 group-hover:scale-110">
            {item.icon}
          </div>
          {!collapsed && (
            <span className="transition-all duration-300 group-hover:translate-x-1">
              {item.label}
            </span>
          )}
        </div>
        {!collapsed && item.children && (
          <svg
            className={`ml-auto h-4 w-4 transition-transform duration-300 ${
              isExpanded ? "rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        )}
      </Link>

      {item.children && isExpanded && (
        <div className="ml-3 border-l border-gray-600 pl-2">
          {item.children && (
            <ul className="pl-2">
              {item.children.map((child: any, index: number) => (
                <li key={index}>
                  <Link
                    href={child.route}
                    className={`group flex items-center gap-2 rounded-md px-4 py-1.5 text-sm text-gray-300 transition-all duration-300 hover:bg-[#19681D] hover:text-white ${
                      pathname === child.route ? "bg-[#15661a] text-white mt-0.5" : ""
                    }`}
                  >
                    <span className="transition-transform duration-300 group-hover:scale-110">
                      {child.icon} 
                    </span>
                    <span className="transition-all duration-300 group-hover:translate-x-1">
                      {child.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
};

export default SidebarItem;