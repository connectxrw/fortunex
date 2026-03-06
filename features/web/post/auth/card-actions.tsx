"use client";

import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import {
  ArrowUpRightIcon,
  BookmarkIcon,
  EllipsisIcon,
  FlagIcon,
  HeartIcon,
  PenIcon,
  Redo2Icon,
  Share2Icon,
  TrashIcon,
  Undo2Icon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerButton,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { useFilters } from "@/lib/nuqs-params";
import { cn } from "@/lib/utils";
import type { TBusiness } from "@/types";
import { ReportPostDialog } from "../report";

type PostWithMeta = Doc<"post"> & {
  coverImages: { key: string; url: string }[];
  postBusiness: TBusiness;
  isMine: boolean;
  saved: boolean;
  liked: boolean;
  likesCount: number;
};

// ─── Like Button ─────────────────────────────────────────────────────────────

export function AuthLikeButton({ post }: { post: PostWithMeta }) {
  const toggleLike = useMutation(api.user.post.toggleLikePost);
  const [isLiking, setIsLiking] = useState(false);

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsLiking(true);
      const result = await toggleLike({
        postId: post._id,
        liked: !post.liked,
      });
      if (!result.success) {
        toast.error(result.message);
      }
    } catch (error) {
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to like post");
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to like post"
        );
      }
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <button
      aria-label={post.liked ? "Unlike" : "Like"}
      className={cn(
        "absolute top-2 right-2 z-20 flex size-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-colors hover:bg-black/60"
      )}
      onClick={handleToggleLike}
      type="button"
    >
      {isLiking ? (
        <Spinner className="size-4 text-white" />
      ) : (
        <HeartIcon
          className={cn(
            "size-4 transition-colors",
            post.liked
              ? "fill-red-400 text-red-400"
              : "fill-white/20 text-white"
          )}
        />
      )}
    </button>
  );
}

// ─── Save Button ──────────────────────────────────────────────────────────────

export function AuthSaveButton({ post }: { post: PostWithMeta }) {
  const toggleSave = useMutation(api.user.post.toggleSavePost);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsSaving(true);
      const result = await toggleSave({
        postId: post._id,
        saved: !post.saved,
      });
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to save post");
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to save post"
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      aria-label={post.saved ? "Unsave" : "Save"}
      className="flex size-8 items-center justify-center rounded-full bg-white text-black shadow-sm transition-colors hover:bg-white/90 disabled:opacity-60"
      disabled={isSaving}
      onClick={handleToggleSave}
      type="button"
    >
      {isSaving ? (
        <Spinner className="size-4 text-white" />
      ) : (
        <BookmarkIcon
          className={cn(
            "size-4 transition-colors",
            post.saved ? "fill-black text-black" : "text-black"
          )}
        />
      )}
    </button>
  );
}

// ─── More Button (dropdown / drawer) ─────────────────────────────────────────

