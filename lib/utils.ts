import { type ClassValue, clsx } from "clsx";
import { ConvexError } from "convex/values";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const REGEX = /auth/i;

export const isAuthError = (error: unknown) => {
  // This broadly matches potentially auth related errors, can be rewritten to
  // work with your app's own error handling.
  const message =
    (error instanceof ConvexError && (error.data as string)) ||
    (error instanceof Error && error.message) ||
    (typeof error === "string" ? error : "");
  return (
    REGEX.test(message) || message.toLowerCase().includes("unauthenticated")
  );
};

export const getUserInitials = (name: string) => {
  if (!name) {
    return "U";
  }
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
