"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReCAPTCHA from "react-google-recaptcha";
import { Eye, EyeOff } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

type LoginData = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [captcha, setCaptcha] = useState<string | null>(null); // State for reCAPTCHA token
  const [showPassword, setShowPassword] = useState(false);

  // Check for success messages from signup or password reset
  useEffect(() => {
    const signupSuccess = searchParams.get("signup");
    const resetSuccess = searchParams.get("reset");

    if (signupSuccess) {
      toast.success("Signup successful! Please login with your credentials.", {
        duration: 5000,
        position: "top-center",
      });
      // Clean the URL by removing the query parameter
      router.replace("/login");
    }

    if (resetSuccess) {
      toast.success(
        "Password reset successful! Please login with your new password.",
        {
          duration: 5000,
          position: "top-center",
        }
      );
      // Clean the URL by removing the query parameter
      router.replace("/login");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Check if reCAPTCHA is completed
    // if (!captcha) {
    //   setError("Please complete the reCAPTCHA.");
    //   return;
    // }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            // captcha, // Send the reCAPTCHA token to the backend
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.error || "Login failed. Please check your credentials."
        );
        return;
      }

      // Login was successful!
      if (typeof window !== "undefined" && result.token) {
        localStorage.setItem("token", result.token);

        // Optionally store user info
        localStorage.setItem("user", JSON.stringify(result.user));

        // Show success message
        toast.success("Login successful! Redirecting...", {
          duration: 3000,
          position: "top-center",
        });

        // Delay redirect slightly to show success message
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("An unexpected error occurred. Please try again later.");
      toast.error("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Toast Notifications Container */}
      <Toaster
        toastOptions={{
          style: {
            background: "#00694A",
            color: "#fff",
            borderRadius: "8px",
          },
          success: {
            iconTheme: {
              primary: "#fff",
              secondary: "#00694A",
            },
          },
          error: {
            style: {
              background: "#dc2626",
              color: "#fff",
            },
          },
        }}
      />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto space-y-4 px-2 font-poppins bg-[#FFFFFF]"
      >
        <h1 className="text-3xl text-header font-semibold text-[#00694A] text-center">
          Login
        </h1>

        {/* Success Banner (optional alternative to toast) */}
        {searchParams.get("signup") && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600 text-sm font-medium">
              Signup successful! Please login with your credentials.
            </p>
          </div>
        )}

        {searchParams.get("reset") && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600 text-sm font-medium">
              Password reset successful! Please login with your new password.
            </p>
          </div>
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-label font-normal mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email"
            className="text-placeholder"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            disabled={isSubmitting}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label
            htmlFor="password"
            className="block text-label font-normal mb-2"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
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
              disabled={isSubmitting}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="text-right text-sm mt-1">
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-[#00694A] hover:underline font-medium cursor-pointer"
            disabled={isSubmitting}
          >
            Forgot Password?
          </button>
        </div>

        {/* ReCAPTCHA */}
        <div>
          <label className="block text-label font-normal mb-2">reCAPTCHA</label>
          <ReCAPTCHA
            sitekey="6LdlELgrAAAAAHRHGEmAVyWPLBjsVqcUgQg3U3QT"
            // sitekey="your_site_key_here"
            onChange={(val) => setCaptcha(val)} // Update state on completion
          />
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full text-button font-medium bg-[#00694A] hover:bg-[#008562] text-white mt-10"
          disabled={isSubmitting} // Disable button while submitting or until captcha is done
        >
          {isSubmitting ? "Logging In..." : "Login"}
        </Button>

        {/* Route Switch */}
        <div className="text-center mt-6 text-paragraph font-medium">
          Don't have an account?
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="text-[#00694A] ml-1 hover:underline font-semibold cursor-pointer"
            disabled={isSubmitting}
          >
            Signup now
          </button>
        </div>
      </form>
    </>
  );
}
