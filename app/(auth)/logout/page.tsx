"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CustomLoader } from "@/components/custom/custom-loader";
import { authClient } from "@/lib/auth-client";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    authClient.signOut().then(() => router.replace("/login"));
  }, [router.replace]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <CustomLoader />
    </div>
  );
}
