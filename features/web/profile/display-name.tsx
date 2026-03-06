"use client";
import { usePreloadedAuthQuery } from "@convex-dev/better-auth/nextjs/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Preloaded, useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { displayNameFormSchema, type TDisplayNameFormValues } from "./schema";

export function DisplayNameCard({
  preloadedUserQuery,
}: {
  preloadedUserQuery: Preloaded<typeof api.auth.getCurrentUser>;
}) {
  const user = usePreloadedAuthQuery(preloadedUserQuery);
  const updateDisplayName = useMutation(api.user.index.updateDisplayName);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<TDisplayNameFormValues>({
    resolver: zodResolver(displayNameFormSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (user) {
      form.setValue("name", user.name);
    }
  }, [user, form.setValue]);

  const handleSubmit = async (values: TDisplayNameFormValues) => {
    try {
      setIsLoading(true);
      const result = await updateDisplayName({ name: values.name });
      if (result) {
        toast.success("Display name updated successfully!");
      } else {
        toast.error("Failed to update display name.");
      }
    } catch {
      toast.error("Failed to update display name.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Display Name</CardTitle>
        <CardDescription>
          Please enter your full name, or a display name you are comfortable
          with.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-display-name" onSubmit={form.handleSubmit(handleSubmit)}>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="sr-only" htmlFor="form-display-name">
                  Display name
                </FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  className="w-fit lg:max-w-sm"
                  disabled={isLoading}
                  id="form-display-name"
                  placeholder="Display name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </form>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <p className="font-normal text-primary/60 text-sm">
          Please use 32 characters at maximum.
        </p>
        <Button
          disabled={isLoading}
          form="form-display-name"
          size="sm"
          type="submit"
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </CardFooter>
    </Card>
  );
}
