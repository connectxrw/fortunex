"use client";

import { usePaginatedQuery, useQuery } from "convex-helpers/react/cache/hooks";
import { homeFilters } from "@/config/data";
import { api } from "@/convex/_generated/api";
import { useFilters } from "@/lib/nuqs-params";
import { cn } from "@/lib/utils";
import type { TBusinessCategory } from "@/types";
import { PaginationActions } from "@/features/web/_shared/pagination";
import { AuthPostCard } from "./auth/card";
import { EmptyPosts } from "./empty";
import PostsSkeleton from "./skeleton";

export default function LikedPosts() {
  const [{ category, q }] = useFilters();

  // check if category is among the valid categories
  let filteredCategory = category as TBusinessCategory;
  if (
    !homeFilters.map((cat) => cat.value).includes(category as TBusinessCategory)
  ) {
    filteredCategory = "restaurant";
  }

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.user.post.getAuthPosts,
    { category: filteredCategory },
    { initialNumItems: 6 },
  );

  const searchPosts = useQuery(
    api.user.post.searchAuthPosts,
    q ? { search: q } : "skip",
  );

  // Loading state
  const isSearchLoading = Boolean(q && searchPosts === undefined);

  if (isLoading || isSearchLoading) {
    return <PostsSkeleton />;
  }

  const posts = q
    ? searchPosts?.filter((post) => post.liked)
    : results.filter((post) => post.liked);

  if (!posts || posts.length === 0) {
    return <EmptyPosts />;
  }

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 gap-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
        )}
      >
        {posts.map((post) => (
          <AuthPostCard key={post._id} post={post} />
        ))}
      </div>
      <PaginationActions
        hasMore={status === "CanLoadMore"}
        onLoadMore={() => loadMore(6)}
      />
    </>
  );
}
