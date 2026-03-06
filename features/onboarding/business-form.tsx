"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { homeFilters } from "@/config/data";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters."),
  businessCategory: z.enum(homeFilters.map((category) => category.value)),
});

export function OnboardingBusinessForm() {
  const router = useRouter();
  const user = useQuery(api.auth.getCurrentUser);
  const addBusiness = useMutation(api.business.index.addBusiness);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessCategory: "other",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const result = await addBusiness(values);
      toast.success(`Business "${result.name}" created successfully`);
      form.reset();
      router.push("/");
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to create business");
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to create business",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }
  if (user === undefined) {
    return (
      <div className="flex flex-col gap-4">
        <Input autoComplete="off" placeholder="Business Name" readOnly />
        <Skeleton className={cn(buttonVariants({ variant: "ghost" }))} />
      </div>
    );
  }
  return (
    <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="flex flex-col gap-5">
        <Controller
          control={form.control}
          name="businessName"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-base" htmlFor="form-businessName">
                Business Name
              </FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                disabled={isLoading}
                id="form-businessName"
                placeholder="Ex: Rathon Store"
              />
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="businessCategory"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="form-rhf-select-language">
                  Category
                </FieldLabel>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Select
                name={field.name}
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger
                  aria-invalid={fieldState.invalid}
                  className="min-w-30"
                  id="form-rhf-select-language"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {homeFilters.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />
      </FieldGroup>
      <Button
        className="mt-7 w-full"
        disabled={isLoading}
        form="form-rhf-demo"
        type="submit"
      >
        {isLoading ? (
          <>
            <Spinner />
            <span>Submitting...</span>
          </>
        ) : (
          "Submit"
        )}
      </Button>
    </form>
  );
}
