"use client";

import { LayoutGridIcon, StoreIcon } from "lucide-react";
import { useFilters } from "@/lib/nuqs-params";
import { cn } from "@/lib/utils";

export function ViewTabs() {
  const [{ view }, setSearchParams] = useFilters();

  return (
    <div className="flex gap-1 rounded-full bg-muted p-1 w-fit">
      <button
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors",
          view === "products"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
        onClick={() => setSearchParams({ view: "products", subcategory: "" })}
        type="button"
      >
        <LayoutGridIcon className="size-3.5" />
        Products
      </button>
      <button
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors",
          view === "merchants"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
        onClick={() => setSearchParams({ view: "merchants", subcategory: "" })}
        type="button"
      >
        <StoreIcon className="size-3.5" />
        Merchants
      </button>
    </div>
  );
}
