import { Suspense } from "react";
import Container from "@/components/custom/container";
import { SiteHeader } from "@/features/web/_shared/site-header";
import PageNavs from "@/features/web/business/individual/page-navs";
import PageTop from "@/features/web/business/individual/page-top";

export default function Layout(props: LayoutProps<"/b/[handle]">) {
  return (
    <div className="flex min-h-[calc(100vh-16px)] flex-col">
      <div className="container sticky top-0 z-50 bg-background">
        <SiteHeader />
      </div>
      <Container>
        <div className="mx-auto w-full max-w-6xl space-y-6 pb-6 lg:space-y-10">
          <Suspense>
            <SuspendedPageTop {...props} />
          </Suspense>
          <Suspense>
            <PageNavs {...props} />
          </Suspense>
          {props.children}
        </div>
      </Container>
    </div>
  );
}

async function SuspendedPageTop(props: LayoutProps<"/b/[handle]">) {
  const { handle } = await props.params;
  return <PageTop handle={handle} />;
}
