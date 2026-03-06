import { Suspense } from "react";
import AboutContent from "@/features/web/business/individual/about";

export default function AboutPage(props: PageProps<"/b/[handle]">) {
  return (
    <div>
      <Suspense>
        <SuspendedAboutPage {...props} />
      </Suspense>
    </div>
  );
}

async function SuspendedAboutPage(props: PageProps<"/b/[handle]">) {
  const { handle } = await props.params;
  return (
    <div className="@container/main">
      <AboutContent handle={handle} />
    </div>
  );
}
