import { BriefcaseBusinessIcon } from "lucide-react";
import type { Metadata } from "next";
import Container from "@/components/custom/container";
import { SearchTop } from "@/features/workspace/_shared/search";
import { SiteHeader } from "@/features/workspace/_shared/site-header";
import AllBusinesses from "@/features/workspace/business/admin/all-bsn";
export const metadata: Metadata = {
  title: "All Businesses",
  description: "Manage your all businesses",
};
export default function AllBusinessesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="container sticky top-0 z-50 bg-secondary">
        <SiteHeader
          icon={
            <BriefcaseBusinessIcon className="size-4 text-muted-foreground" />
          }
          title="Business"
        >
          <SearchTop placeholder="Search..." />
        </SiteHeader>
      </div>
      <Container>
        <AllBusinesses />
      </Container>
    </div>
  );
}
