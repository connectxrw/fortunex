"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserMenuSheet } from "./user-sheet";

export default function UserProfile() {
  return (
    <>
      <AuthLoading>
        <Button className="rounded-full" disabled>
          Login
        </Button>
      </AuthLoading>
      <Unauthenticated>
        <Button asChild className="rounded-full">
          <Link href="/login">Login</Link>
        </Button>
      </Unauthenticated>
      <Authenticated>
        <UserMenuSheet />
      </Authenticated>
    </>
  );
}
