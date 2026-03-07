"use client";
import { LoaderIcon, SearchIcon, XIcon } from "lucide-react";
import { debounce } from "nuqs";
import { Suspense, useTransition } from "react";
import { AiSearchIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { useFilters } from "@/lib/nuqs-params";
import { cn } from "@/lib/utils";

export function SearchTop({ placeholder }: { placeholder?: string }) {
  return (
    <Suspense fallback={<SearchSkeleton placeholder={placeholder} />}>
      <Search placeholder={placeholder} />
    </Suspense>
  );
}

export function Search({ placeholder }: { placeholder?: string }) {
  const [isPending, startTransition] = useTransition();
  const [{ q, ai }, setSearchParams] = useFilters({
    startTransition,
  });
  const onClear = () => setSearchParams({ q: "" });

  return (
    <InputGroup
      className={cn(
        "mx-auto hidden w-full max-w-xl rounded-full bg-background shadow-none md:flex md:min-h-10 2xl:max-w-2xl dark:bg-background",
      )}
    >
      <InputGroupInput
        onChange={(e) => {
          startTransition(async () => {
            await setSearchParams(
              { q: e.target.value },
              {
                limitUrlUpdates: e.target.value.length
                  ? debounce(500)
                  : undefined,
              },
            );
          });
        }}
        placeholder={placeholder ? placeholder : "Search..."}
        value={q || ""}
      />
      <InputGroupAddon className="mr-1 ml-1">
        {isPending ? <LoaderIcon className="animate-spin" /> : <SearchIcon />}
      </InputGroupAddon>
      {q && !isPending && (
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
          className="h-8 rounded-full"
          onClick={() => setSearchParams({ ai: !ai })}
          size="sm"
          variant={"secondary"}
        >
          <AiSearchIcon className="fill-primary" />
          <span className="hidden md:block">AI Mode</span>
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
}

export function SearchSkeleton({ placeholder }: { placeholder?: string }) {
  return (
    <InputGroup className="mx-auto hidden min-h-10 w-full max-w-xl rounded-full bg-background shadow-none md:flex 2xl:max-w-2xl dark:bg-background">
      <InputGroupInput placeholder={placeholder ? placeholder : "Search..."} />
      <InputGroupAddon>
        <LoaderIcon className="animate-spin" />
      </InputGroupAddon>

      <InputGroupAddon align="inline-end">
        <Button className="rounded-full" size="sm" variant={"secondary"}>
          <AiSearchIcon className="fill-primary" />
          AI Mode
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
}
