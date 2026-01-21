"use client";

import { FileCheck, File, CreditCard, Calendar } from "lucide-react";

export default function DashboardStats() {
  const stats = [
    {
      title: "Pending Applications",
      value: "2",
      icon: FileCheck,
      color: "bg-blue-500",
      change: "+1 from last month",
    },
    {
      title: "Active Certificates",
      value: "3",
      icon: File,
      color: "bg-green-500",
      change: "Valid until 2024",
    },
    {
      title: "Due Payments",
      value: "₹5,000",
      icon: CreditCard,
      color: "bg-amber-500",
      change: "Due in 15 days",
    },
    {
      title: "Upcoming Appointments",
      value: "1",
      icon: Calendar,
      color: "bg-purple-500",
      change: "Next week",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <Icon
                  className={`w-6 h-6 ${stat.color.replace("bg-", "text-")}`}
                />
              </div>
              <span className="text-xs font-medium text-gray-500">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
          </div>
        );
      })}
    </div>
  );
}
