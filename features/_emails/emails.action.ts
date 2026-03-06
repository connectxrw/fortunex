"use server";

import { Resend } from "resend";
import type {
  TContactServerFormSchema,
  TFeedbackFormSchema,
  TReportServerFormSchema,
  TSubFormSchema,
} from "./schema";
import { SimpleEmail } from "./simple-email";
import { SubscribeEmail } from "./subscribe-email";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = "rathonrw@gmail.com";

/* ---------------------------------------------
 * Helpers
 * --------------------------------------------*/
function success() {
  return { success: true };
}

function failure(error: unknown) {
  return { success: false, error };
}

/* ---------------------------------------------
 * Subscribe
 * --------------------------------------------*/
export async function subscribe(formData: TSubFormSchema) {
  try {
    const { email } = formData;

    const contact = await resend.contacts.create({
      email,
    });

    if (contact.error) {
      return failure(contact.error);
    }

    await resend.emails.send({
      from: "Fortunex <notifications@notifications.rathon-rw.com>",
      to: email,
      subject: "Welcome to Fortunex",
      react: SubscribeEmail() as React.ReactElement,
      replyTo: ADMIN_EMAIL,
      tags: [{ name: "source", value: "website_subscribe" }],
    });

    return success();
  } catch (error) {
    return failure(error);
  }
}

/* ---------------------------------------------
 * Feedback
 * --------------------------------------------*/
export async function sendFeedback(formData: TFeedbackFormSchema) {
  try {
    const { email, feedback } = formData;

    const response = await resend.emails.send({
      from: "Fortunex Feedback <feedback@notifications.rathon-rw.com>",
      to: ADMIN_EMAIL,
      subject: "New Website Feedback",
      react: SimpleEmail({
        email,
        content: feedback,
      }) as React.ReactElement,
      replyTo: email,
      tags: [{ name: "source", value: "website_feedback" }],
    });

    if (response.error) {
      return failure(response.error);
    }

    return success();
  } catch (error) {
    return failure(error);
  }
}

/* ---------------------------------------------
 * Report Content
 * --------------------------------------------*/
export async function sendReport(formData: TReportServerFormSchema) {
  try {
    const { email, postTitle, postSlug, businessHandle, reason } = formData;

    const content = `
Post Title: ${postTitle}
Post Slug: ${postSlug}
Business Handle: ${businessHandle}
Reason: ${reason}
    `.trim();

    const response = await resend.emails.send({
      from: "Fortunex Reports <reports@notifications.rathon-rw.com>",
      to: ADMIN_EMAIL,
      subject: "New Content Report",
      react: SimpleEmail({
        email,
        content,
      }) as React.ReactElement,
      replyTo: email,
      tags: [{ name: "source", value: "website_report" }],
    });

    if (response.error) {
      return failure(response.error);
    }

    return success();
  } catch (error) {
    return failure(error);
  }
}

/* ---------------------------------------------
 * Contact Business
 * --------------------------------------------*/
export async function contactBusiness(formData: TContactServerFormSchema) {
  try {
    const { businessEmail, senderEmail, subject, message } = formData;

    const response = await resend.emails.send({
      from: "Fortunex Contact <contact@notifications.rathon-rw.com>",
      to: businessEmail,
      subject,
      react: SimpleEmail({
        email: senderEmail,
        content: message,
      }) as React.ReactElement,
      replyTo: senderEmail,
      tags: [{ name: "source", value: "business_contact" }],
    });

    if (response.error) {
      return failure(response.error);
    }

    return success();
  } catch (error) {
    return failure(error);
  }
}
