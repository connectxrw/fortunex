"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { AspectRatio } from "@/components/ui/aspect-ratio";
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
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { postFormSchema, type TPostFormSchema } from "./schema";
import { SubcategoryChips } from "./subcategory-chips";

export function EditPostForm({
  title,
  ctaLink,
  ctaLabel,
  content,
  price,
  currency,
  subcategory,
  businessCategory,
  coverImages,
  postId,
}: {
  title: string;
  ctaLink: string;
  ctaLabel: string;
  content: string;
  price: string;
  currency: string;
  subcategory: string;
  businessCategory: string;
  coverImages: { key: string; url: string }[];
  postId: Id<"post">;
}) {
  const router = useRouter();
  const editPost = useMutation(api.business.post.editPost);
  // const uploadFile = useUploadFile(api.uploadFiles);
  const deletePostImage = useMutation(api.business.post.deletePostImage);

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<TPostFormSchema>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title,
      ctaLink,
      ctaLabel,
      content,
      price,
      currency,
      subcategory,
    },
  });

  async function onSubmit(values: TPostFormSchema) {
    try {
      setIsLoading(true);
      // check if ctalink have https if not add it

      if (!!values.ctaLink !== !!values.ctaLabel) {
        toast.error("Please provide both a CTA link and a CTA label.");
        return;
      }

      const fileKeys: string[] = [];

      // Validate attachments
      // if (attachments.files.length > 0) {
      //   for (const file of attachments.files) {
      //     const fileKey = await uploadFile(file.file);
      //     fileKeys.push(fileKey);
      //   }
      // }
      const newCtaLink =
        values.ctaLink && !values.ctaLink.startsWith("https")
          ? `https://${values.ctaLink}`
          : values.ctaLink;

      const result = await editPost({
        title: values.title,
        ctaLink: newCtaLink,
        ctaLabel: values.ctaLabel,
        content: values.content,
        price: values.price,
        currency: values.currency,
        subcategory: values.subcategory || undefined,
        coverImageKeys: (coverImages.map((image) => image.key) || []).concat(
          fileKeys,
        ),
        postId,
      });
      toast.success(`Post "${result.title}" edited successfully`);
      router.push(`/posts/edit/${result.slug}?post=${result.slug}`);
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to edit post");
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to edit post",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeletePostImage = async (imageKey: string) => {
    try {
      setIsLoading(true);
      if (coverImages.length === 1) {
        toast.error("Please add at least one cover image.");
        return;
      }
      await deletePostImage({
        imageKey,
        postId,
      });
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to edit post");
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to edit post",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-5">
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
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className="min-h-24 resize-none"
                    disabled={isLoading}
                    id="form-post-description"
                    placeholder="Type your post description here..."
                    rows={6}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {field.value.length} characters
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  Remember our community guidelines.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="subcategory"
            render={({ field }) => (
              <SubcategoryChips
                businessCategory={businessCategory}
                onChange={field.onChange}
                value={field.value ?? ""}
              />
            )}
          />

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
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        disabled={isLoading}
                        id="form-post-referenceLink"
                        placeholder="https://example.com"
                      />
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

        <div className="grid grid-cols-2 gap-4">
          {coverImages.length > 0 &&
            coverImages.map((image) => (
              <AspectRatio
                className="relative rounded-lg bg-muted"
                key={image.key}
                ratio={16 / 9}
              >
                <img
                  alt={title}
                  className="aspect-square h-full w-full rounded-lg bg-muted object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
                  height={193}
                  src={image.url}
                  width={343}
                />
                <Button
                  className="absolute top-2 right-2 rounded-full hover:bg-destructive"
                  onClick={() => handleDeletePostImage(image.key)}
                  size="icon-sm"
                >
                  <TrashIcon />
                </Button>
              </AspectRatio>
            ))}
        </div>
      </Field>
      <Field className="flex justify-end" orientation="horizontal">
        <Button
          asChild
          className="rounded-full"
          disabled={isLoading}
          variant={"secondary"}
        >
          <Link href="/posts">Cancel</Link>
        </Button>
        <Button
          className="rounded-full"
          disabled={isLoading}
          form="form-post"
          type="submit"
        >
          {isLoading ? "Editing..." : "Edit Post"}
        </Button>
      </Field>
    </div>
  );
}
