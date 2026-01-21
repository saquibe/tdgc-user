//app/(dashboard)/dashboard/application-form/page.tsx

// 'use client';
// import ApplicationForm from "@/app/components/dashboard/ApplicationForm";
// // import MultiStepForm from "@/app/components/dashboard/ApplicationForm/MultiStepForm";

// export default function ApplicationFormPage() {
//   <>
//     <ApplicationForm />;
//     {/* <MultiStepForm /> */}
//   </>
// }

"use client";

import MultiStepForm from "@/app/components/dashboard/ApplicationForm/MultiStepForm";

// import ApplicationForm from "@/app/components/dashboard/ApplicationForm";

export default function ApplicationFormPage() {
  return (
    <div>
      {/* <ApplicationForm /> */}
      <MultiStepForm />
    </div>
  );
}
