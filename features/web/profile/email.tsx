"use client";
import { usePreloadedAuthQuery } from "@convex-dev/better-auth/nextjs/client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Preloaded } from "convex/react";
import { PenIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { siteConfig } from "@/config/site";
import type { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { emailFormSchema, type TEmailFormValues } from "./schema";

export function EmailCard({
  preloadedUserQuery,
}: {
  preloadedUserQuery: Preloaded<typeof api.auth.getCurrentUser>;
}) {
  const user = usePreloadedAuthQuery(preloadedUserQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TEmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: "" },
  });

  const handleSubmit = async (values: TEmailFormValues) => {
    try {
      setIsSubmitting(true);
      await authClient.changeEmail(
        {
          newEmail: values.email,
          callbackURL: "/overview",
        },
        {
          onSuccess: () => {
            setIsOpen(false);
            toast("Check your inbox for verification email");
          },
          onError: (ctx) => {
            toast(ctx.error.message);
          },
        },
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
          <CardDescription>
            Enter the email addresses you want to use to log in with{" "}
            {siteConfig.name}. This email will be used for account-related
            notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5" id="email">
            <Item className="py-3" variant="outline">
              <ItemContent className="flex flex-row flex-wrap gap-3">
                <ItemTitle className="font-normal">{user.email}</ItemTitle>
                <div className="flex gap-2">
                  <Badge variant={"secondary"}>
                    {user.emailVerified ? "Verified" : "Not Verified"}
                  </Badge>
                  <Badge variant={"secondary"}>Primary</Badge>
                </div>
              </ItemContent>
              <ItemActions>
                <Button
                  onClick={() => setIsOpen(true)}
                  size="icon"
                  variant={"ghost"}
                >
                  <PenIcon />
                </Button>
              </ItemActions>
            </Item>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <p className="font-normal text-primary/60 text-sm">
            Emails must be verified.
          </p>
          <Button onClick={() => setIsOpen(true)} size="sm" type="button">
            Change Email
          </Button>
        </CardFooter>
      </Card>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent className="w-full md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Change Email</DialogTitle>
            <DialogDescription>
              Add new email address to your account.
            </DialogDescription>
          </DialogHeader>

          <form
            className="mt-6 flex flex-col gap-6 lg:gap-10"
            onSubmit={form.handleSubmit(handleSubmit)}
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
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <DialogFooter>
              <Button
                onClick={() => setIsOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>

              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? <Spinner /> : "Change Email"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
