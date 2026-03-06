"use client";

import { MoveDiagonalIcon, Plus, Upload, VideoIcon, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShopifyDropzoneProps {
  accept?: Record<string, string[]>;
  disabled?: boolean;
  helpText?: string;
  maxSize?: number;
  onDrop?: (acceptedFiles: File[]) => void;
  onFilesChange?: (files: File[]) => void;
  primaryAction?: () => void;
  selectButtonText?: string;
  uploadButtonText?: string;
}

export function Dropzone({
  onDrop,
  onFilesChange,
  accept = {
    "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    "video/*": [".mp4", ".webm", ".mov"],
  },
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
  helpText = "Accepts images and videos",
  uploadButtonText = "Upload new",
  selectButtonText = "Select existing",
  primaryAction,
}: ShopifyDropzoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDropCallback = useCallback(
    (acceptedFiles: File[]) => {
      setFiles((prev) => [...prev, ...acceptedFiles]);

      // Generate previews for images
      for (const file of acceptedFiles) {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
        }
      }

      if (onDrop) {
        onDrop(acceptedFiles);
      }

      if (onFilesChange) {
        onFilesChange([...files, ...acceptedFiles]);
      }
    },
    [onDrop, onFilesChange, files],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept,
    maxSize,
    disabled,
    noClick: files.length > 0,
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (onFilesChange) {
      onFilesChange(newFiles);
    }
  };

  const handleAddMore = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {files.length === 0 && (
        // Dropzone view
        <div
          {...getRootProps()}
          className={cn(
            "relative rounded-lg border-2 border-dashed transition-colors",
            "flex flex-col items-center justify-center gap-4 p-8 md:p-12",
            "cursor-pointer",
            isDragActive
              ? "border-primary bg-muted"
              : "border-border hover:bg-muted",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <input {...getInputProps()} id="upload-file" ref={fileInputRef} />

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              className="rounded-lg"
              onClick={handleAddMore}
              size="sm"
              type="button"
              variant="outline"
            >
              {uploadButtonText}
            </Button>
            {primaryAction && (
              <Button
                className="rounded-lg"
                onClick={primaryAction}
                size="sm"
                type="button"
                variant="outline"
              >
                {selectButtonText}
              </Button>
            )}
          </div>

          {/* Help Text */}
          {helpText && (
            <p className="max-w-md text-center text-muted-foreground text-sm">
              {helpText}
            </p>
          )}
        </div>
      )}
      {files.length > 0 && (
        // Grid view with thumbnails
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {files.map((file, index) => (
            <div className="group relative" key={`${file.name}-${index}`}>
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                {file.type.startsWith("image/") ? (
                  <Image
                    alt={file.name}
                    className="object-cover"
                    fill
                    src={URL.createObjectURL(file)}
                  />
                ) : file.type.startsWith("video/") ? (
                  <div className="flex flex-col items-center gap-2">
                    <VideoIcon />
                  </div>
                ) : file.type.includes("model") ||
                  file.name.endsWith(".glb") ||
                  file.name.endsWith(".gltf") ? (
                  <div className="flex flex-col items-center gap-2">
                    <MoveDiagonalIcon />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="size-8 text-muted-foreground" />
                    <span className="text-muted-foreground text-xs">File</span>
                  </div>
                )}

                {/* Remove button */}
                <Button
                  aria-label="Remove file"
                  className="absolute top-1 right-1 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => removeFile(index)}
                  size="icon"
                  type="button"
                  variant={"destructive"}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Add more button */}
          <div
            {...getRootProps()}
            className={cn(
              "relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors",
              isDragActive
                ? "border-primary bg-muted"
                : "border-border hover:bg-muted",
            )}
          >
            <input {...getInputProps()} ref={fileInputRef} />
            <Button
              className="rounded-full text-muted-foreground"
              onClick={handleAddMore}
              size="icon-lg"
              type="button"
              variant={"ghost"}
            >
              <Plus className="size-8" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function SmallDropzone({
  onDrop,
  onFilesChange,
  removeImage,
  accept = {
    "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    "video/*": [".mp4", ".webm", ".mov"],
    "model/*": [".glb", ".gltf"],
  },
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
  images,
}: ShopifyDropzoneProps & {
  images: { key: string; url: string }[];
  removeImage: (key: string) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDropCallback = useCallback(
    (acceptedFiles: File[]) => {
      setFiles((prev) => [...prev, ...acceptedFiles]);

      // Generate previews for images
      for (const file of acceptedFiles) {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
        }
      }

      if (onDrop) {
        onDrop(acceptedFiles);
      }

      if (onFilesChange) {
        onFilesChange([...files, ...acceptedFiles]);
      }
    },
    [onDrop, onFilesChange, files],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept,
    maxSize,
    disabled,
    noClick: files.length > 0,
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (onFilesChange) {
      onFilesChange(newFiles);
    }
  };

  const handleAddMore = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((im, index) => (
          <div className="group relative" key={index}>
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
              <Image
                alt="Product Image"
                className="object-cover"
                fill
                src={im.url}
              />

              {/* Remove button */}
              <Button
                aria-label="Remove file"
                className="absolute top-1 right-1 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => removeImage(im.key)}
                size="icon"
                type="button"
                variant={"destructive"}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        ))}

        {files.map((file, index) => (
          <div className="group relative" key={`${file.name}-${index}`}>
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
              {file.type.startsWith("image/") ? (
                <Image
                  alt={file.name}
                  className="object-cover"
                  fill
                  src={URL.createObjectURL(file)}
                />
              ) : file.type.startsWith("video/") ? (
                <div className="flex flex-col items-center gap-2">
                  <VideoIcon />
                </div>
              ) : file.type.includes("model") ||
                file.name.endsWith(".glb") ||
                file.name.endsWith(".gltf") ? (
                <div className="flex flex-col items-center gap-2">
                  <MoveDiagonalIcon />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="size-8 text-muted-foreground" />
                  <span className="text-muted-foreground text-xs">File</span>
                </div>
              )}

              {/* Remove button */}
              <Button
                aria-label="Remove file"
                className="absolute top-1 right-1 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => removeFile(index)}
                size="icon"
                type="button"
                variant={"destructive"}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add more button */}
        <div
          {...getRootProps()}
          className={cn(
            "relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors",
            isDragActive
              ? "border-primary bg-muted"
              : "border-border hover:bg-muted",
          )}
        >
          <input {...getInputProps()} ref={fileInputRef} />
          <Button
            className="rounded-full text-muted-foreground"
            onClick={handleAddMore}
            size="icon-lg"
            type="button"
            variant={"ghost"}
          >
            <Plus className="size-8" />
          </Button>
        </div>
      </div>
    </div>
  );
}
