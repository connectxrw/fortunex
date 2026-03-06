import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/custom/container";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { SiteHeader } from "@/features/web/_shared/site-header";
import { ChangeAccountTypeCard } from "@/features/web/profile/change-acc-type";
import { DeleteUserCard } from "@/features/web/profile/delete-account";
import { DisplayNameCard } from "@/features/web/profile/display-name";
import { EmailCard } from "@/features/web/profile/email";
import { UserImageCard } from "@/features/web/profile/user-image";
import { UserNameCard } from "@/features/web/profile/user-name";
import { preloadAuthQuery } from "@/lib/auth-server";
export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your profile",
};

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="container sticky top-0 z-50 bg-background">
        <SiteHeader />
      </div>
      <Container>
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfilePageCards />
        </Suspense>
      </Container>
    </div>
  );
}

async function ProfilePageCards() {
  const preloadedUserQuery = await preloadAuthQuery(api.auth.getCurrentUser);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 lg:space-y-12">
      <UserImageCard preloadedUserQuery={preloadedUserQuery} />
      <DisplayNameCard preloadedUserQuery={preloadedUserQuery} />
      <UserNameCard preloadedUserQuery={preloadedUserQuery} />
      <EmailCard preloadedUserQuery={preloadedUserQuery} />
      <ChangeAccountTypeCard />
      <DeleteUserCard />
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 lg:space-y-12">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton className="h-50 w-full" key={index} />
      ))}
    </div>
  );
}
