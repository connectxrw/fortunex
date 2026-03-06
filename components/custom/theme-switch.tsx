"use client";

import { useTheme } from "next-themes";
import { Switch as SwitchPrimitive } from "radix-ui";

import type React from "react";
import { useCallback, useEffect } from "react";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import Moon from "../icons/moon";
import Sun from "../icons/sun";

const ThemeSwitch = () => {
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();
  return mounted ? (
    <Switch
      checked={resolvedTheme === "dark"}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
    />
  ) : null;
};

export default ThemeSwitch;

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "d" || e.key === "D") && !e.metaKey && !e.ctrlKey) {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        toggleTheme();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggleTheme]);
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-fle hidden h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-secondary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
        className,
      )}
      data-slot="switch"
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none flex size-4 items-center justify-between rounded-full bg-background text-black ring-0 transition-transform duration-300 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground",
        )}
        data-slot="switch-thumb"
      >
        {resolvedTheme !== "dark" ? (
          <Sun className="mx-auto size-2.5" />
        ) : (
          <Moon className="mx-auto size-2.5 fill-white text-white" />
        )}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}
