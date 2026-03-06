"use client";

import {
  EllipsisIcon,
  FlagIcon,
  Redo2Icon,
  Share2Icon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Doc } from "@/convex/_generated/dataModel";
import { useFilters } from "@/lib/nuqs-params";
import type { TBusiness } from "@/types";
import { ReportPostDialog } from "../report";

type PostWithMeta = Doc<"post"> & {
  coverImages: { key: string; url: string }[];
  postBusiness: TBusiness;
  likesCount: number;
};

export function UnAuthMoreButton({ post }: { post: PostWithMeta }) {
  const [{ post: currentPost }, setSearchParams] = useFilters();
  const [openReportDialog, setOpenReportDialog] = useState(false);

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
            <DropdownMenuItem onClick={handleShare}>
              <Share2Icon />
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenReportDialog(true)}>
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
              icon={<Share2Icon className="size-4" />}
              label="Share"
              onClick={handleShare}
            />
          </div>
          <div className="flex flex-col gap-4 p-4">
            <DrawerButton
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
    </>
  );
}
