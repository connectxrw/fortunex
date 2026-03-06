import type { Metadata } from "next";
import Container from "@/components/custom/container";
import { SiteHeader } from "@/features/web/_shared/site-header";
export const metadata: Metadata = {
  title: "Help Center",
};
export default function HelpCenterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="container sticky top-0 z-50 bg-background">
        <SiteHeader />
      </div>
      <Container>
        <div className="mx-auto h-full w-full max-w-3xl">
          <ContactBusinessForm
            businessEmail="rathonrw@gmail.com"
            businessName="FortuneX"
          />
        </div>
      </Container>
    </div>
  );
}
