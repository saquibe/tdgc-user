"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import axios from "axios";

type ProfileField = {
  label: string;
  value: string;
  editable?: boolean;
};

const editableLabels = ["Email ID", "Mobile No."];

export default function Profile() {
  const [fields, setFields] = useState<ProfileField[]>([]);
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const { data } = await axios.get(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = (data as any).data;
        console.log("Fetched user profile:", user);

        const profileFields: ProfileField[] = [
          {
            label: "Category",
            value: user.category || "N/A",
          },
          {
            label: "Membership No.",
            value: user.membership_no || "N/A",
          },
          {
            label: "Name in full",
            value: user.name_in_full || "N/A",
          },
          {
            label: "Gender",
            value: user.gender || "N/A",
          },
          {
            label: "Father’s Name",
            value: user.father_name || "N/A",
          },
          {
            label: "Mother’s Name",
            value: user.mother_name || "N/A",
          },
          {
            label: "Place, date & year of birth",
            value: user.place_dob || "N/A",
          },
          {
            label: "Nationality",
            value: user.nationality || "N/A",
          },
          {
            label: "Residential address with pin code",
            value: user.address || "N/A",
          },
          {
            label: "Description of Qualification/s",
            value: user.qualification_description || "N/A",
          },
          {
            label: "Email ID",
            value: user.email || "N/A",
            editable: true,
          },
          {
            label: "Mobile No.",
            value: user.mobile_number || "N/A",
            editable: true,
          },
          {
            label: "Aadhaar Card No.",
            value: user.aadhaar_number || "N/A",
          },
          {
            label: "PAN No.",
            value: user.pan_number || "N/A",
          },
        ];

        setFields(profileFields);
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    }

    fetchProfile();
  }, []);

  const handleEditClick = (label: string, value: string) => {
    setEditingLabel(label);
    setTempValue(value);
  };

  const handleCancel = () => {
    setEditingLabel(null);
    setTempValue("");
  };

  const handleUpdate = () => {
    if (editingLabel != null) {
      // Optionally send PATCH/PUT request here to update backend data

      setFields((prev) =>
        prev.map((field) =>
          field.label === editingLabel ? { ...field, value: tempValue } : field
        )
      );
      setEditingLabel(null);
    }
  };

  return (
    <div>
      {/* <h2 className="text-green-700 font-semibold text-xl mb-4">My Profile</h2> */}
      <div className="space-y-4">
        {fields.map(({ label, value, editable }) => (
          <div
            key={label}
            className="flex flex-col sm:flex-row sm:items-start justify-between"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-2 w-full">
              <span className="font-medium text-gray-600 sm:w-64">{label}</span>
              {editingLabel === label ? (
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full">
                  <input
                    type="text"
                    className="border border-gray-300 rounded px-2 py-1 text-sm font-semibold text-gray-900 w-full sm:w-auto"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                    <button
                      className="px-3 py-1 text-sm bg-gray-400 text-white rounded hover:bg-gray-500"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full sm:w-auto">
                  <span className="text-gray-900 font-semibold break-words">
                    {value || "N/A"}
                  </span>
                  {editable && (
                    <button
                      className="text-blue-600 hover:text-blue-800 ml-2"
                      onClick={() => handleEditClick(label, value)}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
