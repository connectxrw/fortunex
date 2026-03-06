import { fetchQuery } from "convex/nextjs";
import { Suspense } from "react";
import { PromptInputProvider } from "@/components/ai-elements/prompt-input";
import Container from "@/components/custom/container";
import { api } from "@/convex/_generated/api";
import { SiteHeader } from "@/features/workspace/_shared/site-header";
import { EditPostFormPage } from "@/features/workspace/post/edit-page";
import { getToken } from "@/lib/auth-server";

export async function generateMetadata(props: PageProps<"/posts/edit/[slug]">) {
  const { slug } = await props.params;

  const decodedSlug = decodeURIComponent(slug);

  const post = await fetchQuery(
    api.user.post.getAuthPostBySlug,
    {
      slug: decodedSlug,
    },
    { token: await getToken() },
  );
  if (post === null)
    return {
      title: "Post Not Found",
      description: "Post Not Found",
    };

  return {
    title: post.title,
    description: post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.slice(0, 160),
      images: [
        {
          url: post.coverImages[0].url,
          width: 1200,
          height: 630,
        },
      ],
      type: "article",
      publishedTime: post.updatedAt,
      authors: [post.postBusiness.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.content.slice(0, 160),
      images: [post.coverImages[0].url],
    },
  };
}
export default function EditPostPage(props: PageProps<"/posts/edit/[slug]">) {
  return (
    <div className="flex flex-col gap-6">
      <div className="container sticky top-0 z-50 bg-background">
        <SiteHeader />
      </div>
      <Container>
        <Suspense>
          <SuspendedEditPostPage {...props} />
        </Suspense>
      </Container>
    </div>
  );
}

async function SuspendedEditPostPage(props: PageProps<"/posts/edit/[slug]">) {
  const { slug } = await props.params;
  return (
    <div className="flex items-center justify-center">
      <PromptInputProvider>
        <EditPostFormPage slug={slug} />
      </PromptInputProvider>
    </div>
  );
}
