"use client";
import { Analytics } from "@vercel/analytics/next";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TailwindIndicator } from "../custom/tailwind-indicator";
import ConvexClientProvider from "./ConvexClientProvider";
import { ThemeProvider } from "./theme-provider";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
      <ConvexQueryCacheProvider>
        <NuqsAdapter>
          <ThemeProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster closeButton expand position="bottom-right" />
            <TailwindIndicator />
            <Analytics />
          </ThemeProvider>
        </NuqsAdapter>
      </ConvexQueryCacheProvider>
    </ConvexClientProvider>
  );
}
