"use client";

import { BuildingIcon } from "lucide-react";
import Link from "next/link";
import { VerifiedIcon } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

type OpeningHour = {
  day: string;
  open?: string;
  close?: string;
  closed: boolean;
};

const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const HOURS_CATEGORIES = ["restaurant", "tourism"];

function getOpenStatus(
  openingHours: OpeningHour[] | undefined,
  category: string,
): boolean | null {
  if (!HOURS_CATEGORIES.includes(category)) return null;
  if (!openingHours?.length) return null;

  const now = new Date();
  const dayName = DAYS[now.getDay()];
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const currentTime = `${hh}:${mm}`;

  const todayHours = openingHours.find((h) => h.day === dayName);
  if (!todayHours) return null;
  if (todayHours.closed) return false;
  if (!todayHours.open || !todayHours.close) return null;

  return currentTime >= todayHours.open && currentTime <= todayHours.close;
}

export function MerchantCard({
  business,
  className,
}: {
  business: {
    _id: string;
    name: string;
    handle: string;
    category: string;
    status?: string;
    logo: string | null;
    coverImage: string | null;
    openingHours?: OpeningHour[];
  };
  className?: string;
}) {
  const openStatus = getOpenStatus(business.openingHours, business.category);

  return (
    <Link
      className={cn("block space-y-2 group", className)}
      href={`/b/${business.handle}`}
    >
      {/* Profile image */}
      <div className="overflow-hidden rounded-xl bg-muted">
        <AspectRatio ratio={4 / 3}>
          {business.logo ? (
            <img
              alt={business.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              src={business.logo}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <BuildingIcon className="size-10 text-muted-foreground/40" />
            </div>
          )}
        </AspectRatio>
      </div>

      {/* Info rows */}
      <div className="space-y-0.5 px-0.5">
        <div className="flex items-center gap-1">
          <span className="truncate text-sm font-medium">{business.name}</span>
          {business.status === "verified" && (
            <VerifiedIcon className="size-3.5 shrink-0 fill-blue-600 text-blue-600" />
          )}
        </div>
        <p className="text-sm text-muted-foreground capitalize">
          {business.category}
          {openStatus !== null && (
            <>
              <span className="mx-1 opacity-40">·</span>
              <span
                className={cn(
                  "font-medium normal-case",
                  openStatus ? "text-emerald-600" : "text-muted-foreground",
                )}
              >
                {openStatus ? "Open" : "Closed"}
              </span>
            </>
          )}
        </p>
      </div>
    </Link>
  );
}
