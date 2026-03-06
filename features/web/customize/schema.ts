import z from "zod";
import { homeFilters } from "@/config/data";

export const nameFormSchema = z.object({
  name: z
    .string()
    .min(5, "Name must be at least 5 characters.")
    .max(200, "Name must be at most 200 characters."),
});

export type TNameFormSchema = z.infer<typeof nameFormSchema>;

export const categoryFormSchema = z.object({
  category: z.enum(homeFilters.map((category) => category.value)),
});

export type TCategoryFormSchema = z.infer<typeof categoryFormSchema>;

export const handleFormSchema = z.object({
  handle: z
    .string()
    .min(2, "Handle must be at least 2 characters.")
    .max(32, "Handle must be at most 32 characters."),
});

export type THandleFormSchema = z.infer<typeof handleFormSchema>;

export const descriptionFormSchema = z.object({
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters."),
});

export type TDescriptionFormSchema = z.infer<typeof descriptionFormSchema>;

export const contactInfoFormSchema = z.object({
  email: z.email("Invalid email."),
  phone: z.string().min(10, "Phone number must be at least 10 characters."),
  location: z.string().min(2, "Location must be at least 2 characters."),
  latitude: z
    .number({ error: "Must be a valid number" })
    .min(-90, "Must be between -90 and 90")
    .max(90, "Must be between -90 and 90")
    .optional(),
  longitude: z
    .number({ error: "Must be a valid number" })
    .min(-180, "Must be between -180 and 180")
    .max(180, "Must be between -180 and 180")
    .optional(),
});

export type TContactInfoFormSchema = z.infer<typeof contactInfoFormSchema>;

export const linksFormSchema = z.object({
  links: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      }),
    )
    .optional(),
});

export type TLinksFormSchema = z.infer<typeof linksFormSchema>;

export const accountFormSchema = z.object({
  platform: z.string().min(1, "Please select a social media platform"),
  url: z.url("Please enter a valid URL"),
});

export type TAccountFormValues = z.infer<typeof accountFormSchema>;
