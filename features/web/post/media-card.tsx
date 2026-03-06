import { CarouselDots } from "@/components/custom/carousel-dots";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import type { TBusiness } from "@/types";

export function PostMediaCard({
  post,
  onClick,
  className,
}: {
  post: Doc<"post"> & {
    coverImages: { key: string; url: string }[];
    postBusiness: TBusiness;
  };
  onClick: () => void;
  className?: string;
}) {
  return (
    <Carousel
      className={cn(
        "group relative h-full w-full rounded-lg bg-muted",
        className,
      )}
      opts={{
        loop: true,
        dragFree: true,
      }}
    >
      <div className="overflow-hidden rounded-lg">
        <CarouselContent>
          {[...post.coverImages].reverse().map((image, i) => (
            <CarouselItem className="overflow-x-hidden rounded-lg" key={i}>
              <AspectRatio
                className="cursor-pointer overflow-hidden rounded-lg"
                onClick={onClick}
                ratio={4 / 3}
              >
                <img
                  alt={post.title}
                  className="h-full w-full rounded-lg object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
                  height={262}
                  src={image.url}
                  width={350}
                />
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>

      {post.coverImages.length > 1 && (
        <>
          <div className="absolute top-1/2 w-full justify-between group-hover:flex lg:hidden">
            <CarouselPrevious
              className="absolute left-2 bg-background/50"
              variant={"ghost"}
            />
            <CarouselNext
              className="absolute right-2 bg-background/50"
              variant={"ghost"}
            />
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <CarouselDots />
          </div>
        </>
      )}
    </Carousel>
  );
}
