import { MapPinIcon, UserRoundIcon } from "lucide-react";
import Link from "next/link";
import { VerifiedIcon } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Card } from "@/components/ui/card";
import type { Doc } from "@/convex/_generated/dataModel";
import { useFilters } from "@/lib/nuqs-params";
import { formatDistance } from "@/lib/use-near-me";
import { cn, getUserInitials } from "@/lib/utils";
import type { TBusiness } from "@/types";
import { PostMediaCard } from "../media-card";
import { AuthPostCardActions } from "./card-actions";

export function AuthPostCard({
  post,
  className,
  showMore = true,
  distanceKm,
}: {
  post: Doc<"post"> & {
    coverImages: { key: string; url: string }[];
    postBusiness: TBusiness;
    isMine: boolean;
    saved: boolean;
    liked: boolean;
  };
  className?: string;
  showMore?: boolean;
  distanceKm?: number;
} & React.ComponentProps<typeof Card>) {
  const [{ post: currentPost }, setSearchParams] = useFilters();
  return (
    <div className={cn("relative space-y-3", className)}>
      <div className="group relative overflow-hidden rounded-lg bg-muted">
        <PostMediaCard
          className="lg:hidden"
          onClick={() =>
            setSearchParams({
              post: currentPost === post.slug ? "" : post.slug,
            })
          }
          post={post}
        />
        <PostMediaCard
          className="hidden lg:inline"
          onClick={() =>
            setSearchParams({
              post: currentPost === post.slug ? "" : post.slug,
            })
          }
          post={post}
        />
        {distanceKm != null && (
          <div className="pointer-events-none absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 font-medium text-white text-xs backdrop-blur-sm">
            <MapPinIcon className="h-3 w-3 shrink-0" />
            {formatDistance(distanceKm)}
          </div>
        )}
      </div>

      {showMore && (
        <div className="flex justify-between gap-2">
          <div className="flex gap-2">
            <Link
              href={`/b/${post.postBusiness.handle}`}
              title={post.postBusiness.name}
            >
              {post.postBusiness.logo ? (
                <Avatar className="size-9 lg:size-10">
                  <AvatarImage src={post.postBusiness.logo} />
                  <AvatarFallback>
                    {getUserInitials(post.postBusiness.name || "")}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground lg:size-10">
                  <UserRoundIcon className="size-6" />
                </div>
              )}
            </Link>
            <div className="flex flex-col items-start text-left">
              <button
                className="line-clamp-1 text-left font-medium text-base leading-tight"
                onClick={() =>
                  setSearchParams({
                    post: currentPost === post.slug ? "" : post.slug,
                  })
                }
                title={post.title}
                type="button"
              >
                {post.title}
              </button>
              <Link
                className="flex items-center gap-2 text-muted-foreground text-sm"
                href={`/b/${post.postBusiness.handle}`}
              >
                <span>{post.postBusiness.name}</span>

                {post.postBusiness.status === "verified" && (
                  <VerifiedIcon className="size-4 fill-blue-600 text-blue-600" />
                )}
              </Link>
            </div>
          </div>
          <AuthPostCardActions post={post} />
        </div>
      )}
    </div>
  );
}
