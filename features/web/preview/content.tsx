"use client";
import { ArrowUpIcon } from "lucide-react";
import { CarouselDots } from "@/components/custom/carousel-dots";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useFilters } from "@/lib/nuqs-params";
import { ExpandableText } from "../_shared/expand-texts";

export default function PreviewContent() {
  const [{ preview }] = useFilters();
  return (
    <div className="flex flex-col gap-5">
      <Carousel
        className="group relative aspect-video h-full w-full rounded-lg bg-muted"
        opts={{
          loop: true,
          dragFree: true,
        }}
      >
        <div className="overflow-hidden rounded-lg">
          <CarouselContent>
            {[...preview.images].reverse().map((image, i) => (
              <CarouselItem className="overflow-x-hidden rounded-lg" key={i}>
                <AspectRatio
                  className="cursor-pointer overflow-hidden rounded-lg"
                  ratio={16 / 9}
                >
                  <img
                    alt={preview.title}
                    className="h-full w-full rounded-lg object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
                    height={175}
                    src={image}
                    width={310}
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>

        {preview.images.length > 1 && (
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
      <div className="flex flex-wrap justify-between gap-1">
        {preview?.title && (
          <h3 className="font-medium text-xl tracking-tight">
            {preview?.title}
          </h3>
        )}
        {preview?.price && (
          <p className="text-foreground/90">
            {/* i want to format price 1,000 */}
            Price:{" "}
            <span className="font-medium">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: preview?.currency || "RWF",
              }).format(Number(preview?.price))}
            </span>
          </p>
        )}
      </div>
      <div className="flex w-full gap-3">
        {preview?.ctaLink && (
          <Button
            aria-label={preview?.ctaLabel}
            asChild
            className="rounded-full"
          >
            <a
              href={`${preview.ctaLink}?utm_source=tux.com&utm_medium=referral&utm_campaign`}
              target="_blank"
            >
              <ArrowUpIcon />
              {preview.ctaLabel && preview.ctaLabel?.length > 10
                ? `${preview.ctaLabel.slice(0, 10)}...`
                : preview.ctaLabel}
            </a>
          </Button>
        )}
      </div>

      <ExpandableText text={preview?.content} words={30} />
    </div>
  );
}
