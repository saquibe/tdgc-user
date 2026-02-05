// app/components/dashboard/ApplicationForm/MultiStepForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";

import BasicDetails from "./BasicDetails";
import ConditionalFields from "./ConditionalFields";
import FormReview from "./FormReview";
import Payment from "./Payment";
import FormStepper from "./FormStepper";
import { loadRazorpay } from "@/lib/razorpay";

import type { Step1FormValues } from "./BasicDetails";
import type { Step2FormValues } from "./ConditionalFields";
import { Button } from "@/components/ui/button";

// Define TypeScript interfaces for API responses
interface RazorpayOrderResponse {
  success: boolean;
  message: string;
  order: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  };
  payment_id?: string;
  error?: string;
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  [key: string]: any; // Allow other properties
}

interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  payment: {
    id: string;
    order_id: string;
    payment_id: string;
    amount: number;
    status: string;
    currency: string;
  };
  error?: string;
}

interface RegistrationResponse {
  success: boolean;
  message: string;
  data?: {
    application_id: string;
    temporary_id: string;
    payment_id: string;
    status: string;
    amount_paid: number;
  };
  error?: string;
}

type FullFormData = Step1FormValues & Partial<Step2FormValues>;
type FormState = Partial<FullFormData> & {
  registrationCategory?: string;
  amount?: number;
};

