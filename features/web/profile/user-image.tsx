"use client";
import { usePreloadedAuthQuery } from "@convex-dev/better-auth/nextjs/client";
import { type Preloaded, useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { getUserInitials } from "@/lib/utils";
import profile from "@/public/profile.svg";

export function UserImageCard({
  preloadedUserQuery,
}: {
  preloadedUserQuery: Preloaded<typeof api.auth.getCurrentUser>;
}) {
  const user = usePreloadedAuthQuery(preloadedUserQuery);
  const updateAvatar = useMutation(api.user.index.updateAvatar);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type");
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateAvatar = async () => {
    try {
      setIsUploading(true);
      const result = await updateAvatar({
        avatar: image ? await convertImageToBase64(image) : "",
      });
      if (result) {
        toast.success("Avatar updated successfully!");
      } else {
        toast.error("Failed to update avatar.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update avatar.");
    } finally {
      setIsUploading(false);
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleResetAvatar = async () => {
    setIsUploading(true);
    const result = await updateAvatar({ avatar: "" });
    if (result) {
      toast.success("Avatar reset successfully!");
    } else {
      toast.error("Failed to reset avatar.");
    }
    setIsUploading(false);
    setImage(null);
    setImagePreview(null);
  };
  if (user === undefined) {
    return null;
  }
  if (!user) {
    return null;
  }

  const avatarSrc = imagePreview ?? user.image ?? profile.src;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avatar</CardTitle>
        <CardDescription>
          Click on the avatar to upload a custom one from your files.
        </CardDescription>
        <CardAction>
          <label
            className="group relative float-right flex cursor-pointer rounded-full transition active:scale-95"
            htmlFor="avatar_field"
          >
            <Avatar className="size-20">
              <AvatarImage src={avatarSrc} />
              <AvatarFallback>
                {getUserInitials(user.username || user.name)}
              </AvatarFallback>
            </Avatar>
          </label>
          <Input
            accept="image/*"
            className="hidden w-full"
            id="avatar_field"
            onChange={handleImageChange}
            type="file"
          />
        </CardAction>
      </CardHeader>

      <CardFooter className="flex items-center justify-between">
        <p className="font-normal text-primary/60 text-sm">
          An avatar is optional but strongly recommended.
        </p>
        <div>
          {imagePreview ? (
            <div className="flex items-center gap-2">
              <Button
                disabled={isUploading}
                onClick={handleUpdateAvatar}
                size="sm"
                type="button"
              >
                Update
              </Button>
              <Button
                disabled={isUploading}
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                size="sm"
                type="button"
                variant={"destructive"}
              >
                Remove
              </Button>
            </div>
          ) : (
            <Button
              disabled={isUploading}
              onClick={handleResetAvatar}
              size="sm"
              type="button"
            >
              Reset
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