export function AuthMoreButton({ post }: { post: PostWithMeta }) {
  const [{ post: currentPost }, setSearchParams] = useFilters();
  const updatePostStatus = useMutation(api.business.post.updatePostStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openReportDialog, setOpenReportDialog] = useState(false);

  const handleUpdatePostStatus = async (status: "published" | "draft") => {
    try {
      setIsLoading(true);
      const result = await updatePostStatus({ id: post._id, status });
      toast.success(`Post status updated to ${result.status}`);
    } catch (error) {
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to update post status");
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to update post status"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post.title,
        text: post.content,
        url: `/?post=${post.slug}`,
      });
    } else {
      await navigator.clipboard.writeText(`/?post=${post.slug}`);
      toast("Link copied to clipboard.");
    }
  };

  return (
    <>
      {/* Desktop dropdown */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="More options"
            className="hidden lg:flex size-8 items-center justify-center rounded-full bg-white text-black shadow-sm transition-colors hover:bg-white/90"
            type="button"
          >
            <EllipsisIcon className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52" side="right">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() =>
                currentPost === post.slug
                  ? setSearchParams({ post: "" })
                  : setSearchParams({ post: post.slug })
              }
            >
              <Redo2Icon className="rotate-180" />
              <span>{currentPost === post.slug ? "Close" : "Open"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled={isLoading} onClick={handleShare}>
              <Share2Icon />
              <span>Share</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          {post.isMine && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href={`/posts/edit/${post.slug}`}>
                    <PenIcon />
                    <span>Edit</span>
                  </Link>
                </DropdownMenuItem>
                {post.status === "published" ? (
                  <DropdownMenuItem
                    disabled={isLoading}
                    onClick={() => handleUpdatePostStatus("draft")}
                  >
                    <Undo2Icon />
                    <span>Unpost</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    disabled={isLoading}
                    onClick={() => handleUpdatePostStatus("published")}
                  >
                    <ArrowUpRightIcon />
                    <span>Post</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={() => setOpenDeleteDialog(true)}>
                  <TrashIcon />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setOpenReportDialog(true)}>
              <FlagIcon />
              <span>Report</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Mobile drawer */}
      <Drawer>
        <DrawerTrigger asChild>
          <button
            aria-label="More options"
            className="lg:hidden flex size-8 items-center justify-center rounded-full bg-white text-black shadow-sm transition-colors hover:bg-white/90"
            type="button"
          >
            <EllipsisIcon className="size-4" />
          </button>
        </DrawerTrigger>
        <DrawerContent className="rounded-t-md!">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Post Actions</DrawerTitle>
            <DrawerDescription>Post actions</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-4 border-b p-4">
            <DrawerButton
              icon={<Redo2Icon className="size-4 rotate-180" />}
              label={currentPost === post.slug ? "Close" : "Open"}
              onClick={() =>
                currentPost === post.slug
                  ? setSearchParams({ post: "" })
                  : setSearchParams({ post: post.slug })
              }
            />
            <DrawerButton
              disabled={isLoading}
              icon={<Share2Icon className="size-4" />}
              label="Share"
              onClick={handleShare}
            />
          </div>

          {post.isMine && (
            <div className="flex flex-col gap-4 border-b p-4">
              <Link className="flex items-center gap-2" href={`/posts/edit/${post.slug}`}>
                <PenIcon className="size-4" />
                <span>Edit</span>
              </Link>
              {post.status === "published" ? (
                <DrawerButton
                  disabled={isLoading}
                  icon={<Undo2Icon className="size-4" />}
                  label="Unpost"
                  onClick={() => handleUpdatePostStatus("draft")}
                />
              ) : (
                <DrawerButton
                  disabled={isLoading}
                  icon={<ArrowUpRightIcon className="size-4" />}
                  label="Post"
                  onClick={() => handleUpdatePostStatus("published")}
                />
              )}
              <DrawerButton
                disabled={isLoading}
                icon={<TrashIcon className="size-4" />}
                label="Delete"
                onClick={() => setOpenDeleteDialog(true)}
              />
            </div>
          )}

          <div className="flex flex-col gap-4 p-4">
            <DrawerButton
              disabled={isLoading}
              icon={<FlagIcon className="size-4" />}
              label="Report"
              onClick={() => setOpenReportDialog(true)}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <ReportPostDialog
        businessHandle={post.postBusiness.handle || ""}
        businessName={post.postBusiness.name || ""}
        open={openReportDialog}
        postId={post._id}
        postSlug={post.slug}
        postTitle={post.title}
        setOpen={setOpenReportDialog}
      />
      <DeletePostAlertDialog
        open={openDeleteDialog}
        postId={post._id}
        postTitle={post.title}
        setOpen={setOpenDeleteDialog}
      />
    </>
  );
}

// ─── Delete Dialog ────────────────────────────────────────────────────────────

export function DeletePostAlertDialog({
  postId,
  postTitle,
  open,
  setOpen,
}: {
  postId: Id<"post">;
  postTitle: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const deletePost = useMutation(api.business.post.deletePost);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeletePost = async () => {
    try {
      setIsLoading(true);
      await deletePost({ postId });
      toast.success("Post deleted successfully");
      setOpen(false);
    } catch (error) {
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to delete post");
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete post"
        );
      }
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogContent className="lg:min-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your post{" "}
            <span className="font-semibold">{postTitle}</span> and will never be
            seen by anyone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={handleDeletePost}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
