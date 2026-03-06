"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

export function GoogleSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const handleGoogleSignIn = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast(ctx.error.message);
        },
      },
    );
  };

  return (
    <div className="relative w-full">
      <Button
        className="h-10 w-full border border-[#0e0e0e] bg-[#0e0e0e] px-6 py-4 font-medium font-sans text-sm text-white transition-colors hover:bg-[#1a1a1a] disabled:opacity-50 dark:border-white dark:bg-white/90 dark:text-[#0e0e0e] dark:hover:bg-white"
        disabled={isLoading}
        onClick={handleGoogleSignIn}
        type="button"
      >
        {isLoading ? <Spinner /> : <FcGoogle size={16} />}
        <span>Continue with Google</span>
      </Button>
    </div>
  );
}
