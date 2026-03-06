import { z } from "zod";

export const postFormSchema = z.object({
  title: z.string().min(5, "Post title must be at least 5 characters."),
  ctaLink: z.string().optional(),
  ctaLabel: z.string().optional(),
  content: z.string().min(20, "Description must be at least 20 characters."),
  price: z.string().optional(),
  currency: z.string().optional(),
  subcategory: z.string().optional(),
});

export type TPostFormSchema = z.infer<typeof postFormSchema>;
