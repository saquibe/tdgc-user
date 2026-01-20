"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Something went wrong. Please try again.");
        return;
      }

      // Always show success message (security best practice)
      setMessage(
        "If your email is registered, you will receive a password reset link within a few minutes. Please check your inbox and spam folder."
      );

      // Clear form
      setEmail("");
    } catch (err) {
      console.error("Forgot Password Error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-4 p-6 font-poppins"
        >
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-[#00694A] mb-2">
              Forgot Password
            </h1>
            <p className="text-gray-600 text-sm">
              Enter your email address and we'll send you a link to reset your
              password.
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600 text-sm font-medium">{message}</p>
              <p className="text-gray-600 text-xs mt-1">
                The reset link will expire in 15 minutes.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full text-button font-medium bg-[#00694A] hover:bg-[#008562] text-white mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
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
              <span className="text-gray-600">Don't have an account? </span>
              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="text-[#00694A] hover:underline font-semibold cursor-pointer"
              >
                Sign up
              </button>
            </div>
          </div>
        </form>

        {/* Additional Info */}
        {/* <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Having trouble? Contact support at{" "}
            <a
              href="mailto:support@tdc.com"
              className="text-[#00694A] hover:underline"
            >
              support@tdc.com
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
}
