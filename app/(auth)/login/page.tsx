import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { LoginForm } from "@/app/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#00694A]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
