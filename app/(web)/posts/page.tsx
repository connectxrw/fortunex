import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import Container from "@/components/custom/container";
import { Button } from "@/components/ui/button";
import { SearchTop } from "@/features/web/_shared/search";
import { SiteHeader } from "@/features/web/_shared/site-header";
import FilterBtns from "@/features/web/home/filters";
import MyPosts from "@/features/web/post/my-posts";
import PostsSkeleton from "@/features/web/post/skeleton";
export const metadata: Metadata = {
  title: "My Posts",
};
export default function PostsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="container sticky top-0 z-50 bg-background">
        <SiteHeader>
          <SearchTop placeholder="Search..." />
        </SiteHeader>
      </div>

      <Container>
        <div className="flex items-center justify-between gap-2">
          <Suspense>
            <FilterBtns by="status" page="my-posts" />
          </Suspense>
          <Button asChild className="hidden rounded-full lg:flex">
            <Link
              href={`/posts/new?preview=${JSON.stringify({
                images: [],
                title: "",
                ctaLink: "",
                ctaLabel: "",
                content: "",
                price: "",
                open: true,
              })}`}
            >
              <PlusIcon className="size-4" />
              New Post
            </Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-blue-600 text-white hover:bg-blue-700 lg:hidden"
            size="sm"
          >
            <Link href="/posts/new">
              <PlusIcon className="size-4" />
              New Post
            </Link>
          </Button>
        </div>
        <Suspense fallback={<PostsSkeleton />}>
          <MyPosts />
        </Suspense>
      </Container>
    </div>
  );
}
