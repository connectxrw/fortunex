import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/custom/container";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/features/web/_shared/site-header";
import { NotificationFilters } from "@/features/web/notifications/filters";
import {
  NotificationsList,
  NotificationsListSkeleton,
} from "@/features/web/notifications/list";
export const metadata: Metadata = {
  title: "Notifications",
  description: "Manage your notifications",
};
export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="container sticky top-0 z-50 bg-background">
        <SiteHeader />
      </div>

      <Container>
        <Suspense fallback={<Skeleton className="h-12 w-25" />}>
          <NotificationFilters />
        </Suspense>
        <Suspense fallback={<NotificationsListSkeleton />}>
          <NotificationsList />
        </Suspense>
      </Container>
    </div>
  );
}
