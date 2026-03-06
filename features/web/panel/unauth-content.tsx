"use client";
import { usePaginatedQuery, useQuery } from "convex-helpers/react/cache/hooks";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpIcon, Share2Icon, UserRoundIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { VerifiedIcon } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useFilters } from "@/lib/nuqs-params";
import { getUserInitials } from "@/lib/utils";
import type { TBusiness } from "@/types";
import { ExpandableText } from "../_shared/expand-texts";
import { EmptyPosts } from "../post/empty";
import { PostMediaCard } from "../post/media-card";
import { UnAuthPostCard } from "../post/un-auth/card";

export function UnAuthPanelContent({ slug }: { slug: string }) {
  const decodedSlug = decodeURIComponent(slug);
  const [{ post: currentPost }, setSearchParams] = useFilters();
  const post = useQuery(api.public.post.getUnAuthPostBySlug, {
    slug: decodedSlug,
  });

  if (post === undefined) {
    return <PostSkeleton />;
  }
  if (post === null || !post) {
    return <EmptyPosts />;
  }
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post.title,
        text: post.content,
        url: `/?post=${currentPost}`,
      });
    } else {
      await navigator.clipboard.writeText(`/?post=${currentPost}`);
      toast("Link copied to clipboard.");
    }
  };
  const postUrl = `https://beta-fortunex.vercel.app/?post=${post.slug}`;
  const message = encodeURIComponent(`am interested in ${postUrl}`);

  return (
    <>
      <Link
        className="flex items-center gap-3"
        href={`/b/${post.postBusiness.handle}`}
        title={post.postBusiness.name}
      >
        {" "}
        {post.postBusiness.logo ? (
          <Avatar className="size-9 md:size-10">
            <AvatarImage src={post.postBusiness.logo} />
            <AvatarFallback>
              {getUserInitials(post.postBusiness.name || "")}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground lg:size-9">
            <UserRoundIcon className="size-4" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-[16px] leading-5.5 md:text-base">
              {post.postBusiness.name}
            </h3>
            {post.postBusiness.status === "verified" && (
              <VerifiedIcon className="size-4 fill-blue-600 text-blue-600" />
            )}
          </div>

          <p className="text-muted-foreground text-xs md:text-xs">
            {post.postBusiness.followersCount || 0} Followers
          </p>
        </div>
        <Button className="ml-auto rounded-full">Visit Page</Button>
      </Link>
      <div className="flex flex-col gap-5">
        <PostMediaCard
          onClick={() => setSearchParams({ post: post.slug })}
          post={post}
        />
        <div className="flex flex-wrap justify-between gap-1">
          <h3 className="font-medium text-xl tracking-tight">{post.title}</h3>
          {post.price && (
            <p className="text-foreground/90">
              Price:{" "}
              <span className="font-medium">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: post?.currency || "RWF",
                }).format(Number(post?.price))}
              </span>
            </p>
          )}
        </div>
        <ScrollArea className="w-full">
          <div className="flex w-full gap-3">
            {post.ctaLink?.includes("wa.me") ? (
              <Button
                aria-label={post.ctaLabel}
                asChild
                className="rounded-full"
              >
                <a href={`${post.ctaLink}?text=${message}`} target="_blank">
                  <ArrowUpIcon />
                  {post.ctaLabel && post.ctaLabel?.length > 10
                    ? `${post.ctaLabel.slice(0, 10)}...`
                    : post.ctaLabel}
                </a>
              </Button>
            ) : (
              <Button
                aria-label={post.ctaLabel}
                asChild
                className="rounded-full"
              >
                <a
                  href={`${post.ctaLink}?utm_source=tux.com&utm_medium=referral&utm_campaign=${post.slug}`}
                  target="_blank"
                >
                  <ArrowUpIcon />
                  {post.ctaLabel && post.ctaLabel?.length > 10
                    ? `${post.ctaLabel.slice(0, 10)}...`
                    : post.ctaLabel}
                </a>
              </Button>
            )}
            <Button
              aria-label="Share"
              className="rounded-full"
              onClick={handleShare}
              variant="secondary"
            >
              <Share2Icon />
              Share
            </Button>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <ExpandableText text={post.content} words={30} />
        <p className="text-muted-foreground text-sm">
          Posted {formatDistanceToNow(post.createdAt, { addSuffix: true })}
        </p>
      </div>
      <SimilarPosts post={post} />
    </>
  );
}

function SimilarPosts({
  post,
}: {
  post: Doc<"post"> & {
    coverImages: {
      key: string;
      url: string;
    }[];
    postBusiness: TBusiness;
  };
}) {
  const { results } = usePaginatedQuery(
    api.public.post.getOtherBsnPosts,
    { businessId: post.businessId },
    { initialNumItems: 6 },
  );
  // const posts = useQuery(api.post.getPosts);
  const posts = results?.filter(
    (p) =>
      p.slug !== post?.slug &&
      p.postBusiness.category === post?.postBusiness.category,
  );
  if (posts.length === 0) {
    return null;
  }
  return (
    <Carousel
      className="relative flex flex-1 flex-col gap-4"
      opts={{
        loop: true,
        dragFree: true,
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-nowrap font-medium text-lg tracking-tight">
          Similar Posts
        </h3>
        <div className="flex space-x-2">
          <CarouselPrevious className="relative inset-0 h-8 w-8 translate-x-0 translate-y-0 text-gray-700 dark:bg-none dark:text-gray-300" />
          <CarouselNext className="relative inset-0 h-8 w-8 translate-x-0 translate-y-0 text-gray-700 dark:bg-none dark:text-gray-300" />
        </div>
      </div>
      <CarouselContent>
        {posts.map((p) => (
          <CarouselItem className="basis-1/2" key={p.slug}>
            <UnAuthPostCard post={p} showMore={false} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

function PostSkeleton() {
  return (
    <>
      <div className="flex items-center space-x-4">
        <Skeleton className="size-9 rounded-full md:size-10" />
        <div className="space-y-2">
          <Skeleton className="h-2 w-25" />
          <Skeleton className="h-2 w-25" />
        </div>
      </div>
      <AspectRatio className="overflow-hidden rounded-lg" ratio={4 / 3}>
        <Skeleton className="h-full w-full rounded-lg object-cover transition-all duration-300 ease-in-out group-hover:scale-105" />
      </AspectRatio>
      <div className="space-y-2">
        <Skeleton className="h-4 w-62.5" />
        <Skeleton className="h-4 w-50" />
      </div>
    </>
  );
}
