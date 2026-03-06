"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.email(),
});

interface Props {
  className?: string;
}

export function OTPSignIn({ className }: Props) {
  const [isLoading, setLoading] = useState(false);
  const [isSent, setSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState<string>();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    await authClient.emailOtp.sendVerificationOtp(
      {
        email: values.email,
        type: "sign-in",
      },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => {
          setLoading(false);
          setSent(true);
          setEmail(values.email);
          toast.success("Verification code sent to your email!");
        },
        onError: (ctx) => {
          setLoading(false);
          toast.error(ctx.error.message || "Failed to send verification code");
        },
      },
    );

    setSent(true);
    setLoading(false);
  }

  async function onComplete(token: string) {
    if (!email) {
      return;
    }

    setIsVerifying(true);

    await authClient.signIn.emailOtp(
      {
        email,
        otp: token,
      },
      {
        onRequest: () => setIsVerifying(true),
        onSuccess: () => {
          setIsVerifying(false);
          toast.success("Successfully signed in!");
          setSent(false);
          router.push("/");
        },
        onError: (ctx) => {
          setIsVerifying(false);
          toast.error(ctx.error.message);
        },
      },
    );
  }

  if (isSent) {
    return (
      <div className={cn("flex flex-col items-center space-y-4", className)}>
        <div className="flex h-15.5 w-full items-center justify-center">
          {isVerifying ? (
            <div className="flex h-full w-full items-center justify-center border border-input bg-background/95">
              <div className="flex items-center space-x-2 rounded-md bg-background px-4 py-2 shadow-sm">
                <Spinner className="size-4 text-primary" />
                <span className="font-medium text-foreground text-sm">
                  Verifying...
                </span>
              </div>
            </div>
          ) : (
            <InputOTP
              autoFocus
              disabled={isVerifying}
              maxLength={6}
              onComplete={onComplete}
            >
              <InputOTPGroup>
                <InputOTPSlot className="size-14" index={0} />
                <InputOTPSlot className="size-14" index={1} />
                <InputOTPSlot className="size-14" index={2} />
                <InputOTPSlot className="size-14" index={3} />
                <InputOTPSlot className="size-14" index={4} />
                <InputOTPSlot className="size-14" index={5} />
              </InputOTPGroup>
            </InputOTP>
          )}
        </div>

        <div className="flex space-x-2">
          <span className="text-[#878787] text-sm">
            Didn't receive the email?
          </span>
          <button
            className="font-medium text-primary text-sm underline"
            disabled={isVerifying}
            onClick={() => setSent(false)}
            type="button"
          >
            Resend code
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
      <div className={cn("flex flex-col space-y-4", className)}>
        <FieldGroup>
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="sr-only" htmlFor="form-email">
                  Email
                </FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  autoCapitalize="false"
                  autoComplete="email"
                  autoCorrect="false"
                  className="min-h-10"
                  id="form-email"
                  placeholder="Enter email address"
                  spellCheck="false"
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />
        </FieldGroup>

        <Button
          className="flex h-10 w-full space-x-2 bg-primary px-6 py-4 font-medium text-secondary"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? (
            <div className="flex items-center gap-1">
              <Spinner className="size-4" />
              <span>Signing in...</span>
            </div>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </form>
  );
}
