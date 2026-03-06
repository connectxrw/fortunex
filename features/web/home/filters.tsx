"use client";
import { LayoutGridIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { homeFilters, myPostFilters, subcategoryFilters } from "@/config/data";
import { useFilters } from "@/lib/nuqs-params";
import { useNearMe } from "@/lib/use-near-me";
import { cn } from "@/lib/utils";
import { NearMeButton } from "./near-me-button";

export default function FilterBtns({
  page,
  by,
}: {
  page: "home" | "my-posts";
  by: "category" | "status";
}) {
  const [{ category, status, subcategory, nearMe }, setSearchParams] =
    useFilters();
  const { clearLocation } = useNearMe();
  const filters = page === "home" ? homeFilters : myPostFilters;

  const activeSubs =
    page === "home" ? (subcategoryFilters[category] ?? []) : [];
  const hasSubcategories = activeSubs.length > 0;

  const handleCategoryClick = (value: string) => {
    const params: Record<string, unknown> = { [by]: value, subcategory: "" };
    if (nearMe && value !== "restaurant") {
      clearLocation();
      params.nearMe = false;
    }
    setSearchParams(params);
  };

  const handleSubcategoryClick = (value: string) => {
    setSearchParams({ subcategory: subcategory === value ? "" : value });
  };

  const isFilterActive = (value: string) =>
    (by === "category" && category === value) ||
    (by === "status" && status === value);

  return (
    <div className={cn("-ml-3 w-full max-w-[100vw] overflow-hidden")}>
      {/* Main category row */}
      <div
        className={cn("relative flex items-center justify-between border-b")}
      >
        <Carousel
          className="flex w-full items-center gap-2 lg:gap-1"
          opts={{
            align: "start",
            loop: false,
            slidesToScroll: 3,
          }}
        >
          <CarouselContent className="-ml-1">
            <CarouselItem className="w-fit basis-auto py-1 pl-2">
              {page === "my-posts" ? (
                <Button
                  className={cn(
                    "rounded-lg font-normal capitalize",
                    isFilterActive("restaurant") || status === "all"
                      ? "font-medium"
                      : "",
                  )}
                  onClick={() =>
                    setSearchParams({
                      category: "restaurant",
                      status: "all",
                      subcategory: "",
                    })
                  }
                  variant={
                    isFilterActive("restaurant") || status === "all"
                      ? "default"
                      : "secondary"
                  }
                >
                  <LayoutGridIcon strokeWidth={2.2} />
                  All Posts
                </Button>
              ) : null}
            </CarouselItem>
            {filters.map((f) => {
              const active = isFilterActive(f.value);
              return (
                <CarouselItem
                  className="w-fit basis-auto pt-0 pb-0 pl-2"
                  key={f.label}
                >
                  <div className="relative pb-2">
                    <Button
                      className={cn(
                        "font-normal capitalize",
                        active
                          ? "rounded-full font-medium"
                          : "rounded-full text-muted-foreground",
                      )}
                      onClick={() => handleCategoryClick(f.value)}
                      variant={"ghost"}
                    >
                      <f.icon strokeWidth={2.2} />
                      {f.label}
                    </Button>
                    {active && (
                      <div className="absolute bottom-0 left-1/2 h-0.5 w-[82%] -translate-x-1/2 rounded-full bg-foreground" />
                    )}
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        {/* Near Me — desktop only, right side with separator */}
        {page === "home" && (
          <div className="hidden shrink-0 items-center gap-2 pb-1 pl-2 md:flex">
            {category === "restaurant" && (
              <Separator className="h-5 border-l" orientation="vertical" />
            )}
            <NearMeButton />
          </div>
        )}
      </div>

      {/* Subcategory row */}
      <AnimatePresence>
        {hasSubcategories && (
          <motion.div
            animate={{ opacity: 1 }}
            className="mt-4 overflow-hidden pb-1 pl-2"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Carousel
              className="w-full"
              opts={{
                align: "start",
                loop: false,
                slidesToScroll: 3,
              }}
            >
              <CarouselContent className="-ml-1">
                {activeSubs.map((sub) => {
                  const isActive = subcategory === sub.value;

                  return (
                    <CarouselItem
                      className="w-fit basis-auto pl-2"
                      key={sub.value}
                    >
                      <Button
                        onClick={() =>
                          handleSubcategoryClick(isActive ? "" : sub.value)
                        }
                        size="sm"
                        variant={isActive ? "default" : "outline"}
                      >
                        {sub.label}

                        {isActive && <XIcon size={13} />}
                      </Button>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </Carousel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
