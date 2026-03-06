import { useUploadFile } from "@convex-dev/r2/react";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import bannerImage from "@/public/gradients_10.jpg";
export default function CoverImage({
  coverImageUrl,
}: {
  coverImageUrl: string;
}) {
  const updateCoverImage = useMutation(
    api.business.index.updateBusinessCoverImage,
  );
  const removeCoverImage = useMutation(
    api.business.index.removeBusinessCoverImage,
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
      await updateCoverImage({
        coverImageKey: filekey,
      });
      toast.success("Cover image updated successfully");
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to update cover image");
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update cover image",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }
  const handleRemove = async () => {
    try {
      setIsLoading(true);
      await removeCoverImage();
      toast.success("Cover image removed successfully");
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to remove cover image");
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to remove cover image",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full">
      <h3 className="font-medium">Profile Cover Image</h3>
      <p className="text-muted-foreground text-sm">
        This image will appear across the top of your page
      </p>
      <div className="flex flex-col gap-8 pt-6 lg:flex-row">
        <div className="h-40 w-full max-w-72.5 overflow-hidden bg-muted p-4 lg:rounded-lg">
          {coverImageUrl ? (
            <AspectRatio ratio={16 / 9}>
              {" "}
              <Image
                alt="my image"
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={coverImageUrl || bannerImage}
              />
            </AspectRatio>
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            For the best results on all devices, use an image that&apos;s at
            least 2048 x 1152 pixels and 6MB or less.
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
              disabled={isLoading || !coverImageUrl}
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
