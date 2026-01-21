"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import DashboardHeader from "@/app/components/common/DashboardHeader";
import Sidebar from "@/app/components/common/Sidebar";
import MobileSidebar from "@/app/components/common/MobileSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true); // Open sidebar by default on desktop
      } else {
        setIsSidebarOpen(false); // Closed by default on mobile
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen">
      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Header */}
      <DashboardHeader
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex pt-20">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div
            className={`transition-all duration-300 ${
              isSidebarOpen ? "w-0" : "w-16"
            }`}
          >
            <Sidebar isOpen={isSidebarOpen} />
          </div>
        )}

        {/* Mobile Sidebar */}
        {isMobile && (
          <MobileSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            !isMobile && isSidebarOpen ? "md:ml-64" : "md:ml-0"
          }`}
        >
          <div className="p-4 md:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm min-h-[calc(100vh-7rem)] p-4 md:p-6"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
