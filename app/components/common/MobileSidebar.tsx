"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  FileText,
  Bell,
  User,
  RefreshCw,
  File,
  Award,
  FileCheck,
  Calendar,
  CreditCard,
  Megaphone,
  CalendarDays,
  X,
} from "lucide-react";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: Home, exact: true },
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
  { label: "My Profile", path: "/dashboard/myprofile", icon: User },
  {
    label: "My Certificate",
    path: "/dashboard/certificates",
    icon: File,
  },
  { label: "Renewal", path: "/dashboard/renewal", icon: RefreshCw },
  { label: "Good Standing Certificates", path: "/dashboard/gsc", icon: Award },
  {
    label: "No Objection Certificate",
    path: "/dashboard/noc",
    icon: FileCheck,
  },
  {
    label: "Appointment",
    icon: Calendar,
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
  { label: "Payments", path: "/dashboard/payment", icon: CreditCard },
  { label: "Announcements", path: "/dashboard/announcements", icon: Megaphone },
  { label: "Events", path: "/dashboard/events", icon: CalendarDays },
];

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 overflow-y-auto h-[calc(100vh-5rem)]">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              if (item.children) {
                return (
                  <div key={item.label} className="mb-2">
                    <div className="flex items-center gap-3 px-3 py-3 text-gray-700 font-medium">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    <div className="ml-8 space-y-1">
                      {item.children.map((child) => (
                        <button
                          key={child.label}
                          onClick={() => handleNavigation(child.path)}
                          className={`block w-full text-left px-3 py-2 rounded text-sm ${
                            pathname === child.path
                              ? "bg-[#00694A]/10 text-[#00694A] font-medium"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={item.label}
                  onClick={() => item.path && handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${
                    pathname === item.path
                      ? "bg-blue-100 text-[#00694A] font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Logout Button */}
          <div className="mt-8 pt-6 border-t">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.push("/login");
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-3 text-red-600 font-medium hover:bg-red-50 rounded-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
