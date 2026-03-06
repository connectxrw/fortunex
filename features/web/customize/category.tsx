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
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { homeFilters } from "@/config/data";
import { api } from "@/convex/_generated/api";
import type { TBusinessCategory } from "@/types";
import { categoryFormSchema, type TCategoryFormSchema } from "./schema";

/* ───────────────────────── Business Category ───────────────────────── */

export function BusinessCategory({
  category,
}: {
  category: TBusinessCategory;
}) {
  const updateBusinessCategory = useMutation(
    api.business.index.updateBusinessCategory,
  );
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TCategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { category },
  });

  async function onSubmit(data: TCategoryFormSchema) {
    try {
      setIsLoading(true);
      await updateBusinessCategory({
        category: data.category,
      });

      toast.success("Business category updated successfully");
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to update business category");
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update business category",
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
        id="form-customize-category"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <Controller
            control={form.control}
            name="category"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="form-rhf-select-language">
                    Category
                  </FieldLabel>
                  <FieldDescription>
                    For best results, select the category of your business.
                  </FieldDescription>
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
      </form>

      <Button
        className="rounded-full"
        disabled={isLoading}
        form="form-customize-category"
        size="sm"
        type="submit"
        variant="secondary"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
