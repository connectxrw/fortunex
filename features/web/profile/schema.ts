import z from "zod";
export const usernameFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters long.",
    })
    .max(32, {
      message: "Username must be at most 32 characters long.",
    })
    .toLowerCase()
    .trim()
    .regex(
      /^[a-zA-Z0-9]+$/,
      "Username may only contain alphanumeric characters.",
    ),
});

export type TUsernameFormValues = z.infer<typeof usernameFormSchema>;

export const displayNameFormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters long.",
    })
    .max(50, {
      message: "Name must be at most 50 characters long.",
    }),
});
export type TDisplayNameFormValues = z.infer<typeof displayNameFormSchema>;

export const emailFormSchema = z.object({
  email: z.email(),
});
export type TEmailFormValues = z.infer<typeof emailFormSchema>;

export const deleteUserFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Please type 'delete my account' to confirm." })
    .refine((val) => val.trim().toLowerCase() === "delete my account", {
      message: "You must type exactly: delete my account",
    }),
});
export type TDeleteUserFormValues = z.infer<typeof deleteUserFormSchema>;

export const accTypeformSchema = z.object({
  accountType: z.enum(["personal", "business"]),
});

export type TAccTypeFormValues = z.infer<typeof accTypeformSchema>;
