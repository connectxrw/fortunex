"use client";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useFilters } from "@/lib/nuqs-params";
import { NotificationActions } from "./actions";
import { EmptyNotifications } from "./empty";

export function NotificationsList() {
  const [{ status }] = useFilters();
  const notificationsList = useQuery(api.notification.getMyNotifications, {});
  if (notificationsList?.success === false) {
    return null;
  }
  if (notificationsList?.data === undefined) {
    return <NotificationsListSkeleton />;
  }
  if (notificationsList.data?.length === 0) {
    return <EmptyNotifications />;
  }
  let notifications = notificationsList.data;
  if (notifications === null) {
    return <EmptyNotifications />;
  }

  if (status === "archived") {
    notifications = notifications.filter(
      (notification) => notification.status === "archived",
    );
  }
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      {notifications?.map((notification, index) => (
        <Item key={index} variant={index % 2 === 0 ? "default" : "muted"}>
          <ItemMedia>
            <Avatar className="size-10">
              <AvatarImage
                src={
                  notification.senderAvatarUrl ||
                  "https://github.com/evilrabbit.png"
                }
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <Link
            className="flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none"
            href={
              notification.postSlug
                ? `?p=${notification.postSlug}`
                : `/b/${notification.businessHandle}`
            }
            key={index}
          >
            <ItemContent>
              <ItemTitle>{notification.title}</ItemTitle>
              <ItemDescription>{notification.message}</ItemDescription>
            </ItemContent>
          </Link>
          <ItemContent>
            <ItemDescription>
              {formatDistanceToNow(notification.createdAt)}
            </ItemDescription>
          </ItemContent>

          <ItemActions>
            <NotificationActions
              businessHandle={notification.businessHandle}
              isArchived={notification.status === "archived"}
              isRead={notification.isRead}
              notificationId={notification._id}
              postSlug={notification.postSlug}
            />
          </ItemActions>
        </Item>
      ))}
    </div>
  );
}

export function NotificationsListSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton className="h-16" key={index} />
      ))}
    </div>
  );
}
