"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { useFilters } from "@/lib/nuqs-params";
import PostsSkeleton from "../post/skeleton";
import { AuthPosts } from "./auth-posts";
import { Merchants } from "./merchants";
import { UnAuthPosts } from "./un-auth-posts";

export default function HomePosts() {
  const [{ view }] = useFilters();

  if (view === "merchants") {
    return <Merchants />;
  }

  return (
    <>
      <AuthLoading>
        <PostsSkeleton />
      </AuthLoading>
      <Unauthenticated>
        <UnAuthPosts />
      </Unauthenticated>
      <Authenticated>
        <AuthPosts />
      </Authenticated>
    </>
  );
}
