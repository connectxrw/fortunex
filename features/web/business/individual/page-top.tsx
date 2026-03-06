"use client";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { UserRoundIcon } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VerifiedIcon } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { getUserInitials } from "@/lib/utils";
import profileImg from "@/public/video-poster-v2.jpg";
import { BusinessPageBtns } from "./header-btns";

export default function PageTop({ handle }: { handle: string }) {
  const business = useQuery(api.business.index.getBusinessByHandle, { handle });
  if (business === undefined) {
    return (
      <div className="flex flex-col gap-4">
        <AspectRatio className="overflow-hidden rounded-lg" ratio={535 / 86}>
          <Skeleton className="h-full max-h-43 w-full rounded-lg object-cover transition-all duration-300 ease-in group-hover:scale-105" />
        </AspectRatio>
        <div className="flex items-center gap-4 pt-5 lg:pt-1">
          <Skeleton className="size-20 rounded-full lg:size-40" />
        </div>
      </div>
    );
  }

  if (!business) {
    return notFound();
  }
  return (
    <div className="flex flex-col gap-4">
      <AspectRatio className="overflow-hidden rounded-lg" ratio={535 / 86}>
        <Image
          alt="my image"
          className="h-full max-h-43 w-full rounded-lg object-cover transition-all duration-300 ease-in group-hover:scale-105"
          height={172}
          src={business.coverImageUrl || "/gradients_10.jpg"}
          width={1070}
        />
      </AspectRatio>
      <div className="flex items-center gap-4 pt-5 lg:pt-1">
        <Link href={`/b/${business.handle}` as Route}>
          {business.profileImageUrl ? (
            <Avatar className="size-20 lg:size-38">
              <AvatarImage
                className="dark:invert"
                src={business.profileImageUrl || profileImg.src}
              />
              <AvatarFallback>
                {getUserInitials(business.name || "")}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground lg:size-38">
              <UserRoundIcon className="size-10" />
            </div>
          )}
        </Link>

        <div className="flex max-w-lg flex-col lg:gap-2">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-lg tracking-tight lg:text-4xl">
              {business.name}
            </h3>
            {business.status === "verified" && (
              <VerifiedIcon className="size-4 fill-blue-600 text-blue-600" />
            )}
          </div>
          <div className="flex flex-col gap-1 md:gap-2 lg:flex-row lg:items-center">
            <p className="font-medium">@{business.handle}</p>
            <div className="flex items-center gap-2 text-muted-foreground text-xs lg:text-sm">
              <p className="">{business.followersCount || 0} followers</p>
              <p className="">{business.postsCount || 0} posts</p>
            </div>
          </div>
          {business.description && (
            <div className="hidden items-center lg:inline-flex">
              <p className="text-muted-foreground">
                {business.description?.length > 50 ? (
                  <>
                    {business.description.slice(0, 50)}
                    <Link
                      className="font-medium text-foreground"
                      href={`/b/${business.handle}/about` as Route}
                    >
                      ...more
                    </Link>
                  </>
                ) : (
                  business.description
                )}
              </p>
            </div>
          )}
          <BusinessPageBtns
            businessId={business._id}
            className="hidden lg:flex"
            isFollowing={business.isFollowing}
            isMyBusiness={business.isMyBusiness}
          />
        </div>
      </div>
      <BusinessPageBtns
        businessId={business._id}
        className="pt-2 lg:hidden"
        isFollowing={business.isFollowing}
        isMyBusiness={business.isMyBusiness}
      />
    </div>
  );
}
