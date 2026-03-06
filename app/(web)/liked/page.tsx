import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/custom/container";
import { SearchTop } from "@/features/web/_shared/search";
import { SiteHeader } from "@/features/web/_shared/site-header";
import FilterBtns from "@/features/web/home/filters";
import LikedPosts from "@/features/web/post/liked-posts";
export const metadata: Metadata = {
  title: "Liked",
};
export default function WorkspaceLikedPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="container sticky top-0 z-50 bg-background">
        <SiteHeader>
          <SearchTop placeholder="Search liked posts..." />
        </SiteHeader>
      </div>
      <Container>
        <Suspense>
          <FilterBtns by="category" page="home" />
        </Suspense>
        <Suspense>
          <LikedPosts />
        </Suspense>
      </Container>
    </div>
  );
}
