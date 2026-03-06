"use client";
import { subcategoryFilters } from "@/config/data";
import { cn } from "@/lib/utils";

export function SubcategoryChips({
  businessCategory,
  value,
  onChange,
}: {
  businessCategory: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const subs = subcategoryFilters[businessCategory];
  if (!subs?.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <span className="font-medium text-sm">Subcategory (optional)</span>
        <span className="text-muted-foreground text-sm">
          Help users discover your post more easily.
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {subs.map((sub) => (
          <button
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              value === sub.value
                ? "border-foreground bg-foreground font-medium text-background"
                : "border-border bg-muted text-muted-foreground hover:border-foreground/40 hover:text-foreground",
            )}
            key={sub.value}
            onClick={() => onChange(value === sub.value ? "" : sub.value)}
            type="button"
          >
            {sub.label}
          </button>
        ))}
      </div>
    </div>
  );
}
