import { Suspense } from "react";
import SiteFooter from "@/features/web/_shared/site-footer";
import {
  FloatingAIChat,
  MobileFloatingAIChat,
} from "@/features/web/ai/floating-ai";
import Panel from "@/features/web/panel";
import PreviewPost from "@/features/web/preview";

export default function Layout(props: LayoutProps<"/">) {
  return (
    <div className="flex min-h-svh w-full gap-2 bg-muted">
      <div className="relative w-full min-w-1/2 bg-background font-roboto">
        <div className="min-h-svh">{props.children}</div>
        <Suspense>
          <FloatingAIChat />
        </Suspense>
        <MobileFloatingAIChat />

        <SiteFooter />
      </div>
      <Suspense>
        <Panel />
        <PreviewPost />
      </Suspense>
    </div>
  );
}
