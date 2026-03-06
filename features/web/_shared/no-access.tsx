import { ArrowUpRightIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function NoAccessPage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TriangleAlertIcon />
        </EmptyMedia>
        <EmptyTitle>No Access</EmptyTitle>
        <EmptyDescription>
          You don&apos;t have access to this page. For more info contact our
          support team.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
          <Button variant="outline">
            <Link href="/help-center">Get Support</Link>
          </Button>
        </div>
      </EmptyContent>
      <Button
        asChild
        className="text-muted-foreground"
        size="sm"
        variant="link"
      >
        <Link href="/help-center">
          Learn More <ArrowUpRightIcon />
        </Link>
      </Button>
    </Empty>
  );
}
