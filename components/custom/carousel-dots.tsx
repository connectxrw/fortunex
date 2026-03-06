"use client";
import { useEffect, useState } from "react";
import { useCarousel } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export function CarouselDots() {
  const { api } = useCarousel();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setSelectedIndex(api.selectedScrollSnap());

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="mt-2 flex justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          className={cn(
            "size-1.5 rounded-full transition-all",
            i === selectedIndex ? "bg-primary" : "bg-primary/50",
          )}
          key={i}
          onClick={() => api?.scrollTo(i)}
          type="button"
        />
      ))}
    </div>
  );
}
