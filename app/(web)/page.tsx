import { fetchQuery } from "convex/nextjs";
import { Suspense } from "react";
import Container from "@/components/custom/container";
import { api } from "@/convex/_generated/api";
import { SearchTop } from "@/features/web/_shared/search";
import { SiteHeader } from "@/features/web/_shared/site-header";
import FilterBtns from "@/features/web/home/filters";
import { NearMeFloatingButton } from "@/features/web/home/near-me-button";
import HomePosts from "@/features/web/home/posts";
import PostsSkeleton from "@/features/web/post/skeleton";

export async function generateMetadata(props: PageProps<"/">) {
  const slug = (await props.searchParams).post as string;

  const decodedSlug = decodeURIComponent(slug);

  const post = await fetchQuery(api.public.post.getUnAuthPostBySlug, {
    slug: decodedSlug,
  });

  // No post parameter = default home metadata
  if (!post || Array.isArray(post)) {
    return {
      title: "Fortunex | Search engine for businesses",
    };
  }

  const description = post.content
    ? post.content.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 160)
    : "";

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      images: post.coverImages?.[0]
        ? [{ url: post.coverImages[0].url, width: 1200, height: 630 }]
        : [],
      type: "article",
      publishedTime: new Date(post.updatedAt).toISOString(),
      authors: post.postBusiness?.name ? [post.postBusiness.name] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.coverImages?.[0] ? [post.coverImages[0].url] : [],
    },
  };
}

export default function WorkspacePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="container sticky top-0 z-50 bg-background">
        <SiteHeader>
          <SearchTop placeholder="Search..." />
        </SiteHeader>
      </div>
      <Container className="pt-0 pb-10 md:pt-0">
        <div className="flex flex-col gap-3">
          <Suspense>
            <FilterBtns by="category" page="home" />
          </Suspense>
          <Suspense fallback={<PostsSkeleton />}>
            <HomePosts />
          </Suspense>
        </div>
      </Container>
      <Suspense>
        <NearMeFloatingButton />
      </Suspense>
    </div>
  );
}
