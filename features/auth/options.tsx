import { GoogleSignIn } from "@/features/auth/google-sign-in";
import { OTPSignIn } from "./otp-sign-in";

export default function LoginOptions() {
  return (
    <>
      {/* Sign In Options */}
      <div className="flex w-full items-center justify-center space-y-3">
        <GoogleSignIn />
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-border border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 font-sans text-muted-foreground">
            or
          </span>
        </div>
      </div>
      <OTPSignIn />
    </>
  );
}
