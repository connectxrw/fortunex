"use client";
import { Authenticated, Unauthenticated } from "convex/react";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useFilters } from "@/lib/nuqs-params";
import { AuthPanelContent } from "./auth-content";
import { UnAuthPanelContent } from "./unauth-content";

export default function Panel() {
  const [{ post }, setSearchParams] = useFilters();

  // Derive panel open state from URL
  const isOpen = post && post !== "";

  const onClose = () => {
    setSearchParams({ post: "" });
  };

  if (!isOpen) {
    return null;
  }
  return (
    <Sheet onOpenChange={onClose} open={isOpen}>
      <SheetContent
        className="no-scrollbar w-full overflow-y-auto data-[side=right]:w-full lg:data-[side=right]:w-3/4 2xl:data-[side=right]:max-w-lg dark:bg-black"
        showCloseButton={false}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Post {post}</SheetTitle>
        </SheetHeader>
        <div className="sticky top-0 z-50 flex justify-end p-2">
          <Button
            className="rounded-full"
            onClick={onClose}
            size="icon"
            variant="secondary"
          >
            <XIcon />
          </Button>
        </div>
        <div className="@container/main relative flex h-fit flex-1 flex-col gap-5 px-2 pb-4 lg:px-4">
          <Authenticated>
            <AuthPanelContent slug={post} />
          </Authenticated>
          <Unauthenticated>
            <UnAuthPanelContent slug={post} />
          </Unauthenticated>
        </div>
      </SheetContent>
    </Sheet>
  );
}
