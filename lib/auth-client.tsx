"use client";

import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { AuthBoundary } from "@convex-dev/better-auth/react";
import { emailOTPClient, usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import { api } from "@/convex/_generated/api";
import { isAuthError } from "@/lib/utils";
export const authClient = createAuthClient({
  plugins: [usernameClient(), emailOTPClient(), convexClient()],
});

export const ClientAuthBoundary = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  return (
    <AuthBoundary
      authClient={authClient}
      // This can do anything you like, a redirect is typical.
      getAuthUserFn={api.auth.getAuthUser}
      isAuthError={isAuthError}
      onUnauth={() => router.replace("/login")}
    >
      {children}
    </AuthBoundary>
  );
};
