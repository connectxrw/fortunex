import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import Link from "next/link";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

export function BusinessPageBtns({
  className,
  isMyBusiness,
  isFollowing,
  businessId,
  onPanel,
}: {
  className?: string;
  isMyBusiness: boolean;
  isFollowing: boolean;
  businessId: Id<"business">;
  onPanel?: boolean;
}) {
  const followMutation = useMutation(api.user.follow.followBusiness);
  const unfollowMutation = useMutation(api.user.follow.unfollowBusiness);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    try {
      setIsLoading(true);
      const result = await followMutation({ businessId });
      toast.success(`Business "${result.name}" followed successfully`);
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to follow business");
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to follow business",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async () => {
    try {
      setIsLoading(true);
      const result = await unfollowMutation({ businessId });
      toast.success(`Business "${result.name}" unfollowed successfully`);
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to unfollow business");
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to unfollow business",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {isMyBusiness ? (
        <>
          <Button
            asChild
            className="w-fit rounded-full"
            size={onPanel ? "sm" : "default"}
            variant={"secondary"}
          >
            <Link href="/customize">Customize page</Link>
          </Button>
          <Button
            asChild
            className={cn("w-fit rounded-full", onPanel && "hidden")}
            variant={"secondary"}
          >
            <Link href="/posts">Manage posts</Link>
          </Button>
        </>
      ) : (
        <Fragment>
          {isFollowing ? (
            <Button
              className="w-fit rounded-full"
              disabled={isLoading}
              onClick={handleUnfollow}
              size={onPanel ? "sm" : "default"}
            >
              {isLoading ? <Spinner /> : null}
              {isLoading ? "Unfollowing..." : "Unfollow Us"}
            </Button>
          ) : (
            <Button
              className="w-fit rounded-full"
              disabled={isLoading}
              onClick={handleFollow}
              size={onPanel ? "sm" : "default"}
            >
              {isLoading ? <Spinner /> : null}
              {isLoading ? "Following..." : "Follow Us"}
            </Button>
          )}
        </Fragment>
      )}
    </div>
  );
}
