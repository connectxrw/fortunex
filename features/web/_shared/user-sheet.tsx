"use client";
import { useQuery } from "convex-helpers/react/cache/hooks";
import {
  ArrowDownToLineIcon,
  BellIcon,
  BriefcaseBusinessIcon,
  ChevronRight,
  CirclePileIcon,
  HeadsetIcon,
  HouseIcon,
  ImageIcon,
  LogOutIcon,
  MenuIcon,
  MessageCircleIcon,
  MessageSquareShareIcon,
  PenIcon,
  PlusIcon,
  ThumbsUpIcon,
  UserCircleIcon,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import { api } from "@/convex/_generated/api";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, getUserInitials } from "@/lib/utils";
import { SelectAppearence } from "./appearence";
import { ScrollArea } from "@/components/ui/scroll-area";

const ADMIN_EMAIL = "connectxrw@gmail.com";

const primaryNavs = [
  { title: "Home", icon: HouseIcon, link: "/" },
  { title: "My Profile", icon: UserCircleIcon, link: "/profile" },
  { title: "Chat", icon: MessageCircleIcon, link: "?ai=true" },
  { title: "Saved", icon: ArrowDownToLineIcon, link: "/saved" },
  { title: "Liked", icon: ThumbsUpIcon, link: "/liked" },
];

const secondaryNavs = [
  { title: "Help Center", icon: HeadsetIcon, link: "/help-center" },
  { title: "Feedback", icon: MessageSquareShareIcon, link: "/feedback" },
];

const businessNavs = [
  { title: "Customize", icon: PenIcon, link: "/customize" },
  { title: "Posts", icon: ImageIcon, link: "/posts" },
  { title: "New Post", icon: PlusIcon, link: "/posts/new" },
  { title: "Notifications", icon: BellIcon, link: "/notifications" },
];

type User = NonNullable<
  ReturnType<typeof useQuery<typeof api.auth.getCurrentUser>>
>;

function NavLink({
  href,
  icon: Icon,
  label,
  active,
  onClose,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClose: () => void;
}) {
  return (
    <Link
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted/70",
        active && "bg-muted/70"
      )}
      href={href as Route}
      onClick={onClose}
    >
      <Icon
        className={cn("size-4 text-muted-foreground", active && "text-primary")}
      />
      <span className={cn("font-normal", active && "font-medium text-primary")}>
        {label}
      </span>
    </Link>
  );
}

function MenuContent({
  user,
  pathname,
  onClose,
}: {
  user: User;
  pathname: string;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col gap-0.5 font-roboto">
      {/* User header */}
      <div className="flex items-center gap-3 px-2 py-2">
        <Avatar className="size-8">
          <AvatarImage
            alt={user.username || user.name}
            src={user.image || "/profile.svg"}
          />
          <AvatarFallback>
            {getUserInitials(user.username || user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium text-sm leading-tight">
            {user.username || user.name}
          </span>
          <span className="text-muted-foreground text-xs">{user.email}</span>
        </div>
      </div>

      <Separator />

      {/* Primary nav */}
      <div className="flex flex-col py-1">
        {primaryNavs.map((nav) => (
          <NavLink
            active={pathname === nav.link}
            href={nav.link}
            icon={nav.icon}
            key={nav.title}
            label={nav.title}
            onClose={onClose}
          />
        ))}

        {user.email === ADMIN_EMAIL && user.emailVerified && (
          <NavLink
            active={pathname === "/all"}
            href="/all"
            icon={CirclePileIcon}
            label="All Businesses"
            onClose={onClose}
          />
        )}
      </div>

      {/* Business section */}
      {user.accountType === "business" && (
        <>
          <Separator className="border-b" />
          <div className="py-1">
            <Collapsible className="group/collapsible">
              <CollapsibleTrigger asChild>
                <button
                  className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted/70"
                  type="button"
                >
                  <BriefcaseBusinessIcon className="size-4 text-muted-foreground" />
                  <span>My Business</span>
                  <ChevronRight className="ml-auto size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="pl-3">
                  {businessNavs.map((nav) => (
                    <NavLink
                      active={pathname === nav.link}
                      href={nav.link}
                      icon={nav.icon}
                      key={nav.title}
                      label={nav.title}
                      onClose={onClose}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </>
      )}

      <Separator className="border-b" />

      {/* Footer */}
      <div className="flex flex-col pt-1">
        {secondaryNavs.map((nav) => (
          <NavLink
            active={pathname === nav.link}
            href={nav.link}
            icon={nav.icon}
            key={nav.title}
            label={nav.title}
            onClose={onClose}
          />
        ))}
        <SelectAppearence />
        <Link
          className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted/70"
          href="/logout"
          onClick={onClose}
        >
          <LogOutIcon className="size-4 text-muted-foreground" />
          <span className="font-normal">Logout</span>
        </Link>
      </div>
    </div>
  );
}

export function UserMenuSheet() {
  const user = useQuery(api.auth.getCurrentUser);
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (user === undefined) {
    return <Skeleton className="block size-9 rounded-full" />;
  }
  if (!user) return null;

  const trigger = (
    <div className="bg-secondary rounded-full p-0.5 flex items-center justify-center gap-0 cursor-pointer">
      <Button className="rounded-full size-7" size="icon" variant={"ghost"}>
        <MenuIcon />
      </Button>
      <Avatar className="size-7">
        <AvatarImage
          alt={user.username || user.name}
          src={user.image || "/profile.svg"}
        />
        <AvatarFallback>
          {getUserInitials(user.username || user.name)}
        </AvatarFallback>
      </Avatar>
    </div>
  );

  const content = (
    <MenuContent
      onClose={() => setOpen(false)}
      pathname={pathname}
      user={user}
    />
  );

  return (
    <div className="flex items-center gap-2">
      <Button
        asChild
        className="hidden rounded-full md:flex"
        variant="secondary"
      >
        <Link
          href={`/posts/new?preview=${JSON.stringify({
            images: [],
            title: "",
            ctaLink: "",
            ctaLabel: "",
            content: "",
            price: "",
            open: true,
          })}`}
        >
          <PlusIcon />
          Post
        </Link>
      </Button>
      <Button
        asChild
        className="rounded-full md:hidden"
        size="icon"
        variant="outline"
      >
        <Link href="/posts/new">
          <PlusIcon />
        </Link>
      </Button>

      {isMobile ? (
        <Drawer onOpenChange={setOpen} open={open}>

          <DrawerTrigger asChild>{trigger}</DrawerTrigger>
          <DrawerContent className="px-4 pb-6 font-roboto z-[70]">
            <DrawerHeader className="sr-only">
              <DrawerTitle>{siteConfig.name} Menu</DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="h-[52vh]">
              {content}
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      ) : (
        <Popover onOpenChange={setOpen} open={open}>
          <PopoverTrigger asChild>{trigger}</PopoverTrigger>
          <PopoverContent align="end" className="w-64 rounded-xl p-2 max-h-[86vh] overflow-y-auto" sideOffset={8}>
            {content}
          </PopoverContent>
        </Popover>
      )
      }
    </div >
  );
}
