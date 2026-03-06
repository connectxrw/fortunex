"use client";

import {
  AlertCircleIcon,
  LoaderIcon,
  LocateFixedIcon,
  LocateIcon,
  MapPinIcon,
  MapPinOffIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFilters } from "@/lib/nuqs-params";
import { useNearMe } from "@/lib/use-near-me";
import { cn } from "@/lib/utils";

type DialogState = "idle" | "detecting" | "denied" | "success" | "active";

export function NearMeDialog({
  open,
  onOpenChange,
  initialState = "idle",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialState?: DialogState;
}) {
  const [state, setState] = useState<DialogState>(initialState);
  const { detectLocation, clearLocation } = useNearMe();
  const [, setFilters] = useFilters();

  // Sync state when dialog opens
  useEffect(() => {
    if (open) {
      setState(initialState);
    }
  }, [open, initialState]);

  const handleDetect = async () => {
    setState("detecting");
    try {
      await detectLocation();
      setState("success");
      await setFilters({ category: "restaurant", nearMe: true });
      setTimeout(() => onOpenChange(false), 900);
    } catch {
      setState("denied");
    }
  };

  const handleTurnOff = async () => {
    clearLocation();
    await setFilters({ nearMe: false });
    onOpenChange(false);
  };

  const handleClose = () => {
    setState("idle");
    onOpenChange(false);
  };

  const isActive = state === "active";
  const isDenied = state === "denied";
  const isSuccess = state === "success";
  const isDetecting = state === "detecting";

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent
        className="z-65 overflow-hidden rounded-3xl p-0 font-roboto sm:max-w-sm"
        showCloseButton={!isDetecting}
      >
        {/* Hero section */}
        <div
          className={cn(
            "flex flex-col items-center gap-3 px-6 pt-8 pb-10 text-center transition-colors duration-300",
            isSuccess
              ? "bg-linear-to-b from-emerald-50 to-transparent dark:from-emerald-950/30"
              : isDenied
                ? "bg-linear-to-b from-red-50 to-transparent dark:from-red-950/20"
                : isActive
                  ? "bg-linear-to-b from-primary/8 to-transparent"
                  : "bg-linear-to-b from-primary/5 to-transparent",
          )}
        >
          {/* Icon */}
          <div className={cn("flex h-16 w-16 items-center justify-center")}>
            {isDenied ? (
              <AlertCircleIcon className="h-8 w-8 text-destructive" />
            ) : isSuccess ? (
              <LocateFixedIcon className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            ) : isDetecting ? (
              <LoaderIcon
                className="h-8 w-8 animate-spin text-primary"
                style={{ animationDuration: "2s" }}
              />
            ) : isActive ? (
              <LocateFixedIcon className="h-8 w-8 text-primary" />
            ) : (
              <LocateIcon className="h-8 w-8 text-primary" />
            )}
          </div>

          {/* Text */}
          <DialogHeader className="gap-1">
            <DialogTitle className="text-lg">
              {isDenied
                ? "Location access denied"
                : isDetecting
                  ? "Finding your location…"
                  : isSuccess
                    ? "Location found!"
                    : isActive
                      ? "Near Me is on"
                      : "Find restaurants near you"}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              {isDenied ? (
                <>
                  Enable location access in your browser settings (look for the
                  location icon in the address bar and allow access), then try
                  again.
                </>
              ) : isDetecting ? (
                "Hang tight while we pinpoint your location."
              ) : isSuccess ? (
                "Showing restaurants sorted by distance from you."
              ) : isActive ? (
                <>Results are sorted by distance from your current location.</>
              ) : (
                "We'll sort restaurants by distance so you can find what's closest to you right now."
              )}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Actions */}
        {!isSuccess && (
          <div className="flex flex-col gap-2 px-6 pb-6">
            {isDenied ? (
              <>
                <Button
                  className="flex h-11 w-full items-center gap-2 rounded-full text-sm"
                  onClick={handleDetect}
                >
                  Try again
                </Button>
                {/* <Button
                  className="w-full rounded-full h-11 text-sm flex items-center"
                  onClick={handleClose}
                  variant="ghost"
                >
                  Maybe later
                </Button> */}
              </>
            ) : isDetecting ? (
              <Button
                className="flex h-11 w-full items-center gap-2 rounded-full text-sm"
                disabled
                variant="secondary"
              >
                Detecting…
              </Button>
            ) : isActive ? (
              <>
                <Button
                  className="flex h-11 w-full items-center gap-2 rounded-full text-destructive text-sm hover:text-destructive"
                  onClick={handleTurnOff}
                  variant="outline"
                >
                  <MapPinOffIcon className="h-4 w-4" />
                  Turn off Near Me
                </Button>
                {/* <Button
                  className="w-full rounded-full h-11 text-sm flex items-center"
                  onClick={handleClose}
                  variant="ghost"
                >
                  Keep it on
                </Button> */}
              </>
            ) : (
              <>
                <Button
                  className="flex h-11 w-full items-center gap-2 rounded-full text-sm"
                  onClick={handleDetect}
                >
                  <MapPinIcon className="h-4 w-4" />
                  Use my current location
                </Button>
                {/* <Button
                  className="w-full rounded-full h-11 text-sm flex items-center"
                  onClick={handleClose}
                  variant="ghost"
                >
                  Maybe later
                </Button> */}
                <p className="pt-1 text-center text-[10px] text-muted-foreground">
                  Your location is only used to sort results and is never stored
                  on our servers.
                </p>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
