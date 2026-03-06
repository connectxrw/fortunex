"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { api } from "@/convex/_generated/api";
import { linksFormSchema, type TLinksFormSchema } from "./schema";

export function BusinessSocialLinks({
  socialLinks,
}: {
  socialLinks: string[] | undefined;
}) {
  const updateBusinessLinks = useMutation(
    api.business.index.updateBusinessLinks,
  );
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TLinksFormSchema>({
    resolver: zodResolver(linksFormSchema),
    defaultValues: {
      links:
        socialLinks && socialLinks.length > 0
          ? socialLinks.map((link) => ({ value: link }))
          : [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "links",
  });

  async function onSubmit(data: TLinksFormSchema) {
    try {
      setIsLoading(true);
      const links = data.links?.map((l) => l.value);

      await updateBusinessLinks({
        links,
      });

      toast.success("Business links updated successfully");
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to update business links");
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update business links",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <form id="form-customize-links" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Social Links</FieldLegend>
            <FieldDescription>
              Add social or website links for your business.
            </FieldDescription>

            <FieldGroup>
              {fields.map((item, index) => (
                <Controller
                  control={form.control}
                  key={item.id}
                  name={`links.${index}.value`}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          aria-invalid={fieldState.invalid}
                          disabled={isLoading}
                          id={`form-links-${index}`}
                          placeholder="https://example.com"
                        />

                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            aria-label="Remove link"
                            disabled={fields.length === 1}
                            onClick={() => remove(index)}
                            size="icon-xs"
                            title="Remove link"
                          >
                            <TrashIcon />
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>

                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              ))}
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
      </form>

      <div className="flex gap-4 pt-4">
        <Button
          className="rounded-full"
          onClick={() => append({ value: "" })}
          size="sm"
          type="button"
          variant="secondary"
        >
          <PlusIcon />
          Add Link
        </Button>

        <Button
          className="rounded-full"
          disabled={isLoading}
          form="form-customize-links"
          size="sm"
          type="submit"
          variant="secondary"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
