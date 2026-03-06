import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: 12 }).map((_, index) => (
        <div className="space-y-3" key={index}>
          <AspectRatio ratio={4 / 3}>
            <Skeleton className="block aspect-4/3 w-full rounded-xl" />
          </AspectRatio>
          <div className="flex gap-2">
            <Skeleton className="size-8 rounded-full lg:size-9" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
