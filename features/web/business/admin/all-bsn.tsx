"use client";

import { useQuery } from "convex-helpers/react/cache/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { NoBusinessAccount } from "@/features/web/business/no-business";
import BusinessCard from "./card";

export default function AllBusinesses() {
  const businesses = useQuery(api.admin.business.getAllBusinesses);

  if (businesses === undefined) {
    return (
      <>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton className="h-50 w-full" key={index} />
        ))}
      </>
    );
  }
  if (businesses === null) {
    return <NoBusinessAccount />;
  }

  return (
    <div className="grid @5xl/main:grid-cols-4 @xl/main:grid-cols-2 grid-cols-1 gap-4">
      {businesses.map((business) => (
        <BusinessCard business={business} key={business.id} />
      ))}
    </div>
  );
}
