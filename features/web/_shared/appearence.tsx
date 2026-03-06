import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
export function SelectAppearence() {
  const { theme, setTheme, resolvedTheme } = useTheme();
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

  const icon =
    theme === "system" ? (
      <MonitorIcon className="size-4 text-muted-foreground" />
    ) : theme === "dark" ? (
      <MoonIcon className="size-4 text-muted-foreground" />
    ) : (
      <SunIcon className="size-4 text-muted-foreground" />
    );

  return (
    <button
      className={cn(
        "flex items-center gap-2 rounded-lg p-2 text-primary text-sm hover:bg-muted/70",
      )}
      onClick={toggleTheme}
      type="button"
    >
      {icon}
      <span className={cn("font-normal text-sm capitalize")}>
        {theme} theme
      </span>
    </button>
  );
}
