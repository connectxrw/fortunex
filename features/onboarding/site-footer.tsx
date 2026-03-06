import { Suspense } from "react";
import FooterDate from "@/components/custom/footer-date";
import { ThemeSwitcher } from "@/components/custom/theme-switcher";

export default function OnBoardingSiteFooter() {
  return (
    <footer className="container mt-auto border-t bg-background dark:bg-black">
      <div className="my-4 flex w-full items-center justify-between gap-5">
        <div className="flex items-center gap-2">
          <Suspense>
            <FooterDate />
          </Suspense>
          <a
            className="text-balance text-muted-foreground text-sm leading-5 hover:text-foreground"
            href="https://www.rathon-rw.com/"
            rel="noopener"
            target="_blank"
          >
            Built By Rathon
          </a>
        </div>
        <ThemeSwitcher />
      </div>
    </footer>
  );
}
