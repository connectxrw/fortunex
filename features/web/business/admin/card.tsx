import { formatDistanceToNow } from "date-fns";
import {
  AtSignIcon,
  BriefcaseBusinessIcon,
  CheckIcon,
  FileIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { BusinessCardActions } from "./card-actions";
export interface TBusinessData {
  category: string | undefined;
  certificateFileUrl: string | null;
  createdAt: number;
  email: string;
  handle: string;
  id: Id<"business">;
  name: string;
  status: "verified" | "unverified" | "deleted" | undefined;
  updatedAt: number;
}

export default function BusinessCard({
  business,
}: {
  business: TBusinessData;
}) {
  return (
    <Card
      className={cn(
        "w-full rounded-lg shadow-xs ring-ring/20 hover:ring dark:ring-ring/40",
      )}
    >
      <CardHeader>
        <CardTitle className="mr-7 flex items-center gap-2 truncate font-medium">
          <BriefcaseBusinessIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{business.name}</span>
        </CardTitle>
        <CardDescription className="mr-10 truncate">
          <Link
            className="flex items-center gap-2 hover:underline"
            href={`/b/${business.handle}`}
          >
            <AtSignIcon className="size-4" />
            {business.handle}
          </Link>
        </CardDescription>
        <CardAction>
          <BusinessCardActions business={business} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          {business.status === "verified" ? (
            <CheckIcon className="size-4 text-muted-foreground" />
          ) : (
            <XIcon className="size-4 text-muted-foreground" />
          )}

          <p className="font-medium text-sm capitalize tracking-tight">
            {business.status}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <FileIcon className="size-4 text-muted-foreground" />
            {business.certificateFileUrl ? (
              <a
                className="text-muted-foreground text-sm"
                href={business.certificateFileUrl}
                target="_blank"
              >
                View Certificate
              </a>
            ) : (
              <p className="text-muted-foreground text-sm">No certificate</p>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            {formatDistanceToNow(new Date(business.updatedAt))}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
