"use client";
import { usePaginatedQuery } from "convex-helpers/react/cache/hooks";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { PaginationActions } from "../_shared/pagination";
import { AuthPostCard } from "../post/auth/card";
import { EmptyPosts } from "../post/empty";
import PostsSkeleton from "../post/skeleton";

const PAGE_SIZE = 12;
export default function MyPosts({ className }: { className?: string }) {
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.user.post.getMyPosts,
    {},
    { initialNumItems: PAGE_SIZE },
  );

  if (isLoading) {
    return <PostsSkeleton />;
  }
  if (!results || results.length === 0) {
    return <EmptyPosts />;
  }
  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 gap-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
          className,
        )}
      >
        {results.map((post) => (
          <AuthPostCard key={post._id} post={post} />
        ))}
      </div>
      <PaginationActions
        hasMore={status === "CanLoadMore"}
        onLoadMore={() => loadMore(PAGE_SIZE)}
      />
    </>
  );
}
