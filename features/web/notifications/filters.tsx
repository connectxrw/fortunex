"use client";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/lib/nuqs-params";
import { cn } from "@/lib/utils";

export  function NotificationFilters() {
  const [{ status }, setSearchParams] = useFilters();
  const onClear = () => setSearchParams({ status: "all" });
  return (
    <div className="flex w-fit items-center gap-1 rounded-lg p-1 ring ring-muted">
      <Button
        className={cn(status === "all" ? "" : "text-muted-foreground")}
        onClick={onClear}
        size="sm"
        variant={status === "all" ? "secondary" : "ghost"}
      >
        Inbox
      </Button>
      <Button
        className={cn(status === "archived" ? "" : "text-muted-foreground")}
        onClick={() => setSearchParams({ status: "archived" })}
        size="sm"
        variant={status === "archived" ? "secondary" : "ghost"}
      >
        Archived
      </Button>
    </div>
  );
}
