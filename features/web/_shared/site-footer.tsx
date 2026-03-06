import Link from "next/link";
import { Suspense } from "react";
import { ModeSwitcher } from "@/components/custom/theme-switcher";
import FooterDate from "./footer-date";

export default function SiteFooter() {
  return (
    <footer className="container py-5">
      <div className="flex w-full flex-wrap items-center justify-between gap-5">
        <div className="flex flex-wrap items-center gap-5">
          <Suspense>
            <FooterDate />
          </Suspense>
          <Link
            className="text-muted-foreground text-sm hover:text-foreground"
            href="/home"
          >
            Home
          </Link>
          <Link
            className="text-muted-foreground text-sm hover:text-foreground"
            href="/contact"
          >
            Contact
          </Link>
        </div>
        <ModeSwitcher />
      </div>
    </footer>
  );
}
