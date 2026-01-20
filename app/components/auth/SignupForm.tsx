"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReCAPTCHA from "react-google-recaptcha";
import { Eye, EyeOff } from "lucide-react";

type FormData = {
  fullName: string;
  email: string;
  confirmEmail: string;
  mobile: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    confirmEmail: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [captcha, setCaptcha] = useState<string | null>(null); // State for reCAPTCHA token
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let filteredValue = value;

    if (id === "fullName") {
      filteredValue = value.replace(/[^A-Za-z\s]/g, "");
    } else if (id === "mobile") {
      filteredValue = value.replace(/[^0-9]/g, "").slice(0, 10);
    }

    setForm((prev) => ({ ...prev, [id]: filteredValue }));
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (!/^[A-Za-z\s]{2,}$/.test(form.fullName)) {
      newErrors.fullName = "Name must be at least 2 letters.";
    }

    if (!form.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit Indian mobile number";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.confirmEmail.trim()) {
      newErrors.confirmEmail = "Please confirm your email";
    } else if (form.confirmEmail !== form.email) {
      newErrors.confirmEmail = "Email addresses do not match";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/.test(form.password)
    ) {
      newErrors.password =
        "Must include uppercase, lowercase, number & special char";
    }

    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form fields first
    const validationErrors = validate();
    setErrors(validationErrors);
    setApiError(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Check if reCAPTCHA is completed
    // if (!captcha) {
    //   setApiError("Please complete the reCAPTCHA.");
    //   return;
    // }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: form.fullName,
            email: form.email,
            mobile_number: form.mobile,
            password: form.password,
            confirm_password: form.confirmPassword,
            captcha, // Send the reCAPTCHA token to the backend
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.error || "Signup failed. Please try again.");
        return;
      }
      router.push("/login?signup=success");
    } catch (error) {
      console.error("Error during signup:", error);
      setApiError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto space-y-2.5 px-2 font-poppins bg-[#FFFFFF]"
    >
      <h1 className="text-3xl text-header font-semibold text-[#00694A] text-center">
        Sign Up
      </h1>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-label mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="fullName"
          placeholder="Enter full name"
          className="text-placeholder"
          value={form.fullName}
          onChange={handleChange}
        />
        {errors.fullName && (
          <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-label mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter email"
          className="text-placeholder"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email}</p>
        )}
      </div>

      {/* Confirm Email */}
      <div className="mt-4">
        <label htmlFor="confirmEmail" className="block text-label mb-2">
          Confirm Email <span className="text-red-500">*</span>
        </label>
        <Input
          id="confirmEmail"
          type="email"
          placeholder="Re-enter email"
          className="text-placeholder"
          value={form.confirmEmail}
          onChange={(e) => setForm({ ...form, confirmEmail: e.target.value })}
        />
        {errors.confirmEmail && (
          <p className="text-sm text-red-600 mt-1">{errors.confirmEmail}</p>
        )}
      </div>

      {/* Mobile */}
      <div>
        <label htmlFor="mobile" className="block text-label mb-2">
          Mobile <span className="text-red-500">*</span>
        </label>
        <Input
          id="mobile"
          placeholder="Enter mobile number"
          className="text-placeholder"
          value={form.mobile}
          onChange={handleChange}
        />
        {errors.mobile && (
          <p className="text-sm text-red-600 mt-1">{errors.mobile}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-label mb-2">
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
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.password && (
          <p className="text-sm text-red-600 mt-1">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-label mb-2">
          Confirm Password <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            className="text-placeholder pr-10"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      {/* ReCAPTCHA */}
      <div>
        <label className="block text-label mb-2">reCAPTCHA</label>
        <ReCAPTCHA
          sitekey="6LdlELgrAAAAAHRHGEmAVyWPLBjsVqcUgQg3U3QT"
          // sitekey="your_site_key_here"
          onChange={(val) => setCaptcha(val)} // Update state on completion
        />
      </div>

      {/* Terms & Conditions */}
      <div className="flex items-start space-x-2">
        <input id="agree" type="checkbox" required className="mt-1" />
        <label
          htmlFor="agree"
          className="text-paragraph font-normal leading-snug"
        >
          I agree to all{" "}
          <span className="text-[#00694A] hover:underline cursor-pointer text-xs">
            Read the T&C of TDC
          </span>
        </label>
      </div>

      {/* Display errors from backend */}
      {apiError && <p className="text-sm text-red-600 mt-1">{apiError}</p>}

      {/* Submit */}
      <Button
        type="submit"
        className="w-full bg-[#00694A] hover:bg-[#008562] text-white"
        disabled={isSubmitting} // Disable button while submitting or until captcha is done
      >
        {isSubmitting ? "Signing Up..." : "Sign Up"}
      </Button>

      {/* Route Switch */}
      <div className="text-center mt-6 text-paragraph font-medium">
        Already have an account?
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-[#00694A] font-semibold hover:underline ml-1 cursor-pointer"
        >
          Login now
        </button>
      </div>
    </form>
  );
}