export default function MultiStepForm() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormState>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");

  const methods = useForm<FullFormData>();

  // Load Razorpay script
  useEffect(() => {
    loadRazorpay().then((loaded) => {
      setRazorpayLoaded(loaded);
      if (!loaded) {
        console.error("Failed to load Razorpay script");
      }
    });
  }, []);

  useEffect(() => {
    console.log("🔍 formData state updated:", {
      keys: Object.keys(formData),
      fileUploads: Object.entries(formData)
        .filter(([key, value]) => value instanceof File)
        .map(([key, value]) => ({
          field: key,
          filename: (value as File).name,
          size: (value as File).size,
        })),
      hasAadhaarUpload: !!formData.aadhaar_upload,
      hasPanUpload: !!formData.pan_upload,
      hasSignUpload: !!formData.sign_upload,
    });
  }, [formData]);

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => prev - 1);

  // In MultiStepForm.tsx - Update handleStep1 to get ALL form values
  const handleStep1 = (
    data: Step1FormValues & { registrationCategory?: string },
  ) => {
    console.log("✅ Step 1 data received with files:", {
      textFields: Object.keys(data).filter((key) => !key.includes("upload")),
      fileFields: Object.keys(data)
        .filter((key) => key.includes("upload"))
        .map((key) => ({
          field: key,
          hasFile: !!data[key as keyof typeof data],
          isFile: data[key as keyof typeof data] instanceof File,
        })),
    });

    // Update formData with ALL Step 1 data
    setFormData((prev) => {
      const newData = { ...prev, ...data };
      console.log("🔄 Updated formData after Step 1:", {
        keys: Object.keys(newData),
        hasFiles: Object.keys(newData).filter(
          (key) =>
            key.includes("upload") &&
            (newData as Record<string, any>)[key] instanceof File,
        ),
      });
      return newData;
    });

    // Also update react-hook-form with the data
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        methods.setValue(key as any, value);
      }
    });

    setStep(2);
  };

  const handleStep2: SubmitHandler<Partial<Step2FormValues>> = (data) => {
    console.log("✅ Step 2 data received:", data);

    // Update formData with Step 2 data
    setFormData((prev) => {
      const newData = { ...prev, ...data };
      console.log("🔄 Updated formData after Step 2:", {
        keys: Object.keys(newData),
        allFiles: Object.keys(newData)
          .filter((key) => newData[key] instanceof File)
          .map((key) => ({
            field: key,
            filename: (newData[key] as File)?.name,
          })),
      });
      return newData;
    });

    // Calculate amount
    const amount = calculateAmount(
      formData.regtype || "Regular (By Post - Fee includes postal charges)",
      formData.registrationCategory || "",
    );

    setFormData((prev) => ({ ...prev, amount }));
    setStep(3);
  };

  const calculateAmount = (regtype: string, category: string): number => {
    // Default amount - you can implement dynamic calculation
    return 2000;
  };

  // Create Razorpay order
  const createOrder = async (
    amount: number,
    currency: string = "INR",
  ): Promise<RazorpayOrderResponse> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const response = await axios.post<RazorpayOrderResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-order`,
        { amount, currency },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to create order");
      }

      return response.data;
    } catch (error: any) {
      console.error("Order creation failed:", error);
      throw new Error(
        error.response?.data?.error ||
          error.message ||
          "Failed to create order",
      );
    }
  };

  // Initialize Razorpay payment
  const initializeRazorpayPayment = async () => {
    if (!razorpayLoaded) {
      alert("Payment gateway is still loading. Please wait a moment.");
      return;
    }

    if (!(window as any).Razorpay) {
      alert("Razorpay is not available. Please refresh the page.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmissionError(null);

      // Create order
      const amount = formData.amount || 2000;
      const orderData = await createOrder(amount);
      console.log("✅ Order created:", orderData);
      setOrderId(orderData.order.id);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Telangana Dental Council",
        description: `Registration Fee for ${formData.registrationCategory || "Registration"}`,
        image: "/logo.png",
        order_id: orderData.order.id,
        handler: async (response: any) => {
          console.log("💰 Payment handler called with response:", response);

          // Extract payment details (handling both snake_case and camelCase)
          const paymentResponse: RazorpayPaymentResponse = {
            razorpay_order_id:
              response.razorpay_order_id ||
              response.razorpayOrderId ||
              response.order_id ||
              response.orderId,
            razorpay_payment_id:
              response.razorpay_payment_id ||
              response.razorpayPaymentId ||
              response.payment_id ||
              response.paymentId,
            razorpay_signature:
              response.razorpay_signature ||
              response.razorpaySignature ||
              response.signature,
          };

          console.log("📋 Extracted payment details:", paymentResponse);

          // Check if we have all required fields
          if (
            !paymentResponse.razorpay_order_id ||
            !paymentResponse.razorpay_payment_id ||
            !paymentResponse.razorpay_signature
          ) {
            console.error(
              "❌ Missing payment verification fields:",
              paymentResponse,
            );
            setSubmissionError(
              "Invalid payment response from gateway. Please contact support.",
            );
            setIsSubmitting(false);
            return;
          }

          // Verify payment on backend
          await verifyPayment(paymentResponse);
        },
        prefill: {
          name:
            `${formData.f_name || ""} ${formData.l_name || ""}`.trim() ||
            "Applicant",
          email: formData.email || "",
          contact: formData.mobile_number || "",
        },
        notes: {
          registration_category: formData.registrationCategory,
          application_type: "New Registration",
          temporary_id: orderId,
        },
        theme: {
          color: "#00694A",
        },
        modal: {
          ondismiss: () => {
            console.log("Payment modal dismissed");
            setIsSubmitting(false);
          },
          escape: false,
        },
      };

      console.log("🎯 Razorpay options:", options);

      const rzp = new (window as any).Razorpay(options);

      // Add error handlers
      rzp.on("payment.failed", function (response: any) {
        console.error("❌ Payment failed:", response.error);
        setSubmissionError(
          `Payment failed: ${response.error.description || response.error.reason || "Unknown error"}`,
        );
        setIsSubmitting(false);
      });

      rzp.on("payment.error", function (response: any) {
        console.error("❌ Payment error:", response);
        setSubmissionError("An error occurred during payment processing.");
        setIsSubmitting(false);
      });

      rzp.open();
    } catch (error: any) {
      console.error("Payment initialization failed:", error);
      setSubmissionError(
        error.message || "Failed to initialize payment. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  // Verify payment after success
  const verifyPayment = async (paymentResponse: RazorpayPaymentResponse) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      console.log("🔍 Verifying payment with backend...");

      const verificationResponse =
        await axios.post<PaymentVerificationResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/payments/verify`,
          paymentResponse,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

      console.log("📋 Verification response:", verificationResponse.data);

      if (verificationResponse.data.success) {
        setPaymentSuccess(true);
        // Submit form data with payment details
        await submitApplication(verificationResponse.data.payment);
      } else {
        throw new Error(
          verificationResponse.data.error || "Payment verification failed",
        );
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);

      let errorMessage = "Payment verification failed. ";
      if (error.response?.data?.error) {
        errorMessage += error.response.data.error;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += "Please contact support.";
      }

      setSubmissionError(errorMessage);
      setIsSubmitting(false);
    }
  };

  // Submit application with payment details
  const submitApplication = async (paymentDetails: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      console.log("📄 Submitting application...");
      console.log("📋 Current formData:", {
        keys: Object.keys(formData),
        files: Object.entries(formData)
          .filter(([_, value]) => value instanceof File)
          .map(([key, value]) => ({
            field: key,
            filename: (value as File).name,
          })),
      });

      const dataToSubmit = new FormData();

      // Append ALL data from formData
      Object.entries(formData).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          return; // Skip empty values
        }

        if (value instanceof File) {
          dataToSubmit.append(key, value);
          console.log(`📁 Added file: ${key} = ${value.name}`);
        } else {
          dataToSubmit.append(key, String(value));
          console.log(`📝 Added text: ${key} = ${value}`);
        }
      });

      // Check for required files
      const requiredFiles = ["pan_upload", "aadhaar_upload", "sign_upload"];
      const missingFiles = requiredFiles.filter(
        (file) => !dataToSubmit.has(file),
      );

      if (missingFiles.length > 0) {
        console.error("❌ Missing required files:", missingFiles);
        console.log("📋 Current FormData fields:");
        for (let [key] of dataToSubmit.entries()) {
          console.log(`  - ${key}`);
        }

        throw new Error(
          `Missing required files: ${missingFiles.join(", ")}. Please go back and upload them.`,
        );
      }

      // Append payment details
      dataToSubmit.append("payment_id", paymentDetails.payment_id);
      dataToSubmit.append("order_id", paymentDetails.order_id);
      dataToSubmit.append("payment_status", "completed");

      // Log everything being sent
      console.log("📦 Final FormData being sent:");
      const fields = [];
      for (let [key, value] of dataToSubmit.entries()) {
        fields.push(key);
        if (value instanceof File) {
          console.log(
            `  "${key}" => File: ${value.name} (${value.size} bytes)`,
          );
        } else {
          console.log(`  "${key}" => ${value}`);
        }
      }
      console.log("📋 Total fields sent:", fields.length);

      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post<RegistrationResponse>(
        `${API_URL}/api/users/register`,
        dataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          timeout: 60000,
        },
      );

      console.log("✅ Registration response:", response.data);

      if (response.data.success) {
        localStorage.setItem(
          "lastApplication",
          JSON.stringify({
            temporary_id: response.data.data?.temporary_id,
            payment_id: response.data.data?.payment_id,
            amount: formData.amount,
            registrationCategory: formData.registrationCategory,
            timestamp: new Date().toISOString(),
          }),
        );

        alert("Registration submitted successfully!");
        router.push("/dashboard/application-form/submission-success");
      } else {
        throw new Error(response.data.error || "Submission failed");
      }
    } catch (error: any) {
      console.error("Form submission failed:", error);

      let errorMessage = "Failed to submit application. ";
      if (error.response?.data?.error) {
        errorMessage += error.response.data.error;
        if (error.response.data.missing) {
          errorMessage += `\nMissing files: ${error.response.data.missing.join(", ")}`;
        }
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += "Please contact support.";
      }

      setSubmissionError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentProceed = () => {
    initializeRazorpayPayment();
  };

  const steps = [
    { label: "Fill Basic Details" },
    { label: "Upload Details" },
    { label: "Review & Confirm" },
    { label: "Confirm & Pay" },
  ];

  const transitionVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#00694A] font-francois-one mb-6 pb-2 text-center">
        Application Form
      </h1>

      {/* SINGLE FormProvider for entire form */}
      <FormProvider {...methods}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={transitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35 }}
          >
            <div>
              <FormStepper currentStep={step} steps={steps} />

              {submissionError && (
                <div className="p-4 mb-4 text-red-600 bg-red-100 rounded">
                  <div className="font-semibold">Error:</div>
                  <div>{submissionError}</div>
                  <button
                    onClick={() => setSubmissionError(null)}
                    className="mt-2 text-sm text-blue-600 hover:underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {paymentSuccess && (
                <div className="p-4 mb-4 text-green-600 bg-green-100 rounded">
                  <div className="font-semibold">Success!</div>
                  <div>Payment verified. Submitting your application...</div>
                </div>
              )}

              {step === 1 && (
                <BasicDetails
                  onNext={handleStep1}
                  defaultValues={formData as Step1FormValues}
                />
              )}

              {step === 2 && (
                <form onSubmit={methods.handleSubmit(handleStep2)}>
                  <ConditionalFields
                    registrationCategory={formData.registrationCategory ?? ""}
                    onBack={goBack}
                    onNext={goNext}
                    defaultValues={formData as Step2FormValues}
                  />
                  <div className="md:col-span-2 flex flex-col sm:flex-row justify-center gap-4 pt-6">
                    <Button
                      type="button"
                      onClick={goBack}
                      className="bg-[#8B0000] hover:bg-[#6b0000] text-white"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#00694A] hover:bg-[#004d36] text-white"
                    >
                      Next
                    </Button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <>
                  <FormReview data={formData as FullFormData} />
                  <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                    <Button
                      type="button"
                      onClick={goBack}
                      className="bg-[#8B0000] hover:bg-[#6b0000] text-white"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={goNext}
                      className="bg-[#00694A] hover:bg-[#004d36] text-white"
                    >
                      Proceed to Payment
                    </Button>
                  </div>
                </>
              )}

              {step === 4 && (
                <Payment
                  amount={formData.amount || 2000}
                  registrationCategory={formData.registrationCategory || ""}
                  applicantName={
                    `${formData.f_name || ""} ${formData.l_name || ""}`.trim() ||
                    "Applicant"
                  }
                  onPayment={handlePaymentProceed}
                  onBack={goBack}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </FormProvider>
    </div>
  );
}
