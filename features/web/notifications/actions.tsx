import { useMutation } from "convex/react";
import {
  ArchiveIcon,
  ArchiveXIcon,
  CheckIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export function NotificationActions({
  isRead,
  isArchived,
  notificationId,
  postSlug,
  businessHandle,
}: {
  isRead: boolean;
  isArchived: boolean;
  notificationId: Id<"notifications">;
  postSlug?: string;
  businessHandle?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const toggleNotificationAsRead = useMutation(
    api.notification.toggleNotificationAsRead,
  );
  const toggleNotificationAsArchived = useMutation(
    api.notification.toggleNotificationAsArchived,
  );
  const deleteNotification = useMutation(api.notification.deleteNotification);

  const handleMarkAsRead = async () => {
    try {
      setIsLoading(true);
      const response = await toggleNotificationAsRead({ notificationId });
      if (response.success === false) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  const handleMarkAsArchived = async () => {
    try {
      setIsLoading(true);
      const response = await toggleNotificationAsArchived({ notificationId });
      if (response.success === false) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await deleteNotification({ notificationId });
      if (response.success === false) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon-sm" variant="ghost">
          <EllipsisVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <Link href={postSlug ? `?p=${postSlug}` : `/b/${businessHandle}`}>
          <DropdownMenuItem>
            <EyeIcon />
            View
          </DropdownMenuItem>
        </Link>

        {isRead ? (
          <DropdownMenuItem disabled={isLoading} onClick={handleMarkAsRead}>
            <XIcon />
            Mark as unread
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem disabled={isLoading} onClick={handleMarkAsRead}>
            <CheckIcon />
            Mark as read
          </DropdownMenuItem>
        )}
        {isArchived ? (
          <DropdownMenuItem disabled={isLoading} onClick={handleMarkAsArchived}>
            <ArchiveXIcon />
            Unarchive
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem disabled={isLoading} onClick={handleMarkAsArchived}>
            <ArchiveIcon />
            Archive
          </DropdownMenuItem>
        )}
        <DropdownMenuItem disabled={isLoading} onClick={handleDelete}>
          <TrashIcon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
