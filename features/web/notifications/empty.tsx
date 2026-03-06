import { BellIcon } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function EmptyNotifications() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BellIcon />
        </EmptyMedia>
        <EmptyTitle>No Notifications Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t received any notifications yet.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
