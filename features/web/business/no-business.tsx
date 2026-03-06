import { BriefcaseBusinessIcon } from "lucide-react";
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

export function NoBusinessAccount() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BriefcaseBusinessIcon />
        </EmptyMedia>
        <EmptyTitle>No Business Yet</EmptyTitle>
        <EmptyDescription>
          Change to business account to create a business. And start sharing
          your business with the world.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild className="rounded-full">
          <Link href="/profile#change-account-type">
            Change to Personal Account
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export function NoBusinessAccountInfo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BriefcaseBusinessIcon />
        </EmptyMedia>
        <EmptyTitle>No Business Information</EmptyTitle>
        <EmptyDescription>
          Add your business information to your business. And start sharing your
          business with the world.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild className="rounded-full">
          <Link href="/onboarding/business">Add Business Information</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
