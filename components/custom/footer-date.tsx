"use client";

import { siteConfig } from "@/config/site";

export default function FooterDate() {
  return (
    <p className="text-balance text-muted-foreground text-sm leading-5">
      © {new Date().getFullYear()} {siteConfig.name}.
    </p>
  );
}
