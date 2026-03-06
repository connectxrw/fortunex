import "./polyfills";
import { Resend } from "@convex-dev/resend";
import { render } from "@react-email/components";
import { components } from "./_generated/api";
import type { ActionCtx } from "./_generated/server";
import VerifyOTP from "./emails/verifyOTP";

export const resend = new Resend(components.resend, {
  testMode: false,
});

export const sendOTPVerification = async (
  ctx: ActionCtx,
  {
    to,
    code,
  }: {
    to: string;
    code: string;
  }
) => {
  await resend.sendEmail(ctx, {
    from: "FortuneX <onboarding@notifications.rathon-rw.com>",
    to,
    subject: "[FortuneX] Sudo email verification code",
    html: await render(<VerifyOTP code={code} />),
  });
};
