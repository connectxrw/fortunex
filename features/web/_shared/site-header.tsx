import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import ThemeSwitch from "@/components/custom/theme-switch";
import { siteConfig } from "@/config/site";
import logo from "@/public/logo-black.png";
import { MobileSearch } from "./mobile-search";
import UserProfile from "./user-profile";

export function SiteHeader({
  title,
  icon,
  children,
}: {
  title?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="flex w-full items-center justify-between gap-3 py-3 lg:gap-6">
      <div className="flex items-center gap-2">
        <Link className="flex items-center gap-2" href="/">
          <Image alt="icon" className="w-5 dark:invert" src={logo} />
          <span className="font-semibold font-serif text-lg lg:text-xl">
            {siteConfig.name}
          </span>
        </Link>

        {title && (
          <div className="ml-2 hidden items-center gap-1 md:flex">
            {icon ? icon : null}
            <h1 className="font-medium text-foreground/80 text-sm capitalize">
              {title}
            </h1>
          </div>
        )}
      </div>
      {children}
      <div className="flex items-center gap-1">
        <ThemeSwitch />
        <Suspense>
          <MobileSearch />
        </Suspense>
        <UserProfile />
      </div>
    </header>
  );
}
