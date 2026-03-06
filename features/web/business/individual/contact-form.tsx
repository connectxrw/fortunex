"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "convex-helpers/react/cache/hooks";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { contactBusiness } from "@/features/_emails/emails.action";
import {
  ContactFormSchema,
  type TContactFormSchema,
} from "@/features/_emails/schema";

export default function ContactBusinessForm({
  businessEmail,
  businessName,
}: {
  businessEmail: string;
  businessName: string;
}) {
  const user = useQuery(api.auth.getCurrentUser);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm<TContactFormSchema>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  if (user === undefined) {
    return <Skeleton className="h-[60vh] w-full" />;
  }
  if (user === null) {
    return <div>not logged in</div>;
  }

  const onSubmit = async (data: TContactFormSchema) => {
    setSubmitting(true);
    const createPromise = contactBusiness({
      businessEmail,
      senderEmail: user.email,
      subject: data.subject,
      message: data.message,
    });
    toast.promise(createPromise, {
      loading: "Sending...",
    });
    try {
      const result = await createPromise;
      if (result?.success) {
        setSent(true); // trigger confirmation message
        form.reset();
        toast.success("Message sent successfully", {
          description: "You have sent a message to the business.",
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
  if (sent) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleCheckIcon />
          </EmptyMedia>
          <EmptyTitle>Message sent successfully</EmptyTitle>
          <EmptyDescription>
            You have sent a message to {businessName}. Thanks for sending the
            message!
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => setSent(false)}>Send another message</Button>
        </EmptyContent>
      </Empty>
    );
  }
  return (
    <form className="h-full space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="subject"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="form-subject">Subject</FieldLabel>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              id="form-subject"
              placeholder="Subject"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="message"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="form-message">Message</FieldLabel>
            <Textarea
              {...field}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              className="min-h-37.5"
              id="form-message"
              placeholder="Message"
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
