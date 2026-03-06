"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheckIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendFeedback } from "@/features/_emails/emails.action";
import {
  FeedbackFormSchema,
  type TFeedbackFormSchema,
} from "@/features/_emails/schema";

export default function FeedbackForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm<TFeedbackFormSchema>({
    resolver: zodResolver(FeedbackFormSchema),
    defaultValues: {
      email: "",
      feedback: "",
    },
  });

  const onSubmit = async (data: TFeedbackFormSchema) => {
    setSubmitting(true);
    const createPromise = sendFeedback(data);
    toast.promise(createPromise, {
      loading: "Sending...",
    });
    try {
      const result = await createPromise;
      if (result?.success) {
        setSent(true); // trigger confirmation message
        form.reset();
        toast.success("Feedback sent successfully", {
          description: "You have sent a feedback.",
        });
      }
    } catch {
      toast.error("Failed to send feedback. Please try again.", {
        description: "There was an error sending the message.",
      });
    } finally {
      setSubmitting(false);
    }
  };
  if (sent) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleCheckIcon />
          </EmptyMedia>
          <EmptyTitle>Feedback sent successfully</EmptyTitle>
          <EmptyDescription>Thanks for sending the feedback!</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => setSent(false)}>Send another feedback</Button>
        </EmptyContent>
      </Empty>
    );
  }
  return (
    <form className="h-full space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="form-email">Email</FieldLabel>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              id="form-email"
              placeholder="you@domain.com"
              type="email"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="feedback"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="form-feedback">Feedback</FieldLabel>
            <Textarea
              {...field}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              className="min-h-37.5"
              id="form-feedback"
              placeholder="Describe your feedback"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button className="mt-auto w-full" disabled={submitting} type="submit">
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send"
        )}
      </Button>
    </form>
  );
}
