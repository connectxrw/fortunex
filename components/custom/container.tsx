import { cn } from "@/lib/utils";

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "@container/main container relative flex min-h-[calc(100svh-10rem)] flex-1 flex-col gap-6 py-4 md:py-6 lg:gap-10",
        className
      )}
    >
      {children}
    </div>
  );
}
