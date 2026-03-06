"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import {
  NoBusinessAccount,
  NoBusinessAccountInfo,
} from "@/features/web/business/no-business";
import { useFilters } from "@/lib/nuqs-params";
import { postFormSchema, type TPostFormSchema } from "./schema";
import { SubcategoryChips } from "./subcategory-chips";

export function NewPostForm() {
  const user = useQuery(api.auth.getCurrentUser);
  const business = useQuery(api.business.index.getMyBusiness);
  const router = useRouter();
  const newPost = useMutation(api.business.post.addNewPost);
  const [isDraft, setIsDraft] = useState(false);
  // const uploadFile = useUploadFile(api.uploadFiles);
  const [isLoading, setIsLoading] = useState(false);

  const [{ preview }, setSearchParams] = useFilters();
  const form = useForm<TPostFormSchema>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      ctaLink: "",
      ctaLabel: "",
      content: "",
      price: "",
      currency: "RWF",
      subcategory: "",
    },
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      setSearchParams({
        preview: {
          title: values.title || "",
          ctaLink: values.ctaLink || "",
          ctaLabel: values.ctaLabel || "",
          content: values.content || "",
          price: values.price || "",
          currency: values.currency || "",
          images: [], // TODO: handle images in preview when attachments are added
          // images: attachments.files.map((file) => file.url),
          open: preview?.open,
        },
      });
    });
    // when attacmentis added

    return () => subscription.unsubscribe();
  }, [form, setSearchParams, preview?.open]);

  async function onSubmit(values: TPostFormSchema) {
    setIsLoading(true);

    try {
      // Validate CTA fields
      if (!!values.ctaLink !== !!values.ctaLabel) {
        toast.error("Please provide both a CTA link and a CTA label.");
        return;
      }

      // Validate attachments
      // if (!attachments.files.length) {
      //   toast.error("Please add post cover image.");
      //   return;
      // }

      // Upload files
      const fileKeys: string[] = [];
      // const fileKeys = await Promise.all(
      //   attachments.files.map((file) => uploadFile(file.file))
      // );
      // check if ctalink have https if not add it
      const ctaLink =
        values.ctaLink && !values.ctaLink.startsWith("https")
          ? `https://${values.ctaLink}`
          : values.ctaLink;
      // Create post
      const result = await newPost({
        title: values.title,
        content: values.content,
        ctaLink,
        ctaLabel: values.ctaLabel,
        price: values.price,
        currency: values.currency,
        subcategory: values.subcategory || undefined,
        coverImageKeys: fileKeys,
        status: isDraft ? "draft" : "published",
      });

      toast.success(`Post "${result.title}" created successfully`);
      router.push(`/?post=${result.slug}`);

      // controller.attachments.clear();
      form.reset();
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to create post");
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to create post",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (!user || business === undefined) {
    return <Skeleton className="h-[50vh] w-full" />;
  }

  if (!business.success) {
    return <NoBusinessAccount />;
  }

  if (business.success && business.data === null) {
    return <NoBusinessAccountInfo />;
  }

  return (
    <>
      <div className="flex items-center justify-between pb-5">
        <Button
          asChild
          className="rounded-full"
          size="sm"
          type="button"
          variant="ghost"
        >
          <Link href="/posts">
            <ChevronLeftIcon />
            Back
          </Link>
        </Button>
        <Button
          className="rounded-full"
          onClick={() =>
            setSearchParams({
              preview: {
                ...preview,
                open: !preview.open,
              },
            })
          }
          size="sm"
          type="button"
          variant="secondary"
        >
          {preview?.open ? "Close Preview" : "See Preview"}
        </Button>
      </div>
      <form id="form-post" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-post-title">Post Title</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  disabled={isLoading}
                  id="form-post-title"
                  placeholder="Post Title"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field>
            <FieldLabel htmlFor="form-post-price">Price (optional)</FieldLabel>
            <FieldDescription>
              Price of the product or service being advertised.
            </FieldDescription>
            <div className="flex items-center gap-2">
              <Controller
                control={form.control}
                name="price"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      disabled={isLoading}
                      id="form-post-price"
                      placeholder="e.g. 10,000"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="currency"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Select
                      name={field.name}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        id="form-currency"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        <SelectItem value="RWF">RWF</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </div>
          </Field>

          <Controller
            control={form.control}
            name="content"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-post-content">Content</FieldLabel>
                <Textarea
                  {...field}
                  aria-invalid={fieldState.invalid}
                  className="min-h-24 resize-none"
                  disabled={isLoading}
                  id="form-post-description"
                  placeholder="Type your post description here..."
                  rows={6}
                />

                <FieldDescription>
                  Remember our community guidelines.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {business.data && (
            <Controller
              control={form.control}
              name="subcategory"
              render={({ field }) => (
                <SubcategoryChips
                  businessCategory={business.data!.category}
                  onChange={field.onChange}
                  value={field.value ?? ""}
                />
              )}
            />
          )}

          <FieldGroup>
            <FieldSet>
              <FieldLegend>Call to Action (Optional)</FieldLegend>
              <FieldDescription>
                Add call to action link to redirect users to after viewing the
                post.
              </FieldDescription>
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="ctaLink"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-post-referenceLink">
                        Link
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupAddon className="">https://</InputGroupAddon>
                        <InputGroupInput
                          {...field}
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                          disabled={isLoading}
                          id="form-post-referenceLink"
                          placeholder="example.com or wa.me/250799999999"
                        />
                      </InputGroup>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="ctaLabel"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-post-ctaLabel">
                        Label
                      </FieldLabel>
                      <FieldDescription>
                        Label for the call to action link.(eg. "Book Now")
                      </FieldDescription>

                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        disabled={isLoading}
                        id="form-post-ctaLabel"
                        placeholder="Label"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </FieldGroup>
      </form>

      <Field className="pt-8">
        <FieldLabel htmlFor="file">Upload Cover Image</FieldLabel>
        {/* add file upload */}
      </Field>

      <div className="flex flex-wrap justify-end gap-2">
        <Button
          className="rounded-full"
          disabled={isLoading}
          onClick={() => setIsDraft(true)}
          type="button"
          variant="secondary"
        >
          Save As Draft
        </Button>
        <Button
          className="rounded-full"
          disabled={isLoading}
          form="form-post"
          type="submit"
        >
          {isDraft
            ? isLoading
              ? "Saving..."
              : "Save"
            : isLoading
              ? "Posting..."
              : "Post"}
        </Button>
      </div>
    </>
  );
}
