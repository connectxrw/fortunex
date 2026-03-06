import z from "zod";

export const SubFormSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email address." })
    .min(5, { message: "Email must be at least 5 characters." }),
});

export type TSubFormSchema = z.infer<typeof SubFormSchema>;

export const FeedbackFormSchema = z.object({
  email: z.string(),
  feedback: z.string(),
});

export type TFeedbackFormSchema = z.infer<typeof FeedbackFormSchema>;

export const ReportFormSchema = z.object({
  email: z.email(),
  reason: z.string(),
});

export type TReportFormSchema = z.infer<typeof ReportFormSchema>;

export const ReportServerFormSchema = z.object({
  email: z.string(),
  postTitle: z.string(),
  postSlug: z.string(),
  businessHandle: z.string(),
  reason: z.string(),
});

export type TReportServerFormSchema = z.infer<typeof ReportServerFormSchema>;

export const ContactFormSchema = z.object({
  subject: z.string(),
  message: z.string(),
});

export type TContactFormSchema = z.infer<typeof ContactFormSchema>;

export const ContactServerFormSchema = z.object({
  businessEmail: z.string(),
  senderEmail: z.string(),
  subject: z.string(),
  message: z.string(),
});

export type TContactServerFormSchema = z.infer<typeof ContactServerFormSchema>;
