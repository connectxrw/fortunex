import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheckIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendReport } from "@/features/_emails/emails.action";
import {
  ReportFormSchema,
  type TReportFormSchema,
} from "@/features/_emails/schema";

export function ReportPostDialog({
  postTitle,
  postSlug,
  businessName,
  businessHandle,
  postId,
  open,
  setOpen,
}: {
  postTitle: string;
  postSlug: string;
  businessName: string;
  businessHandle: string;
  postId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  console.log(postTitle, businessName, postId);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<TReportFormSchema>({
    resolver: zodResolver(ReportFormSchema),
  });

  const onSubmit = async (data: TReportFormSchema) => {
    setSubmitting(true);
    const createPromise = sendReport({
      email: data.email,
      postTitle,
      postSlug,
      businessHandle,
      reason: data.reason,
    });
    toast.promise(createPromise, {
      loading: "Reporting...",
    });
    try {
      const result = await createPromise;
      if (result?.success) {
        setSent(true); // trigger confirmation message
        form.reset();
        toast.success("Reported successfully", {
          description: "You have reported the post.",
        });
      }
    } catch {
      toast.error("Failed to report. Please try again.", {
        description: "There was an error reporting the post.",
      });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent
        className="max-w-full rounded-none md:max-w-[425px] md:rounded-lg lg:max-w-xl"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Report Post</DialogTitle>
          <DialogDescription>
            Report post: <span className="font-semibold">{postTitle}</span> by{" "}
            <span className="font-semibold">{businessName}</span>. Click send
            when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        {sent ? (
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-muted-foreground text-sm">
              Your report has been sent successfully.
            </p>
            <div className="flex items-center gap-1">
              <CircleCheckIcon className="size-5 text-green-500" />
              <p className="text-muted-foreground text-sm">
                Thanks for your report!
              </p>
            </div>
          </div>
        ) : (
          <form
            className="h-full space-y-4"
            id="report-post-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                placeholder="Email"
                {...form.register("email")}
              />
              <FieldError>{form.formState.errors.reason?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="reason">Reason for reporting</FieldLabel>
              <Textarea
                className="min-h-[100px]"
                id="reason"
                placeholder="Tell us what prompted this feedback..."
                {...form.register("reason")}
              />
              <FieldError>{form.formState.errors.reason?.message}</FieldError>
            </Field>
          </form>
        )}

        <DialogFooter className="flex flex-row">
          <Button
            className="mt-auto flex-1"
            disabled={submitting}
            form="report-post-form"
            type="submit"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Reporting...
              </>
            ) : (
              "Report"
            )}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
