"use client";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/lib/nuqs-params";
import PreviewContent from "./content";

export default function PreviewPost() {
  const [{ preview }, setSearchParams] = useFilters();

  // Derive panel open state from URL
  const isOpen = preview?.open as boolean;

  const onClose = () => {
    setSearchParams({ preview: { ...preview, open: false } });
  };

  if (!isOpen) return null;
  return (
    <>
      <div className="sticky top-0 hidden max-h-screen w-full max-w-1/3 bg-background lg:flex">
        <div className="no-scrollbar h-full w-full overflow-y-auto">
          <div className="sticky top-0 z-50 flex items-center justify-end gap-2 p-2">
            <Button
              className="rounded-full"
              onClick={onClose}
              size="icon"
              variant="secondary"
            >
              <XIcon />
            </Button>
          </div>
          <div className="@container/main relative flex h-fit flex-1 flex-col gap-5 px-2 py-4 lg:px-4">
            <PreviewContent />
          </div>
        </div>
      </div>

      <div
        className="no-scrollbar data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col gap-4 overflow-y-auto border-l bg-background shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:duration-300 data-[state=open]:duration-500 sm:max-w-sm lg:hidden lg:w-3/4"
        data-state={isOpen ? "open" : "closed"}
      >
        <div className="flex justify-end p-2">
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
          <PreviewContent />
        </div>
      </div>
    </>
  );
}
