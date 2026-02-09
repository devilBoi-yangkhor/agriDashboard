"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import Image from "next/image";
import { GrDashboard } from "react-icons/gr";
import { IoIosArrowBack } from "react-icons/io";
import {
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBox,
  FaTimes,
  FaBars,
  FaMehBlank,
} from "react-icons/fa";
import { FaBuildingCircleXmark, FaDatabase, FaPiggyBank } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { RiShapeFill } from "react-icons/ri";
import { useRouter } from "next/navigation";

type UserDetails = {
  fullName: string;
  email: string;
  imageUrl: string;
  roles: string[];
};

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    menuItems: [
      {
        icon: (
          <GrDashboard className="fill-current" size={20} color="#FFFFFF" />
        ),
        label: "Dashboard",
        route: "/dashboard",
      },
      {
        icon: <FaBox className="fill-current" size={20} color="#FFFFFF" />,
        label: "Product Management",
        route: "#",
        role: [
          "add_product_table",
          "change_prodcut_table",
          "delete_product_table",
          "view_master_table",
        ],
        children: [
          {
            icon: <RiShapeFill size={14} className="mr-2 text-gray-300" />,
            label: "Products",
            role: ["view_product"],
            privilege: "can view products",
            route: "/product-management/products",
          },
        ],
      },
      {
        icon: <FaDatabase className="fill-current" size={20} color="#FFFFFF" />,
        label: "Advertisement",
        route: "#",
        role: [
          "view_advertisement",
          "add_advertisement",
          "change_advertisement",
          "delete_advertisement",
          "view_categories",
        ],
        children: [
          {
            icon: <RiShapeFill size={14} className="mr-2 text-gray-300" />,
            label: "Create Advertisement",
            role: ["add_advertisement"],
            route: "/advertisement-management/create",
          },
          {
            icon: <RiShapeFill size={14} className="mr-2 text-gray-300" />,
            label: "Advertisements",
            role: ["view_advertisement"],
            route: "/advertisement-management/my-advertisements",
          },
        ],
      },
      {
        icon: (
          <FaShoppingCart className="fill-current" size={20} color="#FFFFFF" />
        ),
        label: "Order Management",
        route: "#",
        role: ["view_orders", "manage_orders", "view_transactions"],
        children: [
          {
            icon: <RiShapeFill size={14} className="mr-2 text-gray-300" />,
            label: "Orders",
            role: ["view_orders"],
            privilege: "can view orders",
            route: "/order-management/orders",
          },
        ],
      },
      {
        icon: <FaDatabase className="fill-current" size={20} color="#FFFFFF" />,
        label: "Master Management",
        route: "#",
        role: [
          "add_mastertable",
          "change_mastertable",
          "delete_mastertable",
          "view_mastertable",
        ],
        children: [
          {
            icon: <RiShapeFill size={14} className="mr-2 text-gray-300" />,
            label: "Gender",
            role: ["view_mastertable"],
            route: "/master-management/gender",
          },
          {
            icon: <RiShapeFill size={14} className="mr-2 text-gray-300" />,
            label: "Status",
            role: [""],
            route: "/master-management/status",
          },
          {
            icon: <RiShapeFill size={14} className="mr-2 text-gray-300" />,
            label: "Category",
            role: ["view_mastertable"],
            route: "/master-management/category",
          },
          {
            icon: <RiShapeFill size={14} className="mr-2 text-gray-300" />,
            label: "Product Type",
            role: ["view_mastertable"],
            route: "/master-management/product-type",
          },
          {
            icon: <RiShapeFill size={14} className="mr-2 text-gray-300" />,
            label: "Dzongkhag",
            role: ["view_mastertable"],
            route: "/master-management/dzongkhag",
          },
          {
            icon: <RiShapeFill size={14} className="mr-2 text-gray-300" />,
            label: "Gewog",
            role: ["view_mastertable"],
            route: "/master-management/gewog",
          },
          {
            icon: <RiShapeFill size={14} className="mr-2 text-gray-300" />,
            label: "Village",
            role: ["view_mastertable"],
            route: "/master-management/village",
          },
          {
            icon: <RiShapeFill size={14} className="mr-2 text-gray-300" />,
            label: "Bank",
            role: ["view_mastertable"],
            route: "/master-management/bank",
          },
        ],
      },
      {
        icon: <FaUser className="fill-current" size={20} color="#FFFFFF" />,
        label: "User Management",
        route: "#",
        role: ["view_user", "view_group", "change_permission"],
        children: [
          {
            icon: <RiShapeFill size={14} className="mr-2 text-gray-300" />,
            label: "Users",
            role: ["view_user"],
            route: "/user-management/users",
          },
          {
            icon: <RiShapeFill size={14} className="mr-2 text-gray-300" />,
            label: "Roles",
            role: ["view_group"],
            route: "/user-management/roles",
          },
          {
            icon: <RiShapeFill size={14} className="mr-2 text-gray-300" />,
            label: "Permission",
            role: ["change_permission"],
            route: "/user-management/permission",
          },
        ],
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const router = useRouter();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storedRoles, setStoredRoles] = useState<string[]>([]);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userDetails");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        let userPermissions: string[] = [];
        if (parsedUser.roles && Array.isArray(parsedUser.roles)) {
          userPermissions = parsedUser.roles.flatMap(
            (role: any) => role.permissions || [],
          );
        }

        setStoredRoles(userPermissions);
      } catch (error) {
        console.error("Error parsing user details:", error);
      }
    }
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    setSidebarOpen(!collapsed);
    if (!collapsed) setExpandedMenu(null);
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleMenuToggle = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
    setPageName(label.toLowerCase());
  };

  const handleLogout = async () => {
    try {
      await fetch("/logout", { method: "POST" }).finally(() => {
        localStorage.removeItem("userDetails");
        router.push("/");
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 block rounded-lg bg-[#2E7D32] p-2.5 text-white shadow-md transition-all hover:bg-[#1B5E20] lg:hidden"
        onClick={toggleMobileMenu}
      >
        {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      <ClickOutside onClick={() => setSidebarOpen(false)}>
        <aside
          className={`fixed left-0 top-0 z-40 flex h-screen flex-col overflow-y-hidden bg-gradient-to-b from-[#2E7D32] to-[#1B5E20] duration-300 ease-in-out lg:translate-x-0  
          ${collapsed ? "w-[70px]" : "w-[260px]"} 
          ${mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}`}
        >
          {/* HEADER */}
          <div
            className={`flex items-center gap-3 border-b border-white/10 px-5 py-4 ${
              collapsed ? "justify-center px-3" : ""
            }`}
          >
            {!collapsed && (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <Image
                      width={20}
                      height={20}
                      src={"/images/logo/logo.png"}
                      alt="Logo"
                      className="h-5 w-5"
                    />
                  </div>
                  <Link href="/" className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">ESanam</span>
                    <span className="text-xs text-white/60">v1.0</span>
                  </Link>
                </div>
              </>
            )}

            {collapsed && (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <Image
                  width={20}
                  height={20}
                  src={"/images/logo/logo.png"}
                  alt="Logo"
                  className="h-5 w-5"
                />
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="ml-auto block rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
            >
              <IoIosArrowBack size={22} />
            </button>
          </div>

          {/* NAVIGATION MENU */}
          <div className="flex flex-1 flex-col overflow-y-auto py-4">
            <nav className="px-2">
              {menuGroups.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <ul className="flex flex-col gap-1">
                    {group.menuItems.map((menuItem, menuIndex) => (
                      <div key={menuIndex} className="mb-0.5">
                        <SidebarItem
                          item={menuItem}
                          collapsed={collapsed}
                          assignRoles={storedRoles}
                          roles={menuItem.role}
                          pageName={pageName}
                          setPageName={setPageName}
                          isExpanded={expandedMenu === menuItem.label}
                          onToggle={() => handleMenuToggle(menuItem.label)}
                        />
                      </div>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          {/* FOOTER SECTION */}
          <div className="border-t border-white/10 p-4">
            <ul className="flex flex-col gap-1">
              <li>
                <Link
                  href="/settings"
                  className={`group flex items-center gap-3 rounded-lg px-4 py-3 
                  font-medium text-white/90 transition-all duration-200 hover:bg-white/10 
                  ${pageName === "settings" ? "bg-white/10 text-white" : ""}`}
                  onClick={() => setPageName("settings")}
                >
                  <div className="flex h-6 w-6 items-center justify-center">
                    <FaCog size={18} />
                  </div>
                  {!collapsed && (
                    <span className="text-sm font-medium">Settings</span>
                  )}
                </Link>
              </li>

              <li>
                <button
                  onClick={handleLogout}
                  className={`group flex w-full items-center gap-3 rounded-lg px-4 py-3 
                  font-medium text-white/90 transition-all duration-200 hover:bg-red-500/20 hover:text-red-200
                  ${pageName === "logout" ? "bg-red-500/20 text-red-200" : ""}`}
                >
                  <div className="flex h-6 w-6 items-center justify-center">
                    <FaSignOutAlt size={18} />
                  </div>
                  {!collapsed && (
                    <span className="text-sm font-medium">Logout</span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </aside>
      </ClickOutside>
    </>
  );
};

export default Sidebar;