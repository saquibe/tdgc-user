// app/(dashboard)/dashboard/application-form/submission-success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Printer, Home } from "lucide-react";
import Link from "next/link";

export default function SubmissionSuccessPage() {
  const router = useRouter();
  // const searchParams = useSearchParams();
  const [applicationDetails, setApplicationDetails] = useState<any>(null);

  useEffect(() => {
    // Fetch application details or get from localStorage
    const storedData = localStorage.getItem("lastApplication");
    if (storedData) {
      setApplicationDetails(JSON.parse(storedData));
    }
  }, []);

  const printApplication = () => {
    window.print();
  };

  const downloadReceipt = () => {
    // Implement PDF generation/download
    alert("Receipt download feature coming soon!");
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div>
        {/* Success Card */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Application Submitted Successfully!
          </h1>

          <p className="text-gray-600 mb-8">
            Your registration application has been submitted and is now under
            review. You will receive updates via email.
          </p>

          {/* Application Details */}
          {applicationDetails && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Application Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Application ID</p>
                  <p className="font-medium">
                    {applicationDetails.temporary_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-green-600">Pending Review</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Reference</p>
                  <p className="font-medium">{applicationDetails.payment_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount Paid</p>
                  <p className="font-medium">₹{applicationDetails.amount}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Registration Category</p>
                  <p className="font-medium">
                    {applicationDetails.registrationCategory}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          {/* <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              What happens next?
            </h3>
            <ul className="text-left space-y-2 text-blue-700">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Your application will be reviewed by the council</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>You will receive status updates via email</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Processing typically takes 7-10 working days</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>You can track your application in the dashboard</span>
              </li>
            </ul>
          </div> */}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={downloadReceipt}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>

            <Button
              onClick={printApplication}
              variant="outline"
              className="border-gray-300"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Application
            </Button>

            <Link href="/dashboard">
              <Button variant="ghost">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Support Info */}
        {/* <div className="text-center text-gray-500 text-sm">
          <p>
            Need help? Contact support at{" "}
            <a
              href="mailto:support@tdc.com"
              className="text-blue-600 hover:underline"
            >
              support@tdc.com
            </a>{" "}
            or call{" "}
            <a
              href="tel:+911234567890"
              className="text-blue-600 hover:underline"
            >
              +91 1234567890
            </a>
          </p>
          <p className="mt-2">
            Your application ID is your reference for all future communications.
          </p>
        </div> */}
      </div>
    </div>
  );
}
