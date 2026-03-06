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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { descriptionFormSchema, type TDescriptionFormSchema } from "./schema";

export function BusinessDescription({
  description,
}: {
  description: string | undefined;
}) {
  const updateBusinessDescription = useMutation(
    api.business.index.updateBusinessDescription,
  );
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TDescriptionFormSchema>({
    resolver: zodResolver(descriptionFormSchema),
    defaultValues: { description },
  });

  async function onSubmit(data: TDescriptionFormSchema) {
    try {
      setIsLoading(true);
      await updateBusinessDescription({
        description: data.description,
      });

      toast.success("Business description updated successfully");
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(
          error.data.message || "Failed to update business description",
        );
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update business description",
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
        id="form-customize-description"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-description">Description</FieldLabel>

                <Textarea
                  {...field}
                  aria-invalid={fieldState.invalid}
                  className="min-h-37.5"
                  disabled={isLoading}
                  id="form-description"
                  placeholder="Tell people about your business"
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
        form="form-customize-description"
        size="sm"
        type="submit"
        variant="secondary"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
