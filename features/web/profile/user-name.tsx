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
import { authClient } from "@/lib/auth-client";
import { type TUsernameFormValues, usernameFormSchema } from "./schema";

export function UserNameCard({
  preloadedUserQuery,
}: {
  preloadedUserQuery: Preloaded<typeof api.auth.getCurrentUser>;
}) {
  const user = usePreloadedAuthQuery(preloadedUserQuery);
  const updateUsername = useMutation(api.user.index.updateUsername);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<TUsernameFormValues>({
    resolver: zodResolver(usernameFormSchema),
    defaultValues: { username: "" },
  });

  useEffect(() => {
    if (user) {
      form.setValue("username", user.username || "");
    }
  }, [user, form.setValue]);

  const handleSubmit = async (values: TUsernameFormValues) => {
    try {
      setIsLoading(true);
      if (user?.username === values.username) {
        toast.error("It's the same username");
        return;
      }
      const { data: response } = await authClient.isUsernameAvailable({
        username: values.username,
      });
      if (!response?.available) {
        toast.error("Username is not available.");
        return;
      }
      const result = await updateUsername({ username: values.username });
      if (result.status) {
        toast.success("Username updated successfully!");
      } else {
        toast.error("Failed to update username.");
      }
    } catch {
      toast.error("Failed to update username.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Username</CardTitle>
        <CardDescription>
          This is your username. It will be displayed on your profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-username" onSubmit={form.handleSubmit(handleSubmit)}>
          <Controller
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="sr-only" htmlFor="form-username">
                  Username
                </FieldLabel>

                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  className="w-fit lg:max-w-sm"
                  disabled={isLoading}
                  id="form-username"
                  placeholder="Username"
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
          Please use 48 characters at maximum.
        </p>
        <Button
          disabled={isLoading}
          form="form-username"
          size="sm"
          type="submit"
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </CardFooter>
    </Card>
  );
}
