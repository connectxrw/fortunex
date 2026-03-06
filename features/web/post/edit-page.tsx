"use client";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useFilters } from "@/lib/nuqs-params";
import { NoAccessPage } from "../_shared/no-access";
import { EditPostForm } from "./edit-form";
import { EmptyPosts } from "./empty";

export function EditPostFormPage({ slug }: { slug: string }) {
  const decodedSlug = decodeURIComponent(slug);
  const [{ post: currentPost }, setSearchParams] = useFilters();
  const user = useQuery(api.auth.getCurrentUser);
  const post = useQuery(api.user.post.getAuthPostBySlug, {
    slug: decodedSlug,
  });

  if (!user) {
    return <Skeleton className="h-[50vh] w-full" />;
  }
  if (user.accountType !== "business") {
    return <NoAccessPage />;
  }
  if (post === undefined) {
    return <Skeleton className="h-100" />;
  }
  if (post === null) {
    return <EmptyPosts />;
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-6 lg:max-w-xl 2xl:max-w-2xl">
      <div className="flex items-center justify-between">
        <Button asChild className="rounded-full" size="sm" variant="ghost">
          <Link href="/posts">
            <ChevronLeftIcon />
            Back
          </Link>
        </Button>
        <Button
          className="rounded-full"
          onClick={() =>
            setSearchParams({
              post: currentPost === post.slug ? "" : post.slug,
            })
          }
          size="sm"
        >
          {currentPost === post.slug ? "Close Preview" : "See Preview"}
        </Button>
      </div>
      <EditPostForm
        businessCategory={post.category}
        content={post.content}
        coverImages={post.coverImages}
        ctaLabel={post.ctaLabel || ""}
        ctaLink={post.ctaLink || ""}
        currency={post.currency || ""}
        postId={post._id}
        price={post.price || ""}
        subcategory={post.subcategory || ""}
        title={post.title}
      />
    </div>
  );
}
