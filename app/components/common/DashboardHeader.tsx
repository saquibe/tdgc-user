"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, Menu, X, Bell, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface DashboardHeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function DashboardHeader({
  toggleSidebar,
  isSidebarOpen,
}: DashboardHeaderProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    router.push("/login");
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
      email: "user@example.com",
    };
  };

  const user = getUserInfo();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full h-20 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between font-poppins shadow-sm">
      {/* Left: Logo and Menu Toggle */}
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5 text-gray-600" />
          ) : (
            <Menu className="w-5 h-5 text-gray-600" />
          )}
        </button>

        <div className="flex items-center space-x-3">
          <Image
            src="/images/header-logo1.png"
            alt="Telangana Dental Council Logo"
            width={isMobile ? 140 : 180}
            height={40}
            className="h-auto w-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* Center: Search (Desktop only) */}
      {/* {!isMobile && (
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00694A] focus:border-transparent"
            />
          </div>
        </div>
      )} */}

      {/* Right: Notification and Profile */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 focus:outline-none hover:bg-gray-100 rounded-full p-1 transition-colors"
            aria-expanded={open}
            aria-haspopup="true"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00694A] to-[#008562] flex items-center justify-center text-white font-semibold text-sm">
              {user?.full_name?.charAt(0) || "U"}
            </div>
            {!isMobile && (
              <>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800 leading-tight truncate max-w-[120px]">
                    {user?.full_name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[120px]">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
                <ChevronDown
                  className={`text-gray-600 w-4 h-4 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden">
              {/* User Info */}
              <div className="flex items-center space-x-3 px-4 py-3 border-b bg-gray-50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00694A] to-[#008562] flex items-center justify-center text-white font-bold text-lg">
                  {user?.full_name?.charAt(0) || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user?.full_name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={() => {
                    router.push("/dashboard/myprofile");
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 text-gray-700 flex items-center gap-3 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile Settings
                </button>

                <button
                  onClick={() => {
                    router.push("/dashboard/settings");
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 text-gray-700 flex items-center gap-3 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Settings
                </button>

                <div className="border-t my-2"></div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 text-red-600 font-medium flex items-center gap-3 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
