"use client";

import { usePaginatedQuery } from "convex-helpers/react/cache/hooks";
import { homeFilters } from "@/config/data";
import { api } from "@/convex/_generated/api";
import { MerchantCard } from "@/features/web/business/merchant-card";
import { EmptyPosts } from "@/features/web/post/empty";
import PostsSkeleton from "@/features/web/post/skeleton";
import { useFilters } from "@/lib/nuqs-params";
import { cn } from "@/lib/utils";
import type { TBusinessCategory } from "@/types";
import { PaginationActions } from "../_shared/pagination";

const PAGE_SIZE = 12;

export function Merchants() {
  const [{ category }] = useFilters();

  let filteredCategory = category as TBusinessCategory;
  if (
    !homeFilters.map((cat) => cat.value).includes(category as TBusinessCategory)
  ) {
    filteredCategory = "restaurant";
  }

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.public.business.getPublicBusinesses,
    { category: filteredCategory },
    { initialNumItems: PAGE_SIZE },
  );

  if (isLoading) return <PostsSkeleton />;
  if (!results || results.length === 0) return <EmptyPosts />;

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 gap-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
        )}
      >
        {results.map((business) => (
          <MerchantCard business={business} key={business._id} />
        ))}
      </div>
      <PaginationActions
        hasMore={status === "CanLoadMore"}
        onLoadMore={() => loadMore(PAGE_SIZE)}
      />
    </>
  );
}
