"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Validate token on component mount
  useEffect(() => {
    if (token) {
      // You could add a token validation API call here if needed
      setIsValidToken(true);
    } else {
      setIsValidToken(false);
      setTokenError("Invalid or missing reset token");
    }
  }, [token]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation (matches your signup validation)
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/.test(form.password)
    ) {
      newErrors.password =
        "Password must include uppercase, lowercase, number & special character";
    }

    // Confirm password validation
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            confirm_password: form.confirmPassword,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setErrors({ api: result.error || "Failed to reset password" });
        if (
          result.error?.includes("expired") ||
          result.error?.includes("invalid")
        ) {
          setTokenError("This reset link has expired or is invalid.");
        }
        return;
      }

      // Success - redirect to login with success message
      router.push("/login?reset=success");
    } catch (err) {
      console.error("Reset Password Error:", err);
      setErrors({ api: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If token is invalid, show error message
  if (isValidToken === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-semibold text-red-600 mb-4">
              Invalid Reset Link
            </h1>
            <p className="text-gray-600 mb-6">
              {tokenError ||
                "This password reset link is invalid or has expired."}
            </p>
            <Button
              onClick={() => router.push("/forgot-password")}
              className="w-full bg-[#00694A] hover:bg-[#008562] text-white"
            >
              Request New Reset Link
            </Button>
            <div className="mt-4 text-sm">
              <button
                onClick={() => router.push("/login")}
                className="text-[#00694A] hover:underline"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md mx-auto">
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-4 p-6 bg-white rounded-lg shadow-md font-poppins"
        >
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-[#00694A] mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600 text-sm">
              Enter your email and new password below.
            </p>
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-label font-normal mb-2"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your registered email"
              className="text-placeholder"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-label font-normal mb-2"
            >
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="text-placeholder pr-10"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Must include uppercase, lowercase, number & special character
            </p>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-label font-normal mb-2"
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="text-placeholder pr-10"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* API Error Message */}
          {errors.api && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm font-medium">{errors.api}</p>
            </div>
          )}

          {/* Token Error Message */}
          {tokenError && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-600 text-sm font-medium">
                {tokenError}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full text-button font-medium bg-[#00694A] hover:bg-[#008562] text-white mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting Password..." : "Reset Password"}
          </Button>

          {/* Navigation Links */}
          <div className="text-center space-y-3 pt-4">
            <div className="text-sm">
              <span className="text-gray-600">Remember your password? </span>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-[#00694A] hover:underline font-semibold cursor-pointer"
              >
                Login here
              </button>
            </div>

            <div className="text-sm">
              <span className="text-gray-600">Need a new reset link? </span>
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="text-[#00694A] hover:underline font-semibold cursor-pointer"
              >
                Request another
              </button>
            </div>
          </div>
        </form>

        {/* Password Requirements */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Password Requirements:
          </h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className="flex items-center">
              <span
                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  form.password.length >= 8 ? "bg-green-500" : "bg-gray-300"
                }`}
              ></span>
              At least 8 characters
            </li>
            <li className="flex items-center">
              <span
                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  /[A-Z]/.test(form.password) ? "bg-green-500" : "bg-gray-300"
                }`}
              ></span>
              One uppercase letter
            </li>
            <li className="flex items-center">
              <span
                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  /[a-z]/.test(form.password) ? "bg-green-500" : "bg-gray-300"
                }`}
              ></span>
              One lowercase letter
            </li>
            <li className="flex items-center">
              <span
                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  /\d/.test(form.password) ? "bg-green-500" : "bg-gray-300"
                }`}
              ></span>
              One number
            </li>
            <li className="flex items-center">
              <span
                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  /[\W_]/.test(form.password) ? "bg-green-500" : "bg-gray-300"
                }`}
              ></span>
              One special character
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
