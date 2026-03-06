"use client";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { api } from "@/convex/_generated/api";
import { AuthPostCard } from "@/features/web/post/auth/card";
import { EmptyPosts } from "@/features/web/post/empty";
import { cn } from "@/lib/utils";

export default function AllBusinessPosts({
  className,
  handle,
}: {
  className?: string;
  handle: string;
}) {
  const posts = useQuery(api.business.post.getPostsByBusinessHandle, {
    handle,
  });
  if (!posts) {
    return null;
  }
  if (posts.length === 0) {
    return <EmptyPosts />;
  }
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
        className,
      )}
    >
      {posts.map((post) => (
        <AuthPostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
