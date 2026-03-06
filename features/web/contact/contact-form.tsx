"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendFeedback } from "@/features/_emails/emails.action";
import {
  FeedbackFormSchema,
  type TFeedbackFormSchema,
} from "@/features/_emails/schema";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

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
        form.reset();
        toast.success("Message sent successfully", {
          description: "We will get back to you as soon as possible.",
        });
      }
    } catch {
      toast.error("Failed to send message. Please try again.", {
        description: "There was an error sending the message.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row-span-2 h-full min-h-125 w-full p-2 md:p-6 lg:p-10">
      <form
        className="h-full space-y-4"
        id="contact-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
              <FieldLabel htmlFor="form-message">Message</FieldLabel>
              <Textarea
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                className="min-h-37.5"
                id="form-message"
                placeholder="Describe your message"
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
    </div>
  );
}
