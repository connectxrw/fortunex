"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { nameFormSchema, type TNameFormSchema } from "./schema";

/* ───────────────────────── Business Name ───────────────────────── */

export function BusinessName({ name }: { name: string | undefined }) {
  const updateBusinessName = useMutation(api.business.index.updateBusinessName);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TNameFormSchema>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: { name },
  });

  async function onSubmit(data: TNameFormSchema) {
    try {
      setIsLoading(true);
      await updateBusinessName({
        name: data.name,
      });

      toast.success("Business name updated successfully");
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to update business name");
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update business name",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <form
        className="pb-6"
        id="form-customize-name"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-name">Name</FieldLabel>
                <FieldDescription>
                  Choose a page name that represents your business.
                </FieldDescription>

                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  disabled={isLoading}
                  id="form-name"
                  placeholder="Business name"
                />

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </form>

      <Button
        className="rounded-full"
        disabled={isLoading}
        form="form-customize-name"
        size="sm"
        type="submit"
        variant="secondary"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
