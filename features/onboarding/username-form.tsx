"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const accountTypes = [
  {
    id: "personal",
    title: "Personal",
    description: "For individuals and small teams",
  },
  {
    id: "business",
    title: "Business",
    description: "For growing businesses.",
  },
] as const;

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(32, "Username must be at most 32 characters.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username must only contain letters, numbers, and underscores.",
    ),
  accountType: z.enum(["personal", "business"]),
});

export function OnboardingUsernameForm() {
  const user = useQuery(api.auth.getCurrentUser);
  const updateUserOnBoarding = useMutation(api.user.index.updateUserOnBoarding);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      accountType: "personal",
    },
  });

  useEffect(() => {
    if (user?.username) {
      form.reset({
        username: user.username,
        accountType: user.accountType === "business" ? "business" : "personal",
      });
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const { data: response } = await authClient.isUsernameAvailable({
        username: values.username,
      });

      if (response?.available) {
        const result = await updateUserOnBoarding({
          username: values.username,
          accountType: values.accountType,
        });
        if (result.status) {
          toast.success("Username updated successfully!");
          form.reset();
          if (values.accountType === "personal") {
            router.push("/");
          } else {
            router.push("/onboarding/business");
          }
        } else {
          toast.error("Failed to update username.");
          form.setError("username", {
            type: "manual",
            message: "Failed to update username.",
          });
        }
      } else {
        toast.error("Username is not available.");
        form.setError("username", {
          type: "manual",
          message: "Username is not available.",
        });
      }
    } catch {
      toast.error("Failed to update username.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }
  if (user === undefined) {
    return (
      <div className="flex flex-col gap-4">
        <Input
          autoComplete="off"
          id="form-rhf-demo-title"
          placeholder="Username"
          readOnly
        />
        <Skeleton className={cn(buttonVariants({ variant: "ghost" }))} />
      </div>
    );
  }
  return (
    <div>
      <div className="flex flex-col gap-4">
        <form
          className="flex flex-col gap-5"
          id="form-rhf-demo"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="username"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-base" htmlFor="form-username">
                    Username
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    disabled={isLoading}
                    id="form-username"
                    placeholder="Username"
                  />
                  <FieldDescription>
                    Username must only contain letters, numbers, and
                    underscores.
                  </FieldDescription>
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />
          </FieldGroup>
          <FieldGroup>
            <Controller
              control={form.control}
              name="accountType"
              render={({ field, fieldState }) => (
                <FieldSet data-invalid={fieldState.invalid}>
                  <FieldLegend>Account Type</FieldLegend>
                  <FieldDescription>
                    Select the type of account you want to create
                  </FieldDescription>
                  <RadioGroup
                    aria-invalid={fieldState.invalid}
                    name={field.name}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    {accountTypes.map((accountType) => (
                      <FieldLabel
                        htmlFor={`form-rhf-radiogroup-${accountType.id}`}
                        key={accountType.id}
                      >
                        <Field
                          data-invalid={fieldState.invalid}
                          orientation="horizontal"
                        >
                          <FieldContent>
                            <FieldTitle>{accountType.title}</FieldTitle>
                            <FieldDescription>
                              {accountType.description}
                            </FieldDescription>
                          </FieldContent>
                          <RadioGroupItem
                            aria-invalid={fieldState.invalid}
                            id={`form-rhf-radiogroup-${accountType.id}`}
                            value={accountType.id}
                          />
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldSet>
              )}
            />
          </FieldGroup>
        </form>
        <Field orientation="horizontal">
          {user?.username ? (
            <>
              <Button
                disabled={isLoading}
                onClick={() => router.push("/")}
                type="button"
              >
                View Posts
              </Button>
              <Button
                disabled={isLoading}
                onClick={() => router.push("/profile")}
                type="button"
              >
                View Profile
              </Button>
            </>
          ) : (
            <Button disabled={isLoading} form="form-rhf-demo" type="submit">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          )}
        </Field>
      </div>
    </div>
  );
}
