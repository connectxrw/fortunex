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
import { handleFormSchema, type THandleFormSchema } from "./schema";

export function BusinessHandle({ handle }: { handle: string | undefined }) {
  const updateBusinessHandle = useMutation(
    api.business.index.updateBusinessHandle,
  );
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<THandleFormSchema>({
    resolver: zodResolver(handleFormSchema),
    defaultValues: { handle },
  });

  async function onSubmit(data: THandleFormSchema) {
    try {
      setIsLoading(true);
      await updateBusinessHandle({
        handle: data.handle,
      });

      toast.success("Business handle updated successfully");
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to update business handle");
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update business handle",
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
        id="form-customize-handle"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <Controller
            control={form.control}
            name="handle"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-handle">Handle</FieldLabel>
                <FieldDescription>
                  This will be part of your public URL.
                </FieldDescription>

                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  disabled={isLoading}
                  id="form-handle"
                  placeholder="your-handle"
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
        form="form-customize-handle"
        size="sm"
        type="submit"
        variant="secondary"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
