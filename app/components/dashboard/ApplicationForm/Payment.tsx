// app/components/dashboard/ApplicationForm/Payment.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

interface PaymentProps {
  amount: number;
  registrationCategory: string;
  applicantName: string;
  onPayment: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const Payment: React.FC<PaymentProps> = ({
  amount,
  registrationCategory,
  applicantName,
  onPayment,
  onBack,
  isSubmitting,
}) => {
  return (
    <div className="space-y-8">
      <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
        <p className="text-gray-700 text-lg mb-4">
          Dear <span className="font-medium">{applicantName}</span>,
        </p>
        <p className="text-gray-600 mb-4">
          You are about to proceed with the registration fee payment for:
        </p>
        <div className="mb-6 p-4 bg-white rounded border">
          <p className="font-medium text-gray-800">{registrationCategory}</p>
          <div className="mt-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Registration Fee</span>
              <span className="font-semibold">₹{amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-xl font-bold text-[#00694A]">
                ₹{amount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please ensure all details are correct before proceeding to
                payment. Once payment is made, it cannot be refunded.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Payment Methods:</h4>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-6 bg-blue-500 rounded"></div>
              <span className="text-sm">Credit/Debit Card</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-6 bg-green-500 rounded"></div>
              <span className="text-sm">Net Banking</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-6 bg-purple-500 rounded"></div>
              <span className="text-sm">UPI</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-6 bg-orange-500 rounded"></div>
              <span className="text-sm">Wallet</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
        <Button
          type="button"
          onClick={onBack}
          className="bg-[#8B0000] hover:bg-[#6b0000] text-white"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onPayment}
          className="bg-[#00694A] hover:bg-[#004d36] text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ₹${amount.toLocaleString()}`
          )}
        </Button>
      </div>

      <div className="text-center text-sm text-gray-500 mt-8">
        <p>
          By proceeding, you agree to our Terms of Service and Privacy Policy.
          Payment is processed securely via Razorpay.
        </p>
      </div>
    </div>
  );
};

export default Payment;
