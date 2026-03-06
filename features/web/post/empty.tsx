"use client";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useFilters } from "@/lib/nuqs-params";

export function EmptyPosts() {
  const [{ category, q }, setSearchParams] = useFilters();
  return (
    <Empty className="h-full">
      <EmptyHeader>
        <EmptyMedia className="bg-transparent" variant="icon">
          <SearchIcon />
        </EmptyMedia>

        <EmptyTitle>Get AI Results</EmptyTitle>

        <EmptyDescription>
          {category && "Search for posts  in any  category easily."}{" "}
          {q && `Search for ${q} with ai`}
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <div className="flex gap-2">
          <Button
            className="rounded-full"
            onClick={() => setSearchParams({ ai: true })}
            variant={"secondary"}
          >
            Continue with AI
          </Button>

          {q && (
            <Button
              className="rounded-full"
              onClick={() => setSearchParams({ q: "" })}
              variant="secondary"
            >
              Clear Search
            </Button>
          )}
        </div>
      </EmptyContent>
    </Empty>
  );
}
