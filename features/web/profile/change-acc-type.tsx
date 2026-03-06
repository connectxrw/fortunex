"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConvexAuth, useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { useRouter } from "next/navigation";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { accTypeformSchema, type TAccTypeFormValues } from "./schema";

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

export function ChangeAccountTypeCard() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <Skeleton className="h-50 w-full" />;
  }
  if (!isAuthenticated) {
    return null;
  }
  return <AuthenticatedUserAccountTypeCard />;
}
export function AuthenticatedUserAccountTypeCard() {
  const router = useRouter();
  const user = useQuery(api.auth.getCurrentUser);
  const updateUserAccountType = useMutation(
    api.user.index.updateUserAccountType,
  );
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<TAccTypeFormValues>({
    resolver: zodResolver(accTypeformSchema),
    defaultValues: { accountType: "personal" },
  });

  useEffect(() => {
    if (user) {
      form.setValue("accountType", user.accountType as "personal" | "business");
    }
  }, [user, form.setValue]);

  const handleSubmit = async (values: TAccTypeFormValues) => {
    try {
      setIsLoading(true);
      if (values.accountType === user?.accountType) {
        toast.error("Account type is the same as the current account type.");
        return;
      }
      if (
        values.accountType === "personal" &&
        user?.accountType === "business"
      ) {
        toast.error(
          "Not possible to change account type from business to personal.",
        );
        return;
      }
      const result = await updateUserAccountType({
        accountType: values.accountType,
      });
      if (result.status) {
        toast.success("Account type updated successfully!");
        if (values.accountType === "personal") {
          router.push("/");
        } else {
          router.push("/onboarding/business");
        }
      } else {
        toast.error("Failed to update account type.");
      }
    } catch {
      toast.error("Failed to update account type.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card id="change-account-type">
      <CardHeader>
        <CardTitle>Account Type</CardTitle>
        <CardDescription>
          This is your account type. Select the type of account you want to
          change it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="change-account-type-form"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="accountType"
              render={({ field, fieldState }) => (
                <FieldSet data-invalid={fieldState.invalid}>
                  <FieldLegend className="sr-only">Account Type</FieldLegend>
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
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          disabled={isLoading}
          form="change-account-type-form"
          size="sm"
          type="submit"
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </CardFooter>
    </Card>
  );
}
