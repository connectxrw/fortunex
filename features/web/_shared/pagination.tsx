import { Button } from "@/components/ui/button";

export function PaginationActions({
  hasMore,
  onLoadMore,
}: {
  hasMore: boolean;
  onLoadMore: () => void;
}) {
  if (!hasMore) {
    return null;
  }

  return (
    <div className="flex items-center justify-center">
      {hasMore && (
        <Button
          className="w-fit rounded-full dark:bg-background"
          onClick={onLoadMore}
        >
          Load More
        </Button>
      )}
    </div>
  );
}
