"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import PostsSkeleton from "../post/skeleton";
import { AuthPosts } from "./auth-posts";
import { UnAuthPosts } from "./un-auth-posts";

export default function HomePosts() {
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
