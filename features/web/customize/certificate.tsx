"use client";

import { useUploadFile } from "@convex-dev/r2/react";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { FileIcon, TrashIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { api } from "@/convex/_generated/api";

/* ───────────────────────── Business Name ───────────────────────── */

export function BusinessCertificate({
  certificateFileUrl,
}: {
  certificateFileUrl: string | null;
}) {
  const updateBusinessCertificate = useMutation(
    api.business.index.updateBusinessCertificate,
  );
  const deleteBusinessCertificate = useMutation(
    api.business.index.deleteBusinessCertificate,
  );
  const [isLoading, setIsLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const uploadFile = useUploadFile(api.uploadFiles);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      if (!selectedFile) {
        toast.error("Please select a file document to upload");
        return;
      }
      const filekey = await uploadFile(selectedFile);
      setSelectedFile(null);
      fileInput.current!.value = "";

      await updateBusinessCertificate({
        certificateFileKey: filekey,
      });

      toast.success("Business certificate updated successfully");
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(
          error.data.message || "Failed to update business certificate",
        );
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update business certificate",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCertificate = async () => {
    try {
      setIsLoading(true);
      await deleteBusinessCertificate();
      toast.success("Business certificate deleted successfully");
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(
          error.data.message || "Failed to delete business certificate",
        );
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to delete business certificate",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    fileInput.current!.value = "";
  };
  if (certificateFileUrl) {
    return (
      <div className="w-full max-w-3xl">
        <Field>
          <FieldLabel htmlFor="form-name">Certificate</FieldLabel>
          <FieldDescription>
            Add Your Business Certificate to get verified.
          </FieldDescription>

          <Item variant={"muted"}>
            <ItemMedia variant="icon">
              <FileIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Current Certificate</ItemTitle>
              <ItemDescription>
                <a
                  href={certificateFileUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  View Certificate
                </a>
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                disabled={isLoading}
                onClick={handleDeleteCertificate}
                size="icon"
                variant={"ghost"}
              >
                <TrashIcon />
              </Button>
            </ItemActions>
          </Item>
        </Field>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="form-name">Certificate</FieldLabel>
          <FieldDescription>
            Add Your Business Certificate to get verified.
          </FieldDescription>

          <Input
            disabled={isLoading}
            id="form-name"
            onChange={(e) => setSelectedFile(e.target.files![0])}
            placeholder="Business certificate"
            ref={fileInput}
            type="file"
          />
        </Field>
      </FieldGroup>

      <div className="mt-6 flex items-center gap-2">
        <Button
          className="rounded-full"
          disabled={isLoading || !selectedFile}
          onClick={onSubmit}
          size="sm"
          variant="secondary"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          className="rounded-full"
          disabled={isLoading || !selectedFile}
          onClick={handleReset}
          size="sm"
          variant="secondary"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
