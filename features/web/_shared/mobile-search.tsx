"use client";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { ArrowUpRightIcon, LoaderIcon, SearchIcon, XIcon } from "lucide-react";
import { debounce } from "nuqs";
import { useState, useTransition } from "react";
import { AiSearchIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { api } from "@/convex/_generated/api";
import { useFilters } from "@/lib/nuqs-params";
import { cn } from "@/lib/utils";
export function MobileSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [{ search, ai }, setSearchParams] = useFilters({
    startTransition,
  });
  const onClear = () => setSearchParams({ search: "" });
  const searchPosts = useQuery(
    api.public.post.searchUnAuthPosts,
    search ? { search } : "skip",
  );

  // Loading state
  // const isSearchLoading = Boolean(search && searchPosts === undefined);

  // if (isSearchLoading) {
  //   return <PostsSkeleton />;
  // }

  const posts = search ? searchPosts : [];

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button
          className={cn("rounded-full text-muted-foreground md:hidden")}
          size="icon-sm"
          variant={"outline"}
        >
          <SearchIcon />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="no-scrollbar w-full overflow-y-auto data-[side=right]:w-full lg:max-w-1/3 lg:data-[side=right]:w-3/4"
        showCloseButton={false}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Search</SheetTitle>
          <SheetDescription>Search for posts, users, and more</SheetDescription>
        </SheetHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <InputGroup className="rounded-full bg-background shadow-none dark:bg-background">
            <InputGroupInput
              onChange={(e) => {
                startTransition(async () => {
                  await setSearchParams(
                    { search: e.target.value },
                    {
                      limitUrlUpdates: e.target.value.length
                        ? debounce(500)
                        : undefined,
                    },
                  );
                });
              }}
              placeholder="Search..."
              value={search || ""}
            />
            <InputGroupAddon>
              {isPending ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <SearchIcon />
              )}
            </InputGroupAddon>
            {search && !isPending && (
              <InputGroupAddon align="inline-end">
                <Button
                  className="rounded-full"
                  onClick={onClear}
                  size="icon-sm"
                  variant={"ghost"}
                >
                  <XIcon />
                </Button>
              </InputGroupAddon>
            )}

            <InputGroupAddon align="inline-end">
              <Button
                className="rounded-full shadow-none"
                onClick={() => {
                  setIsOpen(false);
                  setSearchParams({ ai: !ai });
                }}
                size="icon-sm"
                variant={"secondary"}
              >
                <AiSearchIcon className="fill-primary" />
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <SheetClose asChild>
            <Button className="rounded-full" size="icon-sm" variant="outline">
              <XIcon className="size-4" />
            </Button>
          </SheetClose>
        </div>
        {!posts ||
          (posts.length === 0 && (
            <Empty className="h-full">
              <EmptyHeader>
                <EmptyMedia className="bg-transparent" variant="icon">
                  <SearchIcon />
                </EmptyMedia>

                <EmptyTitle>Get Ai Results</EmptyTitle>

                <EmptyDescription>
                  Search with AI to get better results
                </EmptyDescription>
              </EmptyHeader>

              <EmptyContent>
                <div className="flex gap-2">
                  <Button
                    className="rounded-full"
                    onClick={() => {
                      setIsOpen(false);
                      setSearchParams({ ai: !ai });
                    }}
                    variant={"secondary"}
                  >
                    Continue with AI
                  </Button>

                  {search && (
                    <Button
                      className="rounded-full"
                      onClick={() => setSearchParams({ search: "" })}
                      variant="secondary"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              </EmptyContent>
            </Empty>
          ))}
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-4 px-2">
            {posts.map((p) => (
              <button
                className="flex items-center gap-3"
                key={p._id}
                onClick={() => {
                  setIsOpen(false);
                  setSearchParams({ post: p.slug });
                }}
                type="button"
              >
                <SearchIcon className="size-5 text-muted-foreground" />
                <p className="line-clamp-1">{p.title}</p>
                <ArrowUpRightIcon className="ml-auto size-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
