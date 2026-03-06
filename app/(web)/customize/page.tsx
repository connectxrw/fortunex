import type { Metadata } from "next";
import Container from "@/components/custom/container";
import { SiteHeader } from "@/features/web/_shared/site-header";
import Customize from "@/features/web/customize";

export const metadata: Metadata = {
  title: "Customize",
};
export default function CustomizePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="container sticky top-0 z-50 bg-background">
        <SiteHeader />
      </div>
      <Container>
        <div className="mx-auto w-full max-w-4xl space-y-6 lg:space-y-12">
          <Customize />
        </div>
      </Container>
    </div>
  );
}
