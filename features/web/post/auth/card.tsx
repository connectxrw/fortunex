"use client";

import { HeartIcon, MapPinIcon, UserRoundIcon } from "lucide-react";
import Link from "next/link";
import { VerifiedIcon } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Doc } from "@/convex/_generated/dataModel";
import { useFilters } from "@/lib/nuqs-params";
import { formatDistance } from "@/lib/use-near-me";
import { cn, getUserInitials } from "@/lib/utils";
import type { TBusiness } from "@/types";
import { PostMediaCard } from "../media-card";
import { AuthLikeButton, AuthMoreButton, AuthSaveButton } from "./card-actions";

type PostWithMeta = Doc<"post"> & {
  coverImages: { key: string; url: string }[];
  postBusiness: TBusiness;
  isMine: boolean;
  saved: boolean;
  liked: boolean;
  likesCount: number;
};

// function stripHtml(html: string) {
//   return html.replace(/<[^>]*>/g, "");
// }

function formatPrice(price: string): string {
  const num = Number.parseFloat(price.replace(/,/g, ""));
  return Number.isNaN(num) ? price : num.toLocaleString();
}

export function AuthPostCard({
  post,
  className,
  showMore = true,
  distanceKm,
}: {
  post: PostWithMeta;
  className?: string;
  showMore?: boolean;
  distanceKm?: number;
}) {
  const [{ post: currentPost }, setSearchParams] = useFilters();

  const openPost = () =>
    setSearchParams({ post: currentPost === post.slug ? "" : post.slug });

  return (
    <div className={cn("relative space-y-2.5", className)}>
      {/* ── Image area ── */}
      <div className="group relative overflow-hidden rounded-xl bg-muted">
        <PostMediaCard onClick={openPost} post={post} />

        {/* Distance badge – top left */}
        {distanceKm != null && (
          <div className="pointer-events-none absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 font-medium text-white text-xs backdrop-blur-sm">
            <MapPinIcon className="h-3 w-3 shrink-0" />
            {formatDistance(distanceKm)}
          </div>
        )}

        {/* Like button – always visible, top right */}
        <AuthLikeButton post={post} />

        {/* Hover overlay: gradient + title + save/more */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
          <div className="absolute right-0 bottom-0 left-0 flex items-end justify-between gap-2 p-3">
            <button
              className="pointer-events-auto line-clamp-2 text-left font-semibold text-sm text-white leading-snug"
              onClick={openPost}
              type="button"
            >
              {post.title}
            </button>
            <div className="pointer-events-auto flex shrink-0 items-center gap-1.5">
              <AuthSaveButton post={post} />
              <AuthMoreButton post={post} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Below image ── */}
      {showMore && (
        <div className="space-y-1 px-0.5">
          {/* Business name + likes count */}
          <div className="flex items-center justify-between gap-2">
            <Link
              className="flex min-w-0 items-center gap-1.5"
              href={`/b/${post.postBusiness.handle}`}
            >
              {post.postBusiness.logo ? (
                <Avatar className="size-6 shrink-0">
                  <AvatarImage src={post.postBusiness.logo} />
                  <AvatarFallback className="text-[10px]">
                    {getUserInitials(post.postBusiness.name || "")}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground">
                  <UserRoundIcon className="size-4" />
                </div>
              )}
              <span className="truncate font-medium text-sm">
                {post.postBusiness.name}
              </span>
              {post.postBusiness.status === "verified" && (
                <VerifiedIcon className="size-3.5 shrink-0 fill-blue-600 text-blue-600" />
              )}
            </Link>

            <div className="flex shrink-0 items-center gap-1 text-muted-foreground text-sm">
              <HeartIcon className="size-3.5" />
              <span>{post.likesCount}</span>
            </div>
          </div>

          {/* Price */}
          {post.price && (
            <p className="text-right font-normal">
              {post.currency ? `${post.currency} ` : ""}
              {formatPrice(post.price)}
            </p>
          )}

          {/* One-line description */}
          {/* {post.content && (
            <p className="line-clamp-1 w-[70%] font-normal text-muted-foreground text-sm">
              {stripHtml(post.content)}
            </p>
          )} */}
        </div>
      )}
    </div>
  );
}
