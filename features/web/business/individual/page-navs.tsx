import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import NavItem from "./nav-item";

export default async function PageNavs(props: LayoutProps<"/b/[handle]">) {
  const { handle } = await props.params;
  if (!handle) {
    return null;
  }
  // on url handle in /@handle i want handle only

  const navs = [
    {
      label: "Posts",
      href: `/b/${handle}`,
    },
    {
      label: "About",
      href: `/b/${handle}/about`,
    },
    {
      label: "Jobs",
      href: `/b/${handle}/jobs`,
    },
    {
      label: "Contact",
      href: `/b/${handle}/contact`,
    },
  ];

  return (
    <nav
      className={cn(
        "sticky top-12 z-20 w-full gap-4 border-border border-b bg-background",
      )}
    >
      <div className="container flex items-center gap-4 transition-all duration-1000 ease-in">
        <ScrollArea className="w-screen overflow-hidden lg:w-full">
          <div className="mx-auto flex w-full items-center gap-4">
            {navs.map((nav) => (
              <NavItem href={nav.href} key={nav.href} label={nav.label} />
            ))}
          </div>
          <ScrollBar className="h-0 w-0" orientation="horizontal" />
        </ScrollArea>
      </div>
    </nav>
  );
}
