import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/custom/container";
import { SiteHeader } from "@/features/web/_shared/site-header";
import { NewPostForm } from "@/features/web/post/new";

export const metadata: Metadata = {
  title: "New Post",
};
export default function NewPostPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="container sticky top-0 z-50 bg-background">
        <SiteHeader />
      </div>
      <Container>
        <div className="flex items-center justify-center">
          <div className="w-full space-y-5 sm:max-w-md lg:max-w-xl 2xl:max-w-2xl">
            <Suspense>
              <NewPostForm />
            </Suspense>
          </div>
        </div>
      </Container>
    </div>
  );
}
