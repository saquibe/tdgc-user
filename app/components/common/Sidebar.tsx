"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Home,
  FileText,
  Bell,
  User,
  File,
  RefreshCw,
  Award,
  FileCheck,
  Calendar,
  CreditCard,
  Megaphone,
  CalendarDays,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: Home,
    exact: true,
  },
  {
    label: "Application Form",
    path: "/dashboard/application-form",
    icon: FileText,
  },
  {
    label: "Note from Council",
    path: "/dashboard/note-from-council",
    icon: Bell,
  },
  {
    label: "My Profile",
    path: "/dashboard/myprofile",
    icon: User,
  },
  {
    label: "My Certificate",
    path: "/dashboard/certificates",
    icon: File,
  },
  {
    label: "Renewal",
    path: "/dashboard/renewal",
    icon: RefreshCw,
  },
  {
    label: "Good Standing Certificates",
    path: "/dashboard/gsc",
    icon: Award,
  },
  {
    label: "No Objection Certificate",
    path: "/dashboard/noc",
    icon: FileCheck,
  },
  {
    label: "Appointment",
    icon: Calendar,
    isDropdown: true,
    children: [
      { label: "Registration", path: "/dashboard/appointments/registration" },
      { label: "Renewal (Tatkal)", path: "/dashboard/appointments/renewal" },
      {
        label: "Good Standing Certificates",
        path: "/dashboard/appointments/gsc",
      },
      {
        label: "No Objection Certificate",
        path: "/dashboard/appointments/noc",
      },
    ],
  },
  {
    label: "Payments",
    path: "/dashboard/payment",
    icon: CreditCard,
  },
  {
    label: "Announcements",
    path: "/dashboard/announcements",
    icon: Megaphone,
  },
  {
    label: "Events",
    path: "/dashboard/events",
    icon: CalendarDays,
  },
];

export default function Sidebar({ isOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-close dropdown on mobile when clicking outside
  useEffect(() => {
    if (window.innerWidth < 768) {
      const handleClickOutside = () => {
        setOpenDropdown(null);
      };

      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, []);

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  const isActive = (itemPath: string, exact: boolean = false) => {
    if (exact) {
      return pathname === itemPath;
    }
    return pathname.startsWith(itemPath);
  };

  // Get user info from localStorage
  const getUserInfo = () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
    return {
      full_name: "Dr. MADISHETTI ABHILASH",
      qualification: "Bachelor of Dental Surgery (BDS)",
    };
  };

  const user = getUserInfo();

  if (!isOpen) {
    return (
      <div className="fixed top-20 left-0 h-[calc(100vh-5rem)] w-16 bg-white shadow p-2 font-poppins z-40 hidden md:flex flex-col items-center">
        {menuItems.slice(0, 8).map((item) => (
          <button
            key={item.label}
            onClick={() => item.path && router.push(item.path)}
            className={`p-3 rounded-lg mb-1 transition-colors ${
              isActive(item.path || "", item.exact)
                ? "bg-blue-100 text-[#00694A]"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    );
  }

  return (
    <aside className="fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-white shadow p-6 font-poppins z-40 hidden md:flex flex-col overflow-y-auto">
      {/* Profile Info */}
      <div className="text-center mb-8 pb-6 border-b">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00694A] to-[#008562] flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
          {user?.full_name?.charAt(0) || "U"}
        </div>
        <h3 className="text-sm font-semibold text-gray-800 leading-tight">
          {user?.full_name || "User"}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {user?.qualification || "Professional"}
        </p>
      </div>

      {/* Menu */}
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          if (item.isDropdown) {
            return (
              <div key={item.label} className="mb-1">
                <button
                  type="button"
                  onClick={() => toggleDropdown(item.label)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    openDropdown === item.label
                      ? "bg-blue-50 text-[#00694A]"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {openDropdown === item.label ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {openDropdown === item.label && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children?.map((child) => (
                      <button
                        key={child.label}
                        onClick={() => router.push(child.path)}
                        className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          isActive(child.path)
                            ? "bg-[#00694A]/10 text-[#00694A] font-medium"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={item.label}
              onClick={() => item.path && router.push(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path || "", item.exact)
                  ? "bg-blue-100 text-[#00694A] font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {/* <div className="pt-6 border-t mt-6">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">Need help?</p>
          <button
            onClick={() => router.push("/support")}
            className="text-sm text-[#00694A] hover:underline font-medium"
          >
            Contact Support
          </button>
        </div>
      </div> */}
    </aside>
  );
}
