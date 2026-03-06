"use client";

import { LocateIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/lib/nuqs-params";
import { useNearMe } from "@/lib/use-near-me";
import { cn } from "@/lib/utils";
import { NearMeDialog } from "./near-me-dialog";

export function NearMeButton({ className }: { className?: string }) {
  const [{ nearMe }] = useFilters();
  const { coordinates } = useNearMe();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"idle" | "active">("idle");

  const isActive = nearMe && !!coordinates;

  const handleClick = () => {
    if (isActive) {
      // Show the "active" state in the dialog so user can turn off
      setDialogMode("active");
    } else {
      setDialogMode("idle");
    }
    setDialogOpen(true);
  };

  const [{ category }] = useFilters();

  // Only show on the restaurant tab; filters.tsx clears nearMe when leaving it
  if (category !== "restaurant") {
    return null;
  }

  return (
    <>
      <Button
        className={cn(
          "gap-1.5 rounded-full transition-all duration-200",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary"
            : "bg-secondary text-primary hover:bg-secondary-foreground/10",
          className,
        )}
        onClick={handleClick}
        variant={isActive ? "default" : "ghost"}
      >
        <LocateIcon className="h-4 w-4" />
        <span className="font-normal text-sm max-md:font-medium">Near Me</span>
        {isActive && (
          <span className="mr-0.5 ml-0.5 h-1.5 w-1.5 rounded-full bg-emerald-600" />
        )}
      </Button>

      <NearMeDialog
        initialState={dialogMode}
        onOpenChange={setDialogOpen}
        open={dialogOpen}
      />
    </>
  );
}

/** Floating version for mobile screens */
export function NearMeFloatingButton() {
  const [{ category }] = useFilters();

  // Only show on the restaurant tab; filters.tsx clears nearMe when leaving it
  if (category !== "restaurant") {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-60 flex justify-center md:hidden">
      <div className="pointer-events-auto">
        <NearMeButton
          className={cn(
            "h-11 bg-black px-5 text-muted shadow-2xl shadow-black/10 hover:scale-105 hover:bg-primary hover:text-muted dark:bg-white dark:hover:bg-white",
          )}
        />
      </div>
    </div>
  );
}
