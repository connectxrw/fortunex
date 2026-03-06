"use client";

import { usePaginatedQuery, useQuery } from "convex-helpers/react/cache/hooks";
import { homeFilters } from "@/config/data";
import { api } from "@/convex/_generated/api";
import { useFilters } from "@/lib/nuqs-params";
import { getDistanceKm, useNearMe } from "@/lib/use-near-me";
import { cn } from "@/lib/utils";
import type { TBusinessCategory } from "@/types";
import { PaginationActions } from "../_shared/pagination";
import { EmptyPosts } from "../post/empty";
import PostsSkeleton from "../post/skeleton";
import { UnAuthPostCard } from "../post/un-auth/card";

const PAGE_SIZE = 12;
export function UnAuthPosts() {
  const [{ category, subcategory, q, nearMe }] = useFilters();
  const { coordinates } = useNearMe();

  // check if category is among the valid categories
  let filteredCategory = category as TBusinessCategory;
  if (
    !homeFilters.map((cat) => cat.value).includes(category as TBusinessCategory)
  ) {
    filteredCategory = "restaurant";
  }

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.public.post.getUnAuthPosts,
    { category: filteredCategory, subcategory: subcategory || undefined },
    { initialNumItems: PAGE_SIZE },
  );

  const searchPosts = useQuery(
    api.public.post.searchUnAuthPosts,
    q ? { search: q } : "skip",
  );

  const isSearchLoading = Boolean(q && searchPosts === undefined);

  if (isLoading || isSearchLoading) {
    return <PostsSkeleton />;
  }

  let posts = q ? searchPosts : results;

  // When Near Me is active: keep only posts from businesses with coordinates, sort by distance
  const postDistances = new Map<string, number>();
  if (nearMe && coordinates && posts && posts.length > 0) {
    posts = posts
      .filter(
        (p) =>
          p.postBusiness?.latitude != null && p.postBusiness?.longitude != null,
      )
      .map((p) => {
        postDistances.set(
          p._id,
          getDistanceKm(
            coordinates.lat,
            coordinates.lng,
            p.postBusiness.latitude!,
            p.postBusiness.longitude!,
          ),
        );
        return p;
      })
      .sort((a, b) => postDistances.get(a._id)! - postDistances.get(b._id)!);
  }

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
          <UnAuthPostCard
            distanceKm={postDistances.get(post._id)}
            key={post._id}
            post={post}
          />
        ))}
      </div>
      <PaginationActions
        hasMore={status === "CanLoadMore"}
        onLoadMore={() => loadMore(PAGE_SIZE)}
      />
    </>
  );
}
