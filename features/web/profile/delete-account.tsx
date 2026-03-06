"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useConvexAuth, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { deleteUserFormSchema, type TDeleteUserFormValues } from "./schema";
export function DeleteUserCard() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <Skeleton className="h-50 w-full" />;
  }
  if (!isAuthenticated) {
    return null;
  }

  return <AuthenticatedDeleteUserCard />;
}

export function AuthenticatedDeleteUserCard() {
  const router = useRouter();
  const deleteUserPosts = useMutation(api.user.index.deleteCurrentUserPosts);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TDeleteUserFormValues>({
    resolver: zodResolver(deleteUserFormSchema),
    defaultValues: { title: "" },
  });

  const handleSubmit = async () => {
    console.log("handleSubmit");
    setIsSubmitting(true);
    try {
      const result = await deleteUserPosts();
      if (result.success) {
        form.reset();
        setIsOpen(false);
        toast.success("Your account has been deleted.");
        await authClient.deleteUser();
        router.push("/logout");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to delete account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>
            Permanently remove your Personal Account and all of its contents
            from the FortuneX platform. This action is not reversible, so please
            continue with caution.
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex justify-end" variant="destructive">
          <Button
            className="dark:bg-red-700"
            onClick={() => setIsOpen(true)}
            variant="destructive"
          >
            Delete Personal Account
          </Button>
        </CardFooter>
      </Card>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Delete Personal Account</DialogTitle>
            <DialogDescription>
              This will permanently delete all your files and other resources
              belonging to your Personal Account. To confirm, please type{" "}
              <strong>delete my account</strong> below.
            </DialogDescription>
          </DialogHeader>

          <form
            className="mt-6 flex flex-col gap-6 lg:gap-10"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="text-muted-foreground text-sm tracking-tight"
                    htmlFor="form-delete-account"
                  >
                    Type{" "}
                    <strong className="text-primary">delete my account</strong>{" "}
                    to confirm:
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    disabled={isSubmitting}
                    id="form-delete-account"
                    placeholder="delete my account"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <DialogFooter>
              <Button
                onClick={() => setIsOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>

              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? (
                  <div className="flex items-center gap-1">
                    <Spinner />
                    <span>Deleting...</span>
                  </div>
                ) : (
                  "Delete Account"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
