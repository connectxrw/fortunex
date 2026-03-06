"use client";
import { Button } from "@/components/ui/button";
import { subcategoryFilters } from "@/config/data";

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
          <Button
            className="rounded-full"
            key={sub.value}
            onClick={() => onChange(value === sub.value ? "" : sub.value)}
            size={"sm"}
            type="button"
            variant={value === sub.value ? "default" : "secondary"}
          >
            {sub.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
