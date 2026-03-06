import { ChevronLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import LoginCover from "@/features/auth/login-cover";
import LoginOptions from "@/features/auth/options";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <div className="flex min-h-screen bg-background">
      <LoginCover />
      <div className="flex w-full flex-col items-center justify-center p-8 pb-2 lg:w-1/2 lg:p-12">
        <div className="flex h-full w-full max-w-md flex-col">
          <Button asChild className="w-fit" size="sm" variant={"ghost"}>
            <Link href={"/"}>
              <ChevronLeftIcon />
              Back
            </Link>
          </Button>
          <div className="flex flex-1 flex-col justify-center space-y-8">
            {/* Header */}
            <div className="space-y-2 text-center">
              <h1 className="mb-4 font-serif text-lg">
                Welcome to {siteConfig.name}
              </h1>
              <p className="font-sans text-muted-foreground text-sm">
                Sign in or create an account
              </p>
            </div>
            <LoginOptions />
          </div>

          {/* Terms and Privacy Policy - Bottom aligned */}
          <div className="mt-auto text-center">
            <p className="font-sans text-muted-foreground text-xs">
              By signing in you agree to our{" "}
              <Link
                className="text-muted-foreground underline transition-colors hover:text-foreground"
                href="/"
              >
                Terms of service
              </Link>{" "}
              &{" "}
              <Link
                className="text-muted-foreground underline transition-colors hover:text-foreground"
                href="/"
              >
                Privacy policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
