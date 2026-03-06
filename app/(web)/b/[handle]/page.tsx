import { Suspense } from "react";
import AllBusinessPosts from "@/features/web/business/individual/posts";

export default function BusinessPage(props: PageProps<"/b/[handle]">) {
  return (
    <div>
      <Suspense>
        <SuspendedBusinessPage {...props} />
      </Suspense>
    </div>
  );
}

async function SuspendedBusinessPage(props: PageProps<"/b/[handle]">) {
  const { handle } = await props.params;
  return (
    <div className="@container/main">
      <AllBusinessPosts handle={handle} />
    </div>
  );
}
