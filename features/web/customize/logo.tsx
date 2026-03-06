import { useUploadFile } from "@convex-dev/r2/react";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { UserRoundIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
export default function Logo({ profileImageUrl }: { profileImageUrl: string }) {
  const updateProfileImage = useMutation(
    api.business.index.updateBusinessProfileImage,
  );
  const removeProfileImage = useMutation(
    api.business.index.removeBusinessProfileImage,
  );
  const [isLoading, setIsLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const uploadFile = useUploadFile(api.uploadFiles);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function onSubmit() {
    try {
      setIsLoading(true);
      if (!selectedFile) {
        toast.error("Please select a file document to upload");
        return;
      }
      const filekey = await uploadFile(selectedFile);
      setSelectedFile(null);
      fileInput.current!.value = "";
      await updateProfileImage({
        profileImageKey: filekey,
      });
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to update profile picture");
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update profile picture",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }
  const handleRemove = async () => {
    try {
      setIsLoading(true);
      await removeProfileImage();
      toast.success("Profile picture removed successfully");
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to remove profile picture");
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to remove profile picture",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full">
      <h3 className="font-medium">Profile Logo</h3>
      <div className="flex flex-col gap-8 pt-6 lg:flex-row">
        <div className="flex h-40 w-full max-w-72.5 items-center justify-center overflow-hidden bg-muted p-4 lg:rounded-lg">
          {profileImageUrl ? (
            <Avatar className="size-28">
              <AvatarImage src={profileImageUrl} />
              <AvatarFallback>PC</AvatarFallback>
            </Avatar>
          ) : (
            <div className="relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground">
              <UserRoundIcon className="size-4" />
            </div>
          )}
        </div>
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            It&apos;s recommended to use a picture that&apos;s at least 98 x 98
            pixels and 4MB or less. Use a PNG or GIF (no animations) file.
          </p>

          <Input
            autoComplete="off"
            disabled={isLoading}
            id="file"
            multiple
            name="file"
            onChange={(event) => setSelectedFile(event.target.files![0])}
            ref={fileInput}
            type="file"
          />
          <div className="flex gap-2">
            <Button
              className="rounded-full"
              disabled={isLoading || !selectedFile}
              onClick={onSubmit}
              variant={"secondary"}
            >
              {isLoading ? "Uploading..." : "Change"}
            </Button>
            <Button
              className="rounded-full"
              disabled={isLoading || !profileImageUrl}
              onClick={handleRemove}
              variant={"secondary"}
            >
              {isLoading ? "Removing..." : "Remove"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// export default function PagePicture() {
//   return (
//     <div className="w-full max-w-3xl">
//       <h3 className="font-medium">Profile Picture</h3>
//       <p className="text-muted-foreground text-sm">
//         Your profile picture will appear where your channel is presented on
//         FortuneX.
//       </p>
//       <div className="flex flex-col gap-8 pt-6 lg:flex-row">
//         <div className="flex h-[160px] w-full max-w-[290px] items-center justify-center overflow-hidden bg-muted p-4 lg:rounded-lg">
//           <Avatar className="size-28">
//             <AvatarImage src="/profile.svg" />
//             <AvatarFallback>UC</AvatarFallback>
//           </Avatar>
//         </div>
//         <div className="space-y-4">
//           <p className="text-muted-foreground text-sm">
//             It&apos;s recommended to use a picture that&apos;s at least 98 x 98
//             pixels and 4MB or less. Use a PNG or GIF (no animations) file. Make
//             sure your picture follows the YouTube Community Guidelines.
//           </p>
//           <div className="flex gap-2">
//             <Button className="rounded-full" variant={"secondary"}>
//               Change
//             </Button>
//             <Button className="rounded-full" variant={"secondary"}>
//               Remove
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
