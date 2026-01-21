//app/(dashboard)/dashboard/application-form/submission-success/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SubmissionSuccess() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-3xl font-bold text-[#00694A] mb-4">
        ✅ Application Submitted!
      </h1>
      <p className="text-gray-700 mb-6">
        Your application has been successfully submitted and is under review.
      </p>
      <Button
        onClick={() => router.push("/dashboard")}
        className="bg-[#00694A] hover:bg-[#004d36] text-white"
      >
        Go to Dashboard
      </Button>
    </div>
  );
}
