"use client";

import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

const DAYS = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
] as const;

type Day = (typeof DAYS)[number]["key"];

type DayHours = {
  day: Day;
  open: string;
  close: string;
  closed: boolean;
};

const DEFAULT_HOURS: DayHours[] = DAYS.map(({ key }) => ({
  day: key,
  open: "09:00",
  close: "22:00",
  closed: false,
}));

function toEditorState(
  saved: { day: string; open?: string; close?: string; closed: boolean }[] | undefined,
): DayHours[] {
  if (!saved?.length) return DEFAULT_HOURS;
  return DAYS.map(({ key }) => {
    const existing = saved.find((h) => h.day === key);
    return existing
      ? {
          day: key,
          open: existing.open ?? "09:00",
          close: existing.close ?? "22:00",
          closed: existing.closed,
        }
      : { day: key, open: "09:00", close: "22:00", closed: false };
  });
}

export function BusinessHours({
  openingHours,
}: {
  openingHours:
    | { day: string; open?: string; close?: string; closed: boolean }[]
    | undefined;
}) {
  const updateBusinessHours = useMutation(api.business.index.updateBusinessHours);
  const [hours, setHours] = useState<DayHours[]>(() =>
    toEditorState(openingHours),
  );
  const [isLoading, setIsLoading] = useState(false);

  const updateDay = (day: Day, patch: Partial<Omit<DayHours, "day">>) => {
    setHours((prev) =>
      prev.map((h) => (h.day === day ? { ...h, ...patch } : h)),
    );
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateBusinessHours({
        openingHours: hours.map((h) => ({
          day: h.day,
          open: h.closed ? undefined : h.open,
          close: h.closed ? undefined : h.close,
          closed: h.closed,
        })),
      });
      toast.success("Opening hours updated");
    } catch (error) {
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to update hours");
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to update hours",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Opening Hours</FieldLegend>

          <div className="divide-y rounded-lg border">
            {hours.map((h) => (
              <div
                className="flex items-center gap-3 px-4 py-3"
                key={h.day}
              >
                {/* Day label */}
                <span className="w-8 shrink-0 text-sm font-medium capitalize">
                  {DAYS.find((d) => d.key === h.day)?.label}
                </span>

                {/* Open / Closed toggle */}
                <button
                  className={cn(
                    "shrink-0 rounded-full px-3 py-0.5 text-xs font-medium transition-colors",
                    h.closed
                      ? "bg-muted text-muted-foreground"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
                  )}
                  onClick={() => updateDay(h.day, { closed: !h.closed })}
                  type="button"
                >
                  {h.closed ? "Closed" : "Open"}
                </button>

                {/* Time range */}
                {!h.closed && (
                  <div className="flex items-center gap-2">
                    <Input
                      className="w-24"
                      disabled={isLoading}
                      onChange={(e) => updateDay(h.day, { open: e.target.value })}
                      type="time"
                      value={h.open}
                    />
                    <span className="text-muted-foreground text-xs">–</span>
                    <Input
                      className="w-24"
                      disabled={isLoading}
                      onChange={(e) => updateDay(h.day, { close: e.target.value })}
                      type="time"
                      value={h.close}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </FieldSet>
      </FieldGroup>

      <Button
        className="mt-4 rounded-full"
        disabled={isLoading}
        onClick={handleSave}
        size="sm"
        type="button"
        variant="secondary"
      >
        {isLoading ? "Saving..." : "Save Hours"}
      </Button>
    </div>
  );
}
