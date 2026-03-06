import { BriefcaseBusinessIcon } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function EmptyJobs() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BriefcaseBusinessIcon />
        </EmptyMedia>

        <EmptyTitle>No Jobs Found</EmptyTitle>

        <EmptyDescription>
          We have not posted any jobs yet. Follow us to be notified when new
          jobs are added.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
