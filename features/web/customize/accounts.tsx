"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SOCIAL_MEDIA_PLATFORMS } from "@/config/data";
import { api } from "@/convex/_generated/api";
import { accountFormSchema, type TAccountFormValues } from "./schema";

// Social media platforms with icons

interface SocialMediaAccount {
  platform: string;
  url: string;
}
export function BusinessSocialAccounts({
  socialMediaAccounts,
}: {
  socialMediaAccounts: SocialMediaAccount[] | undefined;
}) {
  const addSocialAccount = useMutation(
    api.business.index.updateBusinessSocialMediaAccounts,
  );
  const deleteSocialAccount = useMutation(
    api.business.index.deleteBusinessSocialMediaAccount,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([]);
  const form = useForm<TAccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: { platform: "", url: "" },
  });

  useEffect(() => {
    if (socialMediaAccounts) {
      setAccounts(socialMediaAccounts);
    }
  }, [socialMediaAccounts]);

  const handleSubmit = async (values: TAccountFormValues) => {
    try {
      const newAccount: SocialMediaAccount = {
        platform: values.platform,
        url: values.url,
      };
      setAccounts((prev) => [...prev, newAccount]);

      await addSocialAccount({
        socialMediaAccounts: [...accounts, newAccount],
      });

      toast.success("Social account added successfully!");
      form.reset();
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to add social account");
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to add social account",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (account: SocialMediaAccount) => {
    try {
      await deleteSocialAccount({
        platform: account.platform,
        url: account.url,
      });
      toast.success("Social account deleted successfully!");
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to delete social account");
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to delete social account",
        );
      }
    }
  };

  const getPlatformLabel = (value: string) =>
    SOCIAL_MEDIA_PLATFORMS.find((p) => p.value === value)?.label || value;
  return (
    <>
      <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-4">
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Social Links</FieldLegend>
              <FieldDescription>
                Add social or website links for your business.
              </FieldDescription>
              <div className="flex flex-col gap-2 lg:flex-row">
                <Controller
                  control={form.control}
                  name="platform"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="sr-only" htmlFor="form-platform">
                        Platform
                      </FieldLabel>
                      <Select
                        name={field.name}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          aria-invalid={fieldState.invalid}
                          className="min-w-30"
                          id="form-platform"
                        >
                          <SelectValue placeholder="Select Platform" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          {SOCIAL_MEDIA_PLATFORMS.map((platform) => (
                            <SelectItem
                              key={platform.value}
                              value={platform.value}
                            >
                              <platform.icon className="mr-2 size-4" />
                              {platform.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="url"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="sr-only" htmlFor="form-url">
                        URL
                      </FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        disabled={isLoading}
                        id="form-url"
                        placeholder="https://example.com/profile"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </FieldSet>
          </FieldGroup>
          {accounts.length > 0 && (
            <div className="space-y-3">
              {accounts.map((account, index) => {
                const platform = SOCIAL_MEDIA_PLATFORMS.find(
                  (p) => p.value === account.platform,
                );
                const Icon = platform?.icon;

                return (
                  <div
                    className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-accent"
                    key={index}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {Icon && (
                        <Icon className="h-5 w-5 shrink-0 text-primary" />
                      )}
                      <div className="min-w-0 flex-1">
                        <Badge className="mb-2" variant="outline">
                          {getPlatformLabel(account.platform)}
                        </Badge>
                        <p className="truncate text-muted-foreground text-sm">
                          {account.url}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDelete(account)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Button
          className="rounded-full"
          disabled={isLoading}
          size="sm"
          type="submit"
          variant="secondary"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
      {/* <div className="w-full max-w-3xl">
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
      </div> */}
    </>
  );
}
