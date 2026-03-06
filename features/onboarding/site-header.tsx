"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import logo from "@/public/logo-black.png";

export default function OnboardingSiteHeader() {
  const scrolled = useScroll(10);

  return (
    <header
      className={cn("sticky top-0 z-50 w-full border-transparent border-b", {
        "border-border bg-background/95 backdrop-blur-lg supports-backdrop-filter:bg-background/50":
          scrolled,
      })}
    >
      <nav className="container mx-auto flex h-16 w-full max-w-7xl items-center justify-between">
        <Link className="flex items-center gap-2" href="/">
          <Image alt="icon" className="w-5 dark:invert" src={logo} />
          <span className="font-semibold font-serif text-lg lg:text-xl">
            {siteConfig.name}
          </span>
        </Link>

        <Button
          asChild
          className="rounded-full"
          size="sm"
          variant={"secondary"}
        >
          <Link href="/logout">Logout</Link>
        </Button>
      </nav>
    </header>
  );
}
